import {Router} from 'express'
import { SampleRouter } from './sample.router'
import { UserRouter } from './user.router'
import { eventRouter } from './event.router'


export class ApiRouter {
    private sampleRouter: SampleRouter
    private router: Router
    private userRouter: UserRouter
    private eventRouter: eventRouter

    constructor(){
        this.router = Router()
        this.sampleRouter = new SampleRouter () //contoh 
        this.userRouter = new UserRouter ()
        this.eventRouter = new eventRouter ()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.use('/sample', this.sampleRouter.getRouter()) //contoh
        this.router.use('/users', this.userRouter.getRouter())
        this.router.use('/events', this.eventRouter.getRouter())
    }

    getRouter() {
        return this.router
    }

}