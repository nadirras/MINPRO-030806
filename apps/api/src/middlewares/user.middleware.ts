import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export class UserMiddleware {
    verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            let token = req.headers.authorization?.replace("Bearer ", "")
            if (!token) throw "Token Empty"

            const verifyUser = verify(token, process.env.KEY_JWT!)
            req.user = verifyUser as User

            next()
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }
}