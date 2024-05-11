import { Request, Response } from 'express';
import prisma from '@/prisma';

export class CartController {
  async addToCart(req: Request, res: Response) {
    const { userId, discount, eventId, quantity } = req.body;

    try {
      // First, create a CartItem entry
      const newCartItem = await prisma.cartItem.create({
        data: {
          eventId,
          quantity,
          cart: {
            connect: { userId }, // Connect the cart to the user
          },
          event: { connect: { id: eventId } }, // Connect the event to the cart item
        },
      });
      // Then, associate the CartItem with the user's Cart
      const newCartData = await prisma.cart.update({
        where: {
          userId,
        },
        data: {
          CartItem: {
            connect: {
              id: newCartItem.id,
            },
          },
          discount, // Add the discount to the Cart
        },
        include: {
          CartItem: {
            include: {
              event: true,
            },
          },
        },
      });

      return res.status(201).send(newCartData);
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        error,
      });
    }
  }

  async applyDiscountToCart(req: Request, res: Response) {
    const { userId, discountId } = req.body;

    try {
      // Check if the discount voucher exists and is active
      const discountVoucher = await prisma.discountVoucher.findFirst({
        where: {
          id: discountId,
          userId,
          discount_status: 'Active',
        },
      });

      if (!discountVoucher) {
        return res.status(404).send({
          status: 'error',
          message: 'Discount voucher not found or inactive',
        });
      }

      // Apply the discount to the user's Cart
      const updatedCart = await prisma.cart.update({
        where: {
          userId,
        },
        data: {
          discount: discountVoucher.id,
        },
      });

      return res.status(200).send({
        status: 'ok',
        updatedCart,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        error: error,
      });
    }
  }

  async getUserCart(req: Request, res: Response) {
    try {
      const carts = await prisma.cart.findUnique({
        where: {
          userId: req.user?.id,
        },
        include: {
          CartItem: {
            include: {
              event: true,
            },
          },
        },
      });
      res.status(200).send({
        status: 'ok',
        carts,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }
}
