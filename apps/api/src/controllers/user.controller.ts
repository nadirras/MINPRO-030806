import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
// import { sign } from 'jsonwebtoken'
// import multer from 'multer'

const prisma = new PrismaClient();

export class UserController {
  async createAccount(req: Request, res: Response) {
    try {
      const { username, email, password, usedReferralCode } = req.body;

      if (!username || !email || !password) {
        return res.status(400).send({
          status: 'error',
          message: 'Username, email, dan password are required fields',
        });
      }

      // Hash the password before storing in database
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      //Generate my referral code based on username
      //Get initials (first three characters) from username
      const initials = req.body.username.slice(0, 3).toUpperCase();
      //Generate random 3-digit number
      const randomNum = Math.floor(Math.random() * 1000);
      // Combine initials and random digits to form referral code
      const myReferralCode = `${initials}${randomNum}`;
      req.body.myReferralCode = myReferralCode;

      //Prepare user data to be saved
      let userData = {
        username,
        email,
        password: hashPassword,
        myreferralCode: myReferralCode,
      };

      //Check if usedReferralCode is provided
      if (usedReferralCode) {
        // Check if the usedReferralCode exists in the database
        const existingReferrer = await prisma.user.findFirst({
          where: {
            myreferralCode: usedReferralCode,
          },
        });

        if (!existingReferrer) {
          return res.status(400).send({
            status: 'error',
            message: 'Invalid referral code',
          });
        }

        // Add logic to give points or discount to the referrer
        // For example:
        await prisma.user.update({
          where: {
            id: existingReferrer.id,
          },
          data: {
            points: {
              increment: 10000, // Add points for the referrer
            },
            // You can add more logic here for discount voucher
          },
        });

        // Store the usedReferralCode in userData separately
        req.body.usedReferralCode = usedReferralCode;
      }

      //create account
      const user = await prisma.user.create({
        data: userData,
      });

      res.status(201).send({
        status: 'ok',
        message: 'User registered succesfully',
        user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        status: 'error',
        message: 'Failed to register account',
      });
    }
  }
}
