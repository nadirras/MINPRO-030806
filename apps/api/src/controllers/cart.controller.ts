import { Request, Response } from 'express';
import prisma from '@/prisma';

export class CartController {
  async addToCart(req: Request, res: Response) {
    try {
      const { eventId, quantity } = req.body;
      const userId = req.user?.id;

      if (!eventId || !quantity) {
        return res.status(400).send({
          status: 'error',
          message: 'Event ID and quantity are required',
        });
      }

      // Periksa apakah userId ada dalam request
      if (!userId) {
        return res.status(400).send({
          status: 'error',
          message: 'User ID is required',
        });
      }

      // Fungsi untuk menemukan cart berdasarkan userId
      const findCart = async (userId: number) => {
        return await prisma.cart.findUnique({
          where: {
            userId: userId,
          },
          include: {
            CartItem: true,
          },
        });
      };

      // Fungsi untuk membuat cart baru
      const createCart = async (userId: number) => {
        return await prisma.cart.create({
          data: {
            userId: userId,
          },
        });
      };

      // Cek apakah user sudah memiliki cart
      let cart = await findCart(userId);

      // Jika belum memiliki cart, buat cart baru
      if (!cart) {
        cart = await createCart(userId);
      }

      // Logika untuk memesan tiket
      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if (!event) {
        return res.status(404).send({
          status: 'error',
          message: 'Event not found',
        });
      }

      if (event.availableSeats < quantity) {
        return res.status(400).send({
          status: 'error',
          message: 'Not enough available seats',
        });
      }

      // Update jumlah kursi yang tersedia
      await prisma.event.update({
        where: { id: eventId },
        data: { availableSeats: event.availableSeats - quantity },
      });

      // Cek apakah CartItem sudah ada untuk eventId yang diberikan
      let cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          eventId: eventId,
        },
      });

      // Jika CartItem sudah ada, update jumlahnya
      if (cartItem) {
        cartItem = await prisma.cartItem.update({
          data: { quantity: cartItem.quantity + quantity },
          where: { id: cartItem.id },
        });
      } else {
        // Jika belum ada, buat CartItem baru
        cartItem = await prisma.cartItem.create({
          data: {
            eventId,
            quantity,
            cartId: cart.id,
          },
        });
      }

      res.status(200).send({
        status: 'OK',
        message: 'Add to cart success',
        userId,
        cartItem,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: 'Add to card failed',
      });
    }
  }

  // async applyDiscountToCart(req: Request, res: Response) {
  //   const { userId, discountId } = req.body;

  //   try {
  //     // Check if the discount voucher exists and is active
  //     const discountVoucher = await prisma.discountVoucher.findFirst({
  //       where: {
  //         id: discountId,
  //         userId,
  //         discount_status: 'Active',
  //       },
  //     });

  //     if (!discountVoucher) {
  //       return res.status(404).send({
  //         status: 'error',
  //         message: 'Discount voucher not found or inactive',
  //       });
  //     }

  //     // Apply the discount to the user's Cart
  //     const updatedCart = await prisma.cart.update({
  //       where: {
  //         userId,
  //       },
  //       data: {
  //         discount: discountVoucher.id,
  //       },
  //     });

  //     return res.status(200).send({
  //       status: 'ok',
  //       updatedCart,
  //     });
  //   } catch (error) {
  //     return res.status(400).send({
  //       status: 'error',
  //       error: error,
  //     });
  //   }
  // }

  // async getUserCart(req: Request, res: Response) {
  //   try {
  //     const carts = await prisma.cart.findUnique({
  //       where: {
  //         userId: req.user?.id,
  //       },
  //       include: {
  //         CartItem: {
  //           include: {
  //             event: true,
  //           },
  //         },
  //       },
  //     });
  //     res.status(200).send({
  //       status: 'ok',
  //       carts,
  //     });
  //   } catch (error) {
  //     res.status(400).send({
  //       status: 'error',
  //       error,
  //     });
  //   }
  // }
}
