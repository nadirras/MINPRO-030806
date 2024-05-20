import { PaymentController } from '@/controllers/payment.controller';
import { Router } from 'express';
import { UserMiddleware } from '@/middlewares/user.middleware';

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;
  private userMiddleware: UserMiddleware;

  constructor() {
    this.paymentController = new PaymentController();
    this.userMiddleware = new UserMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      this.userMiddleware.verifyToken,
      this.paymentController.confirmPayment,
    );
    this.router.get('/:userId', this.paymentController.getTransactionHistory);
  }

  getRouter(): Router {
    return this.router;
  }
}
