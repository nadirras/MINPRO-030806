import { Router } from 'express';
import { SampleRouter } from './sample.router';
import { UserRouter } from './user.router';
import { eventRouter } from './event.router';
import { CartRouter } from './cart.router';
import { OrderRouter } from './order.router';
import { PaymentRouter } from './payment.router';
import { ReviewRouter } from './review.router';
import { DashboardRouter } from './dashboard.router';

export class ApiRouter {
  private sampleRouter: SampleRouter;
  private router: Router;
  private userRouter: UserRouter;
  private eventRouter: eventRouter;
  private cartRouter: CartRouter;
  private orderRouter: OrderRouter;
  private paymentRouter: PaymentRouter;
  private reviewRouter: ReviewRouter;
  private dashboardRouter: DashboardRouter;

  constructor() {
    this.router = Router();
    this.sampleRouter = new SampleRouter(); //contoh
    this.userRouter = new UserRouter();
    this.eventRouter = new eventRouter();
    this.cartRouter = new CartRouter();
    this.orderRouter = new OrderRouter();
    this.paymentRouter = new PaymentRouter();
    this.reviewRouter = new ReviewRouter();
    this.dashboardRouter = new DashboardRouter();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use('/sample', this.sampleRouter.getRouter()); //contoh
    this.router.use('/users', this.userRouter.getRouter());
    this.router.use('/events', this.eventRouter.getRouter());
    this.router.use('/carts', this.cartRouter.getRouter());
    this.router.use('/orders', this.orderRouter.getRouter());
    this.router.use('/payments', this.paymentRouter.getRouter());
    this.router.use('/reviews', this.reviewRouter.getRouter());
    this.router.use('/organizers', this.dashboardRouter.getRouter());
  }

  getRouter() {
    return this.router;
  }
}
