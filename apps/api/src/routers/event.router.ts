import { EventController } from '@/controllers/event.controller';
import { Router } from 'express';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.eventController.getEvent);
    this.router.post('/', this.eventController.createEvent);
    this.router.post('/book-ticket', this.eventController.bookTicket);
    this.router.get('/:slug', this.eventController.getEventSlug);
  }

  getRouter(): Router {
    return this.router;
  }
}
