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

      if (!userId) {
        return res.status(400).send({
          status: 'error',
          message: 'User ID is required',
        });
      }

      const findCart = async (userId: number) => {
        return await prisma.cart.findUnique({
          where: { userId },
          include: { CartItem: true },
        });
      };

      const createCart = async (userId: number) => {
        const newCart = await prisma.cart.create({
          data: { userId },
        });
        // Return the new cart with CartItem as an empty array
        return {
          ...newCart,
          CartItem: [],
        };
      };

      let cart = await findCart(userId);

      if (!cart) {
        cart = await createCart(userId);
      }

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

      let cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart!.id,
          eventId,
        },
      });

      if (cartItem) {
        cartItem = await prisma.cartItem.update({
          data: { quantity: cartItem.quantity + quantity },
          where: { id: cartItem.id },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            eventId,
            quantity,
            cartId: cart!.id,
          },
        });
      }

      // Ambil informasi harga tiket dari skema EventPrice
      const eventPrice = await prisma.eventPrice.findUnique({
        where: { eventId },
      });

      // Hitung total harga
      const totalPrice = eventPrice ? eventPrice.ticketPrice * quantity : 0;

      // Ambil informasi pengguna dari tabel User
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User not found',
        });
      }

      res.status(200).send({
        status: 'OK',
        message: 'Add to cart success',
        cartId: cart!.id,
        userId,
        username: user.username,
        eventId: event.id,
        eventName: event.eventName,
        EventCategory: event.eventCategory,
        quantity,
        ticketPrice: eventPrice?.ticketPrice,
        totalPrice,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: 'Add to cart failed',
      });
    }
  }

  async addToCartbySlug(req: Request, res: Response) {
    try {
      const { eventSlug, quantity } = req.body;
      const userId = req.user?.id; // Pastikan user ID tersedia dari middleware autentikasi

      if (!eventSlug || !quantity) {
        return res.status(400).send({
          status: 'error',
          message: 'Event slug and quantity are required',
        });
      }

      if (!userId) {
        return res.status(400).send({
          status: 'error',
          message: 'User ID is required',
        });
      }

      const findCart = async (userId: number) => {
        return await prisma.cart.findUnique({
          where: { userId },
          include: { CartItem: true },
        });
      };

      const createCart = async (userId: number) => {
        const newCart = await prisma.cart.create({
          data: { userId },
        });
        return {
          ...newCart,
          CartItem: [],
        };
      };

      let cart = await findCart(userId);

      if (!cart) {
        cart = await createCart(userId);
      }

      const event = await prisma.event.findUnique({
        where: { eventSlug },
      });

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

      let cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          eventId: event.id,
        },
      });

      if (cartItem) {
        cartItem = await prisma.cartItem.update({
          data: { quantity: cartItem.quantity + quantity },
          where: { id: cartItem.id },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            eventId: event.id,
            quantity,
            cartId: cart.id,
          },
        });
      }

      const eventPrice = await prisma.eventPrice.findUnique({
        where: { eventId: event.id },
      });

      const totalPrice = eventPrice ? eventPrice.ticketPrice * quantity : 0;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(400).send({
          status: 'error',
          message: 'User not found',
        });
      }

      res.status(200).send({
        status: 'OK',
        message: 'Add to cart success',
        cartId: cart.id,
        userId,
        username: user.username,
        eventId: event.id,
        eventName: event.eventName,
        eventCategory: event.eventCategory,
        quantity,
        ticketPrice: eventPrice?.ticketPrice,
        totalPrice,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      res.status(400).send({
        status: 'error',
        message: 'Add to cart failed',
      });
    }
  }

  async updateCart(req: Request, res: Response) {
    try {
      const { eventId, quantity } = req.body;
      const userId = req.user?.id;

      console.log('Event ID:', eventId);
      console.log('Quantity:', quantity);
      console.log('User ID:', userId);

      if (
        eventId === undefined ||
        eventId === null ||
        quantity === undefined ||
        userId === undefined ||
        userId === null
      ) {
        return res.status(400).send({
          status: 'error',
          message: 'Event ID, quantity, and user ID are required',
        });
      }

      // Temukan keranjang pengguna
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { CartItem: true },
      });

      if (!cart) {
        return res.status(400).send({
          status: 'error',
          message: 'Cart not found',
        });
      }

      // Temukan item di keranjang
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          eventId,
        },
      });

      console.log('Cart Item:', cartItem);

      // Jika tidak ada item, kirimkan respons
      if (!cartItem) {
        return res.status(400).send({
          status: 'error',
          message: 'Item not found in cart',
        });
      }

      // Jika quantity diubah menjadi 0, hapus item dari keranjang
      if (quantity === 0) {
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });

        return res.status(200).send({
          status: 'OK',
          message: 'Item removed from cart',
        });
      }

      // Jika quantity tidak nol, perbarui jumlah quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });

      // Ambil informasi event yang diperbarui
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { EventPrice: true },
      });

      if (!event) {
        return res.status(404).send({
          status: 'error',
          message: 'Event not found',
        });
      }

      const eventPrice = event.EventPrice?.ticketPrice || 0;
      const totalPrice = eventPrice * updatedCartItem.quantity;

      res.status(200).send({
        status: 'OK',
        message: 'Cart updated',
        eventId: event.id,
        eventName: event.eventName,
        eventCategory: event.eventCategory,
        quantity: updatedCartItem.quantity,
        ticketPrice: eventPrice,
        totalPrice: totalPrice,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: 'Updated cart failed',
      });
    }
  }

  async getAllCartItems(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).send({
          status: 'error',
          message: 'User ID is required',
        });
      }

      // Get all cart items for the logged-in user
      const userCartItems = await prisma.cartItem.findMany({
        where: {
          cart: {
            userId,
          },
        },
        include: {
          cart: {
            include: {
              user: true,
            },
          },
          event: {
            include: {
              EventPrice: true,
            },
          },
        },
      });

      // Create the structure for the response
      const userCart = {
        userId,
        username: userCartItems[0]?.cart.user.username || '',
        cartItems: userCartItems.map((item) => ({
          cartItemId: item.id,
          eventId: item.event.id,
          eventName: item.event.eventName,
          eventCategory: item.event.eventCategory,
          ticketPrice: item.event.EventPrice?.ticketPrice || 0,
          quantity: item.quantity,
          totalItemPrice:
            (item.event.EventPrice?.ticketPrice || 0) * item.quantity,
        })),
        totalCartPrice: userCartItems.reduce((total, item) => {
          return (
            total + (item.event.EventPrice?.ticketPrice || 0) * item.quantity
          );
        }, 0),
      };

      res.status(200).send({
        status: 'success',
        data: userCart,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(400).send({
        status: 'error',
        message: error,
      });
    }
  }
}
