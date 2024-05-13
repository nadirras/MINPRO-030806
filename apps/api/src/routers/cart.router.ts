import { CartController } from '@/controllers/cart.controller';
import { Router } from 'express';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.cartController.getUserCart);
    // this.router.get('/:id', this.cartController.getCartById);
    this.router.post('/', this.cartController.addToCart);
  }

  getRouter(): Router {
    return this.router;
  }
}
