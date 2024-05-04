import {Router} from 'express'
import { SampleRouter } from './sample.router'
import { UserRouter } from './user.router'


export class ApiRouter {
    private sampleRouter: SampleRouter
    private router: Router
    private userRouter: UserRouter

    constructor(){
        this.router = Router()
        this.sampleRouter = new SampleRouter () //contoh 
        this.userRouter = new UserRouter ()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.use('/sample', this.sampleRouter.getRouter()) //contoh
        this.router.use('/users', this.userRouter.getRouter())
    }

    getRouter() {
        return this.router
    }

}