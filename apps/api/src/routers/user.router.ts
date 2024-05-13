
import { UserController } from "@/controllers/user.controller";
import { Router } from "express";
import { UserMiddleware } from "@/middlewares/user.middleware";

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
        this.router.post('/resetPassword', this.userController.resetPassword)
        this.router.get('/verify', this.userController.verifyAccount) 
        this.router.get('/keep-login', this.userMiddleware.verifyToken, this.userController.keepLogin)
        // this.router.get('/updateEmail', this.userMiddleware.verifyToken, this.userController.updateEmail)
        // this.router.post('/updatePassword', this.userMiddleware.verifyToken, this.userController.updatePassword)
    }
    
  getRouter(): Router {
    return this.router;
  }
}
