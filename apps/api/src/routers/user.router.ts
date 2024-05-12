import { UserController } from '@/controllers/user.controller';
import { verifyToken } from '@/middlewares/user.middleware';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.userController.createAccount);
    this.router.post('/login', this.userController.loginAccount);
    this.router.get('/keep-login', verifyToken, this.userController.keepLogin);
    this.router.get('/verify', verifyToken, this.userController.verifyUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
