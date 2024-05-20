import { Request, Response } from 'express';
import prisma from '@/prisma';

export class PaymentController {
  async confirmPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, method } = req.body;

      // Validasi data pembayaran
      if (!orderId || !amount || !method) {
        return res.status(400).send({ error: 'Invalid payment data' });
      }

      // Cek apakah order dengan orderId tertentu ada
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        return res.status(400).send({ error: 'Order not found' });
      }

      // Cek apakah pembayaran untuk orderId tertentu sudah ada
      const existingPayment = await prisma.payment.findFirst({
        where: {
          orderId: orderId,
        },
      });

      if (!existingPayment) {
        return res
          .status(400)
          .send({ error: 'Payment for this order does not exist' });
      }

      // Update status payment menjadi "Completed"
      await prisma.transaction.updateMany({
        where: {
          paymentId: existingPayment.id,
        },
        data: {
          status: 'Completed',
        },
      });

      // Update status order menjadi "Paid"
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'Paid',
        },
      });

      return res
        .status(200)
        .send({ message: 'Payment confirmed successfully' });
    } catch (error) {
      console.error('Error confirming payment:', error);
      return res.status(400).send({ error: 'Failed to confirm payment' });
    }
  }

  async getTransactionHistory(req: Request, res: Response) {
    console.log('Received userId:', req.params.userId);
    const userId = parseInt(req.params.userId, 10);
    console.log('Parsed userId:', userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'User ID tidak valid.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Order: {
            where: { status: 'Paid' },
            include: {
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
          },
          Points: { select: { points: true } },
          discountVoucher: {
            select: { discountCoupon: true, discountPercentage: true },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
      }

      const response = {
        userId: user.id,
        userName: user.username,
        orderItems: user.Order.map((order, index) => ({
          orderItem: index + 1,
          tanggalOrder: order.orderDate,
          status: order.status,
          pointsUsed: user.Points.length > 0 ? user.Points[0].points : 0,
          discountVoucherUsed: user.discountVoucher || [],
          jumlahDibayarkan: order.total,
          metodePembayaran: order.Payment?.method,
          event: order.OrderItem.map((item) => ({
            eventId: item.event.id,
            namaEvent: item.event.eventName,
            category: item.event.eventCategory,
            hargaTiket: item.event.EventPrice?.ticketPrice || 0,
            quantity: item.quantity,
            totalHarga:
              item.quantity * (item.event.EventPrice?.ticketPrice || 0),
          })),
        })),
      };

      res.status(200).send(response);
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: 'Terjadi kesalahan saat mengambil riwayat transaksi:',
        error,
      });
    }
  }
}
