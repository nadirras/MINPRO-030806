import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardController {
  async getEventsByOrganizer(req: Request, res: Response) {
    const { organizerId } = req.params;

    try {
      const organizer = await prisma.eventOrganizer.findUnique({
        where: { id: Number(organizerId) },
        include: {
          DetailEvent: {
            include: {
              OrderItem: {
                include: {
                  order: true,
                },
              },
              EventPrice: true,
            },
          },
        },
      });

      if (!organizer) {
        return res.status(404).json({ message: 'Event organizer not found' });
      }

      const events = organizer.DetailEvent.map((event) => {
        const totalRegistrations = event.OrderItem.reduce((sum, item) => {
          if (item.order.status === 'Paid') {
            return sum + item.quantity;
          }
          return sum;
        }, 0);

        const totalFailedRegistrations = event.OrderItem.reduce((sum, item) => {
          if (item.order.status === 'Cancel') {
            return sum + item.quantity;
          }
          return sum;
        }, 0);

        const totalRevenue = event.OrderItem.reduce((sum, item) => {
          if (item.order.status === 'Paid') {
            return sum + item.quantity * (event.EventPrice?.ticketPrice || 0);
          }
          return sum;
        }, 0);

        const isPaid = event.EventPrice?.isPaid || false;
        const ticketPrice = event.EventPrice?.ticketPrice || 0;

        return {
          eventId: event.id,
          eventName: event.eventName,
          eventLocation: event.location, // Add event location
          eventStartTime: event.startTime, // Add event start time
          isPaid,
          ticketPrice,
          totalRegistrations,
          totalFailedRegistrations,
          totalRevenue,
        };
      });

      res.status(200).send({
        organizerId: organizerId,
        organizerName: organizer.eventOrganizer,
        events,
      });
    } catch (error) {
      console.error('Error getting events by organizer:', error);
      res.status(400).send({ message: 'Internal server error' });
    }
  }

  async getAllEvents(req: Request, res: Response) {
    try {
      const organizers = await prisma.eventOrganizer.findMany({
        include: {
          DetailEvent: {
            include: {
              OrderItem: {
                include: {
                  order: true,
                },
              },
              EventPrice: true,
            },
          },
        },
      });

      const organizerStats = organizers.map((organizer) => {
        const events = organizer.DetailEvent.map((event) => {
          const totalRegistrations = event.OrderItem.reduce((sum, item) => {
            if (item.order.status === 'Paid') {
              return sum + item.quantity;
            }
            return sum;
          }, 0);

          const totalFailedRegistrations = event.OrderItem.reduce(
            (sum, item) => {
              if (item.order.status === 'Cancel') {
                return sum + item.quantity;
              }
              return sum;
            },
            0,
          );

          const totalRevenue = event.OrderItem.reduce(
            (sum, item) =>
              item.order.status === 'Paid'
                ? sum + item.quantity * (event.EventPrice?.ticketPrice || 0)
                : sum,
            0,
          );

          const isPaid = event.EventPrice?.isPaid || false;
          const ticketPrice = event.EventPrice?.ticketPrice || 0;

          return {
            eventName: event.eventName,
            isPaid,
            ticketPrice,
            totalRegistrations,
            totalFailedRegistrations,
            totalRevenue,
          };
        });

        return {
          id: organizer.id,
          organizerName: organizer.eventOrganizer,
          events,
        };
      });

      res.status(200).send(organizerStats);
    } catch (error) {
      console.error('Error getting all events:', error);
      res.status(400).send({ message: 'Internal server error' });
    }
  }

  async getMonthlyReport(req: Request, res: Response) {
    const { month, year } = req.params;

    try {
      const organizers = await prisma.eventOrganizer.findMany({
        include: {
          DetailEvent: {
            where: {
              startDate: {
                gte: new Date(`${year}-${month}-01`),
                lt: new Date(`${year}-${Number(month) + 1}-01`),
              },
            },
            include: {
              OrderItem: {
                include: {
                  order: true,
                },
              },
              EventPrice: true,
            },
          },
        },
      });

      const report = organizers.map((organizer) => {
        const events = organizer.DetailEvent.map((event) => {
          const totalRegistrations = event.OrderItem.reduce((sum, item) => {
            if (item.order.status === 'Paid') {
              return sum + item.quantity;
            }
            return sum;
          }, 0);

          const totalFailedRegistrations = event.OrderItem.reduce(
            (sum, item) => {
              if (item.order.status === 'Cancel') {
                return sum + item.quantity;
              }
              return sum;
            },
            0,
          );

          const totalRevenue = event.OrderItem.reduce(
            (sum, item) =>
              item.order.status === 'Paid'
                ? sum + item.quantity * (event.EventPrice?.ticketPrice || 0)
                : sum,
            0,
          );

          return {
            eventId: event.id,
            eventName: event.eventName,
            totalRegistrations,
            totalFailedRegistrations,
            totalRevenue,
          };
        });

        const totalRevenue = events.reduce(
          (sum, event) => sum + event.totalRevenue,
          0,
        );

        return {
          organizerName: organizer.eventOrganizer,
          events,
          totalRevenue,
        };
      });

      res.status(200).send({
        report,
      });
    } catch (error) {
      console.error('Error getting monthly report:', error);
      res.status(400).send({ message: 'Internal server error' });
    }
  }
}
