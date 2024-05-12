import { Request, Response } from 'express';
import prisma from '@/prisma';

export class EventController {
  async getEvent(req: Request, res: Response) {
    const eventData = await prisma.event.findMany();

    return res.status(200).send(eventData);
  }

  async createEvent(req: Request, res: Response) {
    try {
      const slug = req.body.title.toLowerCase().replaceAll(' ', '-');
      req.body.slug = slug;
      await prisma.event.create({
        data: req.body,
      });
      res.status(201).send({
        status: 'ok',
        message: 'Event Created!',
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        message: err,
      });
    }
  }

  async getEventSlug(req: Request, res: Response) {
    try {
      const events = await prisma.event.findUnique({
        where: {
          eventSlug: req.params.slug,
        },
      });
      res.status(200).send({
        status: 'ok',
        events,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        message: err,
      });
    }
  }

  async bookTicket(req: Request, res: Response) {
    const eventId = +req.body.eventId;
    const numberOfTickets = +req.body.numberOfTickets;

    try {
      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if (!event) {
        return res.status(404).send({
          status: 'error',
          error: 'event not found',
        });
      }

      if (event.availableSeats < numberOfTickets) {
        return res.status(400).send({
          status: 'error',
          error: 'not enough available seats',
        });
      }

      const updateTicket = await prisma.event.update({
        where: { id: eventId },
        data: { availableSeats: event.availableSeats - numberOfTickets },
      });

      return res.json(200).send({
        status: 'ok',
        message: 'ticket booked successfully',
        updateTicket,
      });
    } catch (error) {
      return res.status(404).send(error);
    }
  }
}
