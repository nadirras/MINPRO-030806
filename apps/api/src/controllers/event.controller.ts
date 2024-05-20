import { Request, Response } from 'express';
import { PrismaClient, EventStatus } from '@prisma/client';
import prisma from '@/prisma';
export class EventController {
  //Get Event Data
  async getEvent(req: Request, res: Response) {
    try {
      const { province, category, isPaid, search } = req.query;

      const filters: any = {};

      if (province)
        filters.province = {
          contains: province,
        };

      console.log(filters);

      if (category) {
        filters.eventCategory = String(category);
      }

      // if (isPaid !== undefined) {
      //   filters.EventPrice = {
      //     isPaid: isPaid === 'true',
      //   };
      // }
      if (isPaid === 'true' || isPaid === 'false') {
        filters.EventPrice = {
          isPaid: isPaid === 'true',
        };
      }

      if (search) {
        filters.eventName = {
          contains: search,
        };
      }

      console.log(filters);

      const eventData = await prisma.event.findMany({
        where: filters,
        include: {
          eventOrganizer: true,
          EventPrice: true,
        },
      });
      res.status(200).send({
        status: 'OK',
        eventData,
      });
    } catch (error) {
      console.error('Failed to get event by ID:', error);
      res.status(400).send({
        status: 'error',
        message: 'Failed to get event',
      });
    }
  }

  async getEventById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const eventData = await prisma.event.findUnique({
        where: {
          id: Number(id), // Ensure the ID is a number
        },
        include: {
          eventOrganizer: true,
          EventPrice: true,
        },
      });

      if (!eventData) {
        return res.status(404).send({
          status: 'error',
          message: 'Event not found',
        });
      }

      res.status(200).send({
        status: 'OK',
        eventData,
      });
    } catch (error) {
      console.error('Failed to get event by ID:', error);
      res.status(400).send({
        status: 'error',
        message: 'Failed to get event',
      });
    }
  }

  //Create Event (perlu revisi)
  async createEvent(req: Request, res: Response) {
    try {
      const {
        eventOrganizer,
        contactPerson,
        contactPersonNumber,
        eventCategory,
        eventName,
        description,
        availableSeats,
        startDate,
        endDate,
        startTime,
        endTime,
        zona_waktu,
        location,
        province,
        ticketPrice,
      } = req.body;

      // Validasi format startDate (YYYY-MM-DD)
      if (!startDate || !/^(\d{4})-(\d{2})-(\d{2})$/.test(startDate)) {
        console.error('Invalid startDate:', startDate);
        return res
          .status(400)
          .send({ error: 'Start date must be in the format YYYY-MM-DD.' });
      }

      // Validasi format endDate (YYYY-MM-DD)
      if (!endDate || !/^(\d{4})-(\d{2})-(\d{2})$/.test(endDate)) {
        console.error('Invalid endDate:', endDate);
        return res
          .status(400)
          .send({ error: 'End date must be in the format YYYY-MM-DD.' });
      }

      if (
        !eventOrganizer ||
        !contactPerson ||
        !contactPersonNumber ||
        !eventName ||
        !description ||
        !availableSeats ||
        !startTime ||
        !endTime ||
        !zona_waktu ||
        !location ||
        !province ||
        ticketPrice === undefined
      ) {
        return res
          .status(400)
          .send({ error: 'Please provide all required fields' });
      }

      // Type assertion for req.files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const ImgOrganizer = files?.organizerImage
        ? `http://localhost:8000/public/images/${files.organizerImage[0].filename}`
        : null;
      const ImgEvent = files?.eventImage
        ? `http://localhost:8000/public/images/${files.eventImage[0].filename}`
        : '';

      // Generate eventSlug from title (eventName)
      const eventSlug = req.body.eventName.toLowerCase().replaceAll(' ', '-');
      req.body.eventSlug = eventSlug; // Add eventSlug to req.body

      // Ensure req.user is defined and get userId
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).send({ error: 'User not authenticated' });
      }

      console.log('Event Slug:', eventSlug);

      // Check if the user has the role of Event Creator
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.Role !== 'EventCreator') {
        return res.status(403).json({
          error:
            'You must be an Event Creator to create an event. Please request a role change.',
        });
      }

      // Determine if the event is paid or free based on ticketPrice
      const isPaid = parseInt(ticketPrice) > 0;

      // Create Event
      const newEvent = await prisma.event.create({
        data: {
          eventCategory,
          eventName,
          eventSlug,
          eventImage: ImgEvent,
          description,
          availableSeats: parseInt(availableSeats),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          startTime,
          endTime,
          zona_waktu,
          location,
          province,
          eventOrganizer: {
            create: {
              eventOrganizer,
              eventImgOrganizer: ImgOrganizer ?? '',
              contactPerson,
              contactPersonNumber,
              user: { connect: { id: userId } }, // Connect EventOrganizer to user
            },
          },
          EventPrice: {
            create: {
              isPaid: isPaid,
              ticketPrice: parseInt(ticketPrice),
            },
          },
          eventStatus: EventStatus.ComingSoon, // Set appropriate EventStatus
        },
        include: {
          EventPrice: true,
          eventOrganizer: true,
        },
      });

      console.log('New Event Created:', newEvent);

      res.status(200).send({
        status: 'OK',
        message: 'Your event has been created!',
        event: newEvent,
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      res.status(400).send({
        status: 'error',
        message: 'Failed to create event',
      });
    }
  }

  //Get Data by slug

  async getEventSlug(req: Request, res: Response) {
    try {
      const event = await prisma.event.findUnique({
        where: {
          eventSlug: req.params.slug,
        },
        include: {
          eventOrganizer: {
            select: {
              id: true,
              userId: true,
              eventOrganizer: true,
              eventImgOrganizer: true,
              contactPerson: true,
              contactPersonNumber: true,
            },
          },
          EventPrice: {
            select: {
              id: true,
              isPaid: true,
              ticketPrice: true,
            },
          },
        },
      });

      if (!event) {
        return res.status(400).send({
          status: 'error',
          message: 'Event not found',
        });
      }

      res.status(200).send({
        status: 'OK',
        eventData: {
          id: event.id,
          eventOrganizerId: event.eventOrganizerId,
          eventCategory: event.eventCategory,
          eventName: event.eventName,
          eventSlug: event.eventSlug,
          eventImage: event.eventImage,
          description: event.description || '',
          availableSeats: event.availableSeats,
          startDate: event.startDate,
          endDate: event.endDate,
          startTime: event.startTime,
          endTime: event.endTime,
          zona_waktu: event.zona_waktu,
          location: event.location,
          province: event.province,
          eventStatus: event.eventStatus,
          eventOrganizer: event.eventOrganizer,
          EventPrice: event.EventPrice,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(400).send({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }

  //Update Event
  async updateEvent(req: Request, res: Response) {
    try {
      const { slug } = req.params; // Corrected destructuring of slug
      const {
        eventOrganizer,
        contactPerson,
        contactPersonNumber,
        eventCategory,
        eventName,
        description,
        availableSeats,
        startDate,
        endDate,
        startTime,
        endTime,
        zona_waktu,
        location,
        province,
        isPaid,
        ticketPrice,
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const ImgOrganizer = files?.organizerImage
        ? `http://localhost:8000/public/images/${files.organizerImage[0].filename}`
        : undefined;
      const ImgEvent = files?.eventImage
        ? `http://localhost:8000/public/images/${files.eventImage[0].filename}`
        : undefined;

      // Validasi format startDate (YYYY-MM-DD)
      if (startDate && !/^(\d{4})-(\d{2})-(\d{2})$/.test(startDate)) {
        console.error('Invalid startDate:', startDate);
        return res
          .status(400)
          .send({ error: 'Start date must be in the format YYYY-MM-DD.' });
      }

      // Validasi format endDate (YYYY-MM-DD)
      if (endDate && !/^(\d{4})-(\d{2})-(\d{2})$/.test(endDate)) {
        console.error('Invalid endDate:', endDate);
        return res
          .status(400)
          .send({ error: 'End date must be in the format YYYY-MM-DD.' });
      }

      // Generate eventSlug from title (eventName) if eventName is provided
      const eventSlug = eventName
        ? eventName.toLowerCase().replaceAll(' ', '-')
        : undefined;

      // Ensure req.user is defined and get userId
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).send({ error: 'User not authenticated' });
      }

      // Check if the user has the role of Event Creator
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.Role !== 'EventCreator') {
        return res.status(403).json({
          error:
            'You must be an Event Creator to create an event. Please request a role change.',
        });
      }

      const updatedEvent = await prisma.event.update({
        where: { eventSlug: req.params.slug }, // Use slug correctly
        data: {
          eventCategory,
          eventName,
          eventSlug: eventSlug || slug, // Use existing slug if eventName is not provided
          eventImage: ImgEvent,
          description,
          availableSeats: availableSeats ? parseInt(availableSeats) : undefined,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          startTime,
          endTime,
          zona_waktu,
          location,
          province,
          EventPrice:
            isPaid !== undefined || ticketPrice !== undefined
              ? {
                  update: {
                    isPaid: isPaid !== undefined ? Boolean(isPaid) : undefined,
                    ticketPrice: ticketPrice
                      ? parseInt(ticketPrice)
                      : undefined,
                  },
                }
              : undefined,
          eventOrganizer:
            eventOrganizer ||
            contactPerson ||
            contactPersonNumber ||
            ImgOrganizer
              ? {
                  update: {
                    eventOrganizer,
                    eventImgOrganizer: ImgOrganizer,
                    contactPerson,
                    contactPersonNumber,
                  },
                }
              : undefined,
        },
        include: {
          EventPrice: true,
          eventOrganizer: true,
        },
      });

      res.status(200).send({
        status: 'OK',
        message: 'Your event has been updated!',
        event: updatedEvent,
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      res.status(400).send({
        status: 'error',
        message: 'Failed to update event',
      });
    }
  }

  async getEventbyUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const events = await prisma.event.findMany({
        where: {
          eventOrganizer: {
            user: {
              id: Number(userId),
            },
          },
        },
        include: {
          eventOrganizer: true,
          EventPrice: true,
        },
      });

      if (!events || events.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Events not found for the specified user',
        });
      }

      res.status(200).json({
        status: 'success',
        events,
      });
    } catch (error) {
      console.error('Failed to get events by user ID:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get events',
      });
    }
  }

  //Book Ticket
  // async bookTicket(req: Request, res: Response) {
  //   const eventId = +req.body.eventId;
  //   const numberOfTickets = +req.body.numberOfTickets;

  //   try {
  //     const event = await prisma.event.findUnique({ where: { id: eventId } });

  //     if (!event) {
  //       return res.status(404).send({
  //         status: 'error',
  //         error: 'event not found',
  //       });
  //     }

  //     if (event.availableSeats < numberOfTickets) {
  //       return res.status(400).send({
  //         status: 'error',
  //         error: 'not enough available seats',
  //       });
  //     }

  //     const updateTicket = await prisma.event.update({
  //       where: { id: eventId },
  //       data: { availableSeats: event.availableSeats - numberOfTickets },
  //     });

  //     return res.json(200).send({
  //       status: 'ok',
  //       message: 'ticket booked successfully',
  //       updateTicket,
  //     });
  //   } catch (error) {
  //     return res.status(404).send(error);
  //   }
  // }
}
