import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReviewController {
  async createEventReview(req: Request, res: Response) {
    const { userId, eventId, rating, comment } = req.body;

    try {
      // Pastikan acara dengan eventId yang diberikan ada dalam database
      const event = await prisma.event.findUnique({
        where: { id: Number(eventId) },
      });
      if (!event) {
        return res.status(400).send({ message: 'Event not found' });
      }

      // Buat review baru
      const newReview = await prisma.review.create({
        data: {
          userId,
          eventId: Number(eventId), // Konversi ke tipe number
          rating,
          comment,
        },
      });

      res.status(200).send({
        status: 'OK',
        message: 'Review created successfully',
        newReview,
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(400).send({ message: 'Internal server error' });
    }
  }

  async getAllEventReviews(req: Request, res: Response) {
    const eventId = Number(req.params.eventId);

    try {
      // Temukan detail acara berdasarkan eventId
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          eventName: true,
          eventCategory: true,
        },
      });

      if (!event) {
        return res.status(400).json({ message: 'Event not found' });
      }

      // Temukan semua review untuk acara dengan eventId yang diberikan
      const reviews = await prisma.review.findMany({
        where: { eventId: eventId },
        select: {
          userId: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      });

      res.status(200).send({
        event: {
          id: event.id,
          eventName: event.eventName,
          eventCategory: event.eventCategory,
        },
        reviews: reviews,
      });
    } catch (error) {
      console.error('Error getting event reviews:', error);
      res.status(400).send({ message: 'Internal server error' });
    }
  }
}
