import { Router } from 'express';
import { ReviewController } from '@/controllers/review.controller';

export class ReviewRouter {
  private router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.reviewController.createEventReview);
    this.router.get('/', this.reviewController.getAllEventReviews);
  }

  getRouter(): Router {
    return this.router;
  }
}
