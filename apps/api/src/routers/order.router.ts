import { OrderController } from '@/controllers/order.controller';
import { Router } from 'express';
import { UserMiddleware } from '@/middlewares/user.middleware';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;
  private userMiddleware: UserMiddleware;

  constructor() {
    this.orderController = new OrderController();
    this.userMiddleware = new UserMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      this.userMiddleware.verifyToken,
      this.orderController.createOrder,
    );
    this.router.get(
      '/:userId',
      this.userMiddleware.verifyToken,
      this.orderController.getOrderDetails,
    );
    this.router.patch(
      '/:orderId/update-status',
      this.userMiddleware.verifyToken,
      this.orderController.updateOrderStatus,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
