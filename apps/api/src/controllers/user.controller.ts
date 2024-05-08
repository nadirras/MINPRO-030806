import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { transporter } from '../helpers/nodemailer';
// import multer from 'multer'

const prisma = new PrismaClient();
export class UserController {
  //create account
  async createAccount(req: Request, res: Response) {
    try {
      const { username, email, password, usedReferralCode } = req.body;
  
      // Check if required fields are provided
      if (!username || !email || !password) {
        return res.status(400).send({
          status: 'error',
          message: 'Username, email, and password are required fields',
        });
      }

  
      // Hash the password before storing in the database
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);
  
      // Generate my referral code based on username
      const initials = username.slice(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 1000);
      const myReferralCode = `${initials}${randomNum}`;

      // Prepare user data to be saved
      let userData = {
        username,
        email,
        password: hashPassword,

        usedReferralCode,
      };
  
      // Check if usedReferralCode is provided
      if (usedReferralCode) {
        // Check if the usedReferralCode exists in the database
        const existingReferral = await prisma.referral.findFirst({
          where: {
            myReferralCode: usedReferralCode,
          },
        });
  
        if (!existingReferral) {
          return res.status(400).send({
            status: 'error',
            message: 'Invalid referral code',
          });
        }

  
        // Check if the user associated with the referral code exists
        const existingUser = await prisma.user.findUnique({

          where: {
            id: existingReferral.userId,
          },
        });
  
        if (!existingUser) {
          return res.status(400).send({
            status: 'error',
            message: 'User associated with referral code not found',
          });
        }
  
        // Add logic for Referrer (pemilik referral code)
        // Add 10,000 points to the referrer with a 3-month expiration
        await prisma.points.create({
          data: {
            user: {
              connect: {
                id: existingReferral.userId,
              },
            },
            points: 10000,
            expired_date: new Date(
              new Date().getTime() + 3 * 30 * 24 * 60 * 60 * 1000
            ), // 3 months expiration
            point_status: 'Active',
          },
        });

  
        // Update userData to include discountVoucher ID
        userData = {
          ...userData,
        };
      }
  
      // Create new user in the database
      const newUser = await prisma.user.create({

        data: userData,
        include: {
          discountVoucher: true, // Include related discountVoucher in the response
          referral: true, // Include related referral in the response
        },
      });
  
      // Create new Referral record for the user
      const referral = await prisma.referral.create({
        data: {
          myReferralCode: myReferralCode,
          user: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });

      // Generate discount coupon for the new user
      const discountCode = `${usedReferralCode.slice(0, 3)}-${new Date().getFullYear()}-${new Date().getMonth() + 1}`.replace(/-/g, '');
  
      // Create DiscountCoupon Record for the new user
      const newDiscountVoucher = await prisma.discountVoucher.create({
        data: {
          user: {
            connect: {
              id: newUser.id,
            },
          },
          discountCoupon: discountCode,
          discountPercentage: 10, // 10% discount
          expired_date: new Date(
            new Date().getTime() + 3 * 30 * 24 * 60 * 60 * 1000
          ), // 3 months expiration
          discount_status: 'Active',
        },
      });
  
      // Generate JWT token
      const payload = {
        id: newUser.id,
      };
  
      const token = sign(payload, process.env.KEY_JWT!);
  
      // Prepare email template
      const link = `http://localhost:3000/verify/${token}`;
      const templatePath = path.join(
        __dirname,
        '../templates',
        'register.html',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name: newUser.username,
        link,
      });
  
      // Send registration email
      await transporter.sendMail({
        from: 'diahnof@gmail.com',
        to: newUser.email,
        subject: 'Welcome to Loket.com',
        html,
      });
  
      // Send response
      res.status(201).send({
        status: 'ok',
        message: 'User registered successfully',

        user: newUser,
        referral,

        discountVoucher: newDiscountVoucher, // Include discount vouchers in the response

      });
    } catch (err) {
      console.error('Failed to register account:', err);
      res.status(400).send({
        status: 'error',
        message: 'Failed to register account',
      });
    }
  }
  

  //login account
  async loginAccount(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (user == null) throw 'User not found!';

      const isValidPass = await compare(password, user.password);
      if (isValidPass == false) throw 'Wrong Password!';

      const payload = {
        id: user.id,
      };
      const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1d' });

      res.status(200).send({
        status: 'OK',
        user,
        token,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        message: err,
      });
    }
  }

  //forgot password
  async forgotPassword(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}
