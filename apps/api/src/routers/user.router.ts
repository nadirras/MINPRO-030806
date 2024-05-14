
import { UserController } from "@/controllers/user.controller";
import { Router } from "express";
import { UserMiddleware } from "@/middlewares/user.middleware";
import { uploader } from "@/helpers/uploader";

export class UserRouter {
    private router: Router;
    private userController : UserController;
    private userMiddleware: UserMiddleware
   
    constructor(){
        this.userController = new UserController();
        this.userMiddleware = new UserMiddleware()
        this.router = Router();
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/', this.userController.createAccount)
        this.router.post('/login', this.userController.loginAccount) 
        this.router.post('/forgot-password', this.userController.forgotPassword) 
        this.router.post('/reset-password', this.userController.resetPassword) 
        this.router.post('/change-email',this.userMiddleware.verifyToken, this.userController.changeEmail)
        this.router.get('/verify',this.userMiddleware.verifyToken, this.userController.verifyAccount) 
        this.router.get('/keep-login', this.userMiddleware.verifyToken, this.userController.keepLogin)
        this.router.patch('/:id', uploader("","/images").single('file'),this.userMiddleware.verifyToken, this.userController.updateProfile)
        this.router.get('/:id', this.userController.GetDataById)
    }

  getRouter(): Router {
    return this.router;
  }
}
