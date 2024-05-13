import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { transporter } from '../helpers/nodemailer';
import dotenv from 'dotenv';
// import multer from 'multer'
dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
const jwtKey = process.env.KEY_JWT;
const mailUser = process.env.MAIL_USER;

const prisma = new PrismaClient();

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  usedReferralCode?: string;
}
export class UserController {
  //create account
  async createAccount(req: Request, res: Response) {
    try {

      const { username, email, password, usedReferralCode } = req.body;

      //check if required fields are provided
      if (!username || !email || !password) {
        return res.status(400).send({
          status: 'error',
          mesage: 'Username, email, and password are required fields',
        });
      }

      // Check if the email or username already exists to prevent duplicates
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email is already registered. Please use a different email.',
        });
      }

      // Hash the password before storing in the database
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      //Create new user in the database
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          activation: false,
          usedReferralCode,
        },
      });

     
      const payload = {
        id: users.id,
      };

      const token = sign(payload, process.env.KEY_JWT!);
      //Prepare email template
      const link = `http://localhost:3000/verify/${token}`;

      const templatePath = path.join(
        __dirname,
        '../templates',
        'register.html',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name: users.username,
        link,
      });


      //Send registration email
      await transporter.sendMail({
        from: 'diahnof@gmail.com',
        to: newUser.email,
        subject: 'Welcome to Zenith Tiket - Verify Your Account',
        html,
      });

      //Send response
      res.status(201).send({
        status: 'OK',
        message: 'User registered successfully',
        user: newUser,
        token,
      });
    } catch (err) {
      console.error('Failed to register account', err);

      res.status(400).send({
        status: 'error',
        message: error,
      });
    }
  }


  //verify account
  async verifyAccount(req: Request, res: Response) {
    try {
      // get token from req.params
      let token: string | undefined = req.params.token;

      if (!token) {
        // If the token is not in req.params, try retrieving it from req.headers.authorization
        token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          throw new Error('Token Empty');
        }
      }

      const verifyUser = verify(token, process.env.KEY_JWT!) as { id: number };

      // Update user activation status to true
      const updateUser = await prisma.user.update({
        where: { id: verifyUser.id },
        data: { activation: true, 
         },
      });

      // Generate referral code for the user
      const initials = updateUser.username.slice(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 1000);
      const myRefferralCode = `${initials}${randomNum}`;

      // Create Referral record for the user
      await prisma.referral.create({
        data: {
          myReferralCode: myRefferralCode,
          user: {
            connect: { id: updateUser.id },
          },
        },
      });

      // Check if the user used a referral code
      if (updateUser.usedReferralCode) {
        // Check if the usedReferralCode exists in the database
        const existingRefferal = await prisma.referral.findFirst({
          where: { myReferralCode: updateUser.usedReferralCode },
        });

        if (existingRefferal) {
          // Add 10,000 points to the referrer with a 3-month expiration
          await prisma.points.create({
            data: {
              user: { connect: { id: existingRefferal.userId } },
              points: 10000,
              expired_date: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
              point_status: 'Active',
            },
          });
        }

        // Create DiscountCoupon Record for the new user
        const discountCode = `${updateUser.usedReferralCode.slice(
          0,
          3,
        )}-${new Date().getFullYear()}-${new Date().getMonth() + 1}`.replace(
          /-/g,
          '',
        );

        await prisma.discountVoucher.create({
          data: {
            user: { connect: { id: updateUser.id } },
            discountCoupon: discountCode,
            discountPercentage: 10,
            expired_date: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
            discount_status: 'Active',
          },
        });
      }

      res.status(200).send({
        status: 'ok',
        message: 'Account verified successfully',
        user: updateUser,
      });
    } catch (err) {
      console.error('Failed to verify account:', err);
      res.status(400).send({
        status: 'error',
        message: 'Failed to verify account',
      });
    }
  }

=
  //login account
  async loginAccount(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          OR: [
              { username: data },
              { email: data }
          ]
      }
      });

      if (user == null) throw 'User not found!';
      if (user.activation === false) throw "Not active"

      const isValidPass = await compare(password, user.password);
      if (isValidPass == false) throw 'Wrong Password!';

      // Check if user is activated
      if (!user.activation) {
        throw 'Account not activated! Please check your email and verify your account.';
      }

      // If user is activated, generate JWT token
      const payload = {
        id: user.id,
      };
      const token = sign(payload, jwtKey!, { expiresIn: '1d' });

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


  //keep log in
  async keepLogin(req: Request, res: Response) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true, username: true
            }
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error
        });
    }
  }

  //Resend Verification Email
  async resendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      // if(!user)
    } catch (err) {
      console.error('Failed to resend verification email:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to resend verification email',
      });
    }
  }

  //Update Email 
  // async updateEmail(req: Request, res: Response) {
  //   try {
  //       const validate = await prisma.user.findUnique({
  //           where: { email: req.user?.email}
  //       })
  //       if (validate) throw 'Email has been used with another account'
  //       await prisma.user.update({
  //           data: {
  //               email: req.user?.email
  //           },
  //           where: {
  //               id: req.user?.id
  //           }
  //       })
  //       res.status(200).json({
  //           status: 'ok',
  //           message: 'Update Email Success'
  //       })
  //   } catch (err) {
  //       res.status(400).json({
  //           status: 'error',
  //           message: err
  //       })
  //   }
  // }

  //Reset Password 
  async resetPassword(req: Request, res: Response) {

    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email }
        })
        if (!user) throw 'Account not found'
        const payload = {
            id: user?.id,
            email: user?.email
        }
        const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h' })
        const link = `http://localhost:3000/verify/forget_password/update/${token}`
        const templatePath = path.join(__dirname, "../templates", "resetPassword.html")
        const templateSource = fs.readFileSync(templatePath, 'utf-8')
        const compiledTemplate = handlebars.compile(templateSource)
        const html = compiledTemplate({
            name: user?.username,
            link
        })

        await transporter.sendMail({
            from: process.env.MAIL_USER!,
            to: req.body.email,
            subject: "Reset password confirmation",
            html
        })
        res.status(200).json({status: 'ok', message: 'email sended'})
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        })
    }
  }

  //Update Password
  // async updatePassword(req: Request, res: Response) {
  //   try {
  //       const {password, confirm} = req.body
  //       if (password !== confirm) throw 'Invalid confirmation'
        
  //       const salt = await genSalt(10)
  //       const hashPassword = await hash(password, salt)

  //       await prisma.user.update({
  //           data: {password: hashPassword},
  //           where: { email: req.user?.email}
  //       })

  //       res.status(200).json({status: 'ok', message: 'User updated'})
  //   } catch (err) {
  //       res.status(400).json({
  //           status: 'error',
  //           message: err
  //       })
  //   }
  // }
}
