import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export class EventController {
  //Get Event Data
  async getEvent(req: Request, res: Response) {
    try {
      const eventData = await prisma.event.findMany();
      res.status(200).send({
        status: 'OK',
        eventData
    })
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: error,
      });
    }
  }

  //Create Event
  async createEvent(req: Request, res: Response) {
    try {
      const slug = req.body.title.toLowerCase().replaceAll(' ', '-');
      req.body.slug = slug;
      await prisma.event.create({
        data: req.body,
      });
      res.status(201).send({
        status: 'OK',
        message: 'Event Created!',
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        message: err,
      });
    }
  }

  //Get Data by slug
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

  //Book Ticket
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
