import { EventController } from '@/controllers/event.controller';
import { Router } from 'express';
import { uploader } from '@/helpers/uploaderImageEvent';
import { UserMiddleware } from '@/middlewares/user.middleware';

export class eventRouter {
  private router: Router;
  private eventController: EventController;
  private userMiddleware: UserMiddleware;

  constructor() {
    this.eventController = new EventController();
    this.userMiddleware = new UserMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.get('/', this.eventController.getEventHandler);
    this.router.get('/', this.eventController.getEvent);
    this.router.post(
      '/',
      uploader('img', 'images').fields([
        { name: 'eventImage', maxCount: 1 },
        { name: 'organizerImage', maxCount: 1 },
      ]),
      this.userMiddleware.verifyToken,
      this.eventController.createEvent,
    );
    this.router.patch(
      '/:slug',
      uploader('img', 'images').fields([
        { name: 'eventImage', maxCount: 1 },
        { name: 'organizerImage', maxCount: 1 },
      ]),
      this.userMiddleware.verifyToken,
      this.eventController.updateEvent,
    );
    // this.router.post('/book-ticket', this.eventController.bookTicket);
    this.router.get('/:slug', this.eventController.getEventSlug);
    // this.router.get('/:id/reports', this.eventController.getEventReports);
    // this.router.get('/:id', this.eventController.getEventById);
    this.router.get('/users/:userId', this.eventController.getEventbyUserId);
  }

  getRouter(): Router {
    return this.router;
  }
}
