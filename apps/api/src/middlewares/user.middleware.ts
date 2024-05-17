import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export class UserMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) throw 'Token Empty';

      const verifyUser = verify(token, process.env.KEY_JWT!);
      req.user = verifyUser as User;

      next();
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err,
      });
    }
  }

  verifyResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.params.token;
      if (!token) throw 'Token Empty';

      const verifyUser = verify(token, process.env.KEY_JWT!) as any;
      req.user = verifyUser as User;

      if (!verifyUser?.reset) {
        throw 'Invalid Token';
      }

      console.log(verifyUser);

      // res.end()
      next();
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err,
      });
    }


    verifyResetToken(req: Request, res: Response, next: NextFunction) {
        try {
            let token = req.params.token
            if (!token) throw "Token Empty"

            const verifyUser = verify(token, process.env.KEY_JWT!) as any
            req.user = verifyUser as User

            if (!verifyUser?.reset){
                throw "Invalid Token"
            }

            console.log(verifyUser)

            // res.end()
            next()
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }

    verifyRole(req: Request, res: Response, next: NextFunction) {
        try {
            let token = req.params.token
            if (!token) throw "Token Empty"

            const verifyUser = verify(token, process.env.KEY_JWT!) as {
                id: number;
                targetRole: string;
              };

              if (!verifyUser.targetRole) {
                throw new Error("Invalid Token");
            }

            req.user = verifyUser;

            console.log(verifyUser)

            // res.end()
            next()
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }
}                               

