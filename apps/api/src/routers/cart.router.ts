import { CartController } from '@/controllers/cart.controller';
import { Router } from 'express';
import { UserMiddleware } from '@/middlewares/user.middleware';

export class CartRouter {
  private router: Router;
  private cartController: CartController;
  private userMiddleware: UserMiddleware;

  constructor() {
    this.cartController = new CartController();
    this.userMiddleware = new UserMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/add-cart',
      this.userMiddleware.verifyToken,
      this.cartController.addToCart,
    );
    this.router.post(
      '/add-cart-slug',
      this.userMiddleware.verifyToken,
      this.cartController.addToCartbySlug,
    );
    this.router.patch(
      '/update-cart',
      this.userMiddleware.verifyToken,
      this.cartController.updateCart,
    );
    this.router.get(
      '/',
      this.userMiddleware.verifyToken,
      this.cartController.getAllCartItems,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
