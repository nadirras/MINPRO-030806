import { Request, Response } from 'express';
import prisma from '@/prisma';
import { StatusOrder, StatusTransaction } from '@prisma/client';

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { voucherCode, pointsToUse, cartItemsToCheckout, paymentMethod } =
        req.body;
      console.log('Received request payload:', req.body);
      if (
        !Array.isArray(cartItemsToCheckout) ||
        cartItemsToCheckout.length === 0
      ) {
        console.log('Cart items to checkout are missing or invalid');
        return res.status(400).send({ error: 'Select cart items to checkout' });
      }

      let totalBeforeDiscount = 0;
      let totalAfterDiscount = 0;
      let discountVoucherData: {
        discountPercentage: number;
        discountCoupon: string;
        discountAmount: number;
      } | null = null;
      let usedPoints = 0;
      let checkoutItems: {
        id: number;
        eventName: string;
        quantity: number;
        price: number;
      }[] = [];
      let orderId: number | undefined; // Deklarasikan orderId

      await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
          where: {
            userId: req.user?.id,
          },
          include: {
            CartItem: {
              include: {
                event: {
                  include: {
                    EventPrice: true,
                  },
                },
              },
            },
          },
        });

        if (!cart) {
          throw new Error('Keranjang tidak ditemukan');
        }

        const cartItems = cart.CartItem.filter((item) =>
          cartItemsToCheckout.includes(item.id),
        );
        if (cartItems.length === 0) {
          throw new Error('Tidak ada item yang valid untuk di-checkout');
        }

        totalBeforeDiscount = cartItems.reduce(
          (sum, item) =>
            sum + (item.event.EventPrice?.ticketPrice || 0) * item.quantity,
          0,
        );
        totalAfterDiscount = totalBeforeDiscount;

        // Validasi dan terapkan voucher diskon
        if (voucherCode) {
          const discountVoucher = await tx.discountVoucher.findFirst({
            where: {
              discountCoupon: voucherCode,
              discount_status: 'Active',
              expired_date: { gt: new Date() },
            },
          });

          if (discountVoucher) {
            const discountAmount =
              totalBeforeDiscount * (discountVoucher.discountPercentage / 100);
            totalAfterDiscount -= discountAmount;
            discountVoucherData = {
              discountCoupon: discountVoucher.discountCoupon,
              discountPercentage: discountVoucher.discountPercentage,
              discountAmount,
            };

            // Update status voucher menjadi expired
            await tx.discountVoucher.update({
              where: { id: discountVoucher.id },
              data: { discount_status: 'Expired' },
            });
          } else {
            throw new Error('Voucher diskon tidak valid atau sudah kadaluarsa');
          }
        }

        // Validasi dan terapkan poin
        if (pointsToUse) {
          const userPoints = await tx.points.findFirst({
            where: {
              userId: req.user?.id,
              point_status: 'Active',
              expired_date: { gt: new Date() },
            },
          });

          if (userPoints && userPoints.points >= pointsToUse) {
            usedPoints = pointsToUse;
            totalAfterDiscount -= pointsToUse;
          } else {
            throw new Error('Poin tidak cukup atau sudah kadaluarsa');
          }
        }

        const order = await tx.order.create({
          data: {
            userId: req.user?.id || 0,
            total: totalAfterDiscount || 0,
            status: StatusOrder.WaitingConfirmation,
            expiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Atur expiredDate menjadi 24 jam dari sekarang
          },
        });

        orderId = order.id; // Simpan ID pesanan

        checkoutItems = cartItems.map((cartItem) => ({
          id: cartItem.event.id,
          eventName: cartItem.event.eventName,
          quantity: cartItem.quantity,
          price: cartItem.event.EventPrice?.ticketPrice || 0,
        }));

        await Promise.all(
          cartItems.map(async (cartItem) => {
            // Kurangi jumlah kursi yang tersedia
            await tx.event.update({
              where: { id: cartItem.eventId },
              data: { availableSeats: { decrement: cartItem.quantity } },
            });

            // Buat item pesanan
            await tx.orderItem.create({
              data: {
                orderId: order.id,
                eventId: cartItem.eventId,
                quantity: cartItem.quantity,
              },
            });
          }),
        );

        // Hapus item yang di-checkout dari keranjang
        await tx.cartItem.deleteMany({
          where: {
            id: { in: cartItemsToCheckout },
          },
        });

        // Buat pembayaran untuk pesanan
        const payment = await tx.payment.create({
          data: {
            orderId: order.id,
            amount: totalAfterDiscount,
            method: paymentMethod,
          },
        });

        // Buat transaksi untuk pembayaran
        await tx.transaction.create({
          data: {
            userId: req.user?.id || 0,
            paymentId: payment.id, // Gunakan ID pembayaran yang valid
            status: StatusTransaction.Pending,
          },
        });

        // Setup job untuk mengubah status pesanan menjadi canceled setelah 24 jam jika tidak dibayar
        setTimeout(
          async () => {
            const orderStatus = await prisma.order.findUnique({
              where: { id: order.id },
              select: { status: true },
            });

            if (orderStatus?.status === StatusOrder.Pending) {
              await prisma.order.update({
                where: { id: order.id },
                data: { status: StatusOrder.Cancel },
              });
            }
          },
          24 * 60 * 60 * 1000,
        );
      });

      const response = {
        status: 'ok',
        orderId: orderId, // Tambahkan ID pesanan ke dalam respons
        message: 'Pesanan berhasil dibuat dan menunggu proses pembayaran',
        checkoutItems,
        paymentMethod,
        discountVoucher: discountVoucherData,
        usedPoints,
        totalAmountBeforeDiscount: totalBeforeDiscount,
        totalAmountAfterDiscount: totalAfterDiscount,
        paymentStatus: totalAfterDiscount === 0 ? 'Paid' : 'Pending',
      };

      res.status(200).send(response);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(400).send({
        status: 'error',
        message: 'Failed create order!',
      });
    }
  }

  //untuk mendapatkan order detail untuk setiap id user
  async getOrderDetails(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).send({ error: 'Invalid user ID' });
      }

      // Get order details by user ID
      const orders = await prisma.order.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,
          OrderItem: {
            include: {
              event: {
                include: {
                  EventPrice: true,
                },
              },
            },
          },
          Payment: true,
        },
      });

      if (orders.length === 0) {
        return res.status(404).send({ error: 'No orders found for this user' });
      }

      const formattedOrders = orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        username: order.user.username,
        total: order.total,
        status: order.status,
        orderDate: order.orderDate,
        expiredDate: order.expiredDate,
        paymentMethod: order.Payment ? order.Payment.method : '',
        OrderItem: order.OrderItem.map((orderItem) => ({
          eventId: orderItem.eventId,
          eventName: orderItem.event.eventName,
          quantity: orderItem.quantity,
          ticketPrice: orderItem.event.EventPrice
            ? orderItem.event.EventPrice.ticketPrice
            : 0,
          totalPricePerEvent:
            (orderItem.event.EventPrice
              ? orderItem.event.EventPrice.ticketPrice
              : 0) * orderItem.quantity,
        })),
      }));

      return res.status(200).send({ orders: formattedOrders });
    } catch (error) {
      console.error('Error fetching order details:', error);
      return res.status(500).send({ error: 'Failed to fetch order details' });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    // Validasi status baru
    const validStatuses = ['Paid', 'Cancel'];

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).send({ error: 'Invalid order status.' });
    }

    try {
      // Konversi orderId ke integer
      const parsedOrderId = parseInt(orderId, 10);

      if (isNaN(parsedOrderId)) {
        return res.status(400).json({ error: 'Invalid order ID.' });
      }

      // Cari pesanan berdasarkan ID
      const order = await prisma.order.findUnique({
        where: { id: parsedOrderId },
        include: {
          OrderItem: true,
          Payment: true,
          user: {
            select: { discountVoucher: true, Points: true },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }

      if (newStatus === 'Cancel') {
        // Mengembalikan jumlah available seats yang sebelumnya berkurang karena proses checkout
        await Promise.all(
          order.OrderItem.map(async (orderItem: any) => {
            const event = await prisma.event.findUnique({
              where: { id: orderItem.eventId },
            });
            if (event) {
              await prisma.event.update({
                where: { id: orderItem.eventId },
                data: {
                  availableSeats: event.availableSeats + orderItem.quantity,
                },
              });
            }
          }),
        );

        // Mengembalikan voucher diskon dan poin jika status order sebelumnya adalah WaitingConfirmation
        if (order.status === 'WaitingConfirmation') {
          if (order.user?.discountVoucher.length > 0) {
            await Promise.all(
              order.user.discountVoucher.map(async (voucher: any) => {
                await prisma.discountVoucher.update({
                  where: { id: voucher.id },
                  data: { discount_status: 'Active' },
                });
              }),
            );
          }

          if (order.user?.Points.length > 0) {
            const userPoints = order.user.Points[0]; // Asumsi user hanya memiliki satu entri points
            if (
              userPoints &&
              userPoints.point_status === 'Expired' &&
              userPoints.expired_date > new Date()
            ) {
              await prisma.points.update({
                where: { id: userPoints.id },
                data: { point_status: 'Active' },
              });
            }
          }
        }
      }

      // Update status pesanan
      const updatedOrder = await prisma.order.update({
        where: { id: parsedOrderId },
        data: { status: newStatus },
        include: {
          OrderItem: true,
          Payment: true,
        },
      });

      return res.status(200).send({
        message: 'Order status successfully updated.',
        order: updatedOrder,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(400).send({
        error: 'Internal server error.',
      });
    }
  }
}
