
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
        this.router.post('/reset-password/:token', this.userMiddleware.verifyResetToken, this.userController.resetPassword)
        this.router.post('/request-change-role', this.userMiddleware.verifyToken, this.userController.requestRoleChange) 
        this.router.get('/verify-role/:token', this.userMiddleware.verifyRole, this.userController.verifyChangeRole)  
        this.router.post('/change-email',this.userMiddleware.verifyToken, this.userController.changeEmail)
        this.router.get('/verify',this.userMiddleware.verifyToken, this.userController.verifyAccount) 
        this.router.get('/verify-email',this.userMiddleware.verifyToken, this.userController.verifyChangeEmail) 
        this.router.get('/keep-login', this.userMiddleware.verifyToken, this.userController.keepLogin)
        this.router.post('/:id', uploader("","/images").single('file'),this.userMiddleware.verifyToken, this.userController.updateProfile)
        this.router.get('/', this.userController.GetAllUser)
        this.router.get('/:id', this.userController.GetDataById)
    }

  getRouter(): Router {
    return this.router;
  }
}
