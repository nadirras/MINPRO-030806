import { Request, Response } from 'express';
import prisma from '@/prisma';

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
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

        if (!cart || cart.CartItem.length === 0) {
          throw 'Cart is empty';
        }

        const oldOrder = await tx.order.findFirst({
          where: {
            userId: req.user?.id,
            status: 'Pending',
          },
        });

        if (oldOrder) {
          throw 'Complete the previous transaction';
        }

        const total = cart.CartItem.reduce(
          (total, item) => total + item.event.eventPrice * item.quantity,
          0,
        );
        const now = new Date();
        const expiredDate = new Date(now.getTime() + 5 * 60000);

        const order = await tx.order.create({
          data: {
            userId: req.user?.id || 0,
            total: total || 0,
            status: 'Pending',
            expiredDate,
          },
        });

        // Create OrderItem records
        const orderItems = await Promise.all(
          cart.CartItem.map(async (item) => {
            const orderItem = await tx.orderItem.create({
              data: {
                orderId: order.id,
                eventId: item.eventId,
                quantity: item.quantity,
              },
            });
            return orderItem;
          }),
        );

        // Clear the user's cart after creating the order
        await tx.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        });

        res.status(201).send({
          status: 'success',
          message: 'Order created successfully',
          order,
          orderItems,
        });
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }
}
