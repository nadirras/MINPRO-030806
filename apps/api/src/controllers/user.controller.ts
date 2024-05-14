import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { transporter } from '../helpers/nodemailer';
import dotenv from 'dotenv';
import multer from 'multer';
dotenv.config();
// const databaseUrl = process.env.DATABASE_URL;
const jwtKey = process.env.KEY_JWT;
// const mailUser = process.env.MAIL_USER;

const prisma = new PrismaClient();

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
        id: newUser.id,
      };

      const token = sign(payload, process.env.KEY_JWT!);
      //Prepare email template
      const link = `http://localhost:3000/verifikasi/${token}`;

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
        message: 'error',
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
        data: { activation: true },
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

  //login account
  async loginAccount(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          email: email.trim(),
        },
      });

      if (user == null) throw 'User not found!';
      if (user.activation === false)
        throw 'Not active, please check your email for verification your acount';

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
        include: { UserDetail: true }, // Use 'UserDetail' instead of 'userDetail'
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }

      res.status(200).json({
        status: 'success',
        user,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  //update profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User ID not found in request.');
      }

      console.log(req.file);

      const {
        nama_depan,
        nama_belakang,
        jenis_kelamin,
        tanggal_lahir,
        nomor_telepon,
      } = req.body;
      const imageUrl = req.file
        ? `http://localhost:8000/public/images/${req.file.filename}`
        : null;

      // Validasi format tanggal_lahir (YYYY-MM-DD)
      if (!tanggal_lahir || !/^(\d{4})-(\d{2})-(\d{2})$/.test(tanggal_lahir)) {
        throw new Error('Tanggal lahir harus diisi dalam format YYYY-MM-DD.');
      }

      console.log(req.body);
      // Update user profile in database
      const updateUserDetail = await prisma.userDetail.upsert({
        where: { userId },
        update: {
          nama_depan,
          nama_belakang,
          jenis_kelamin,
          tanggal_lahir: new Date(tanggal_lahir),
          nomor_telepon,
          photo_profile: imageUrl,
        },
        create: {
          userId,
          nama_depan,
          nama_belakang,
          jenis_kelamin,
          tanggal_lahir: new Date(tanggal_lahir),
          nomor_telepon,
          photo_profile: imageUrl,
        },
      });

      // Dapatkan informasi username dan email dari entitas User terkait
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      const { username, email } = user;

      res.status(200).send({
        status: 'OK',
        message: 'Profile updated successfully',
        userDetail: updateUserDetail,
        username,
        email,
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
      res.status(400).send({
        status: 'error',
        message: 'Failed to update profile',
      });
    }
  }

  //forgot password
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).send({ message: 'Email not found.' });
      }

      //Send email reset password
      const templatePath = path.join(
        __dirname,
        '../templates',
        'resetPassword.html',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name: user.username,
      });

      //Send registration email
      await transporter.sendMail({
        from: 'diahnof@gmail.com',
        to: user.email,
        subject: 'Reset your password in Zenith Tiket',
        html,
      });

      //Send response
      res.status(201).send({
        status: 'OK',
        message: 'Reset password link sent to your email.',
        email,
      });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: 'Failed to send reset password email.',
      });
    }
  }

  //reset password
  async resetPassword(req: Request, res: Response) {
    const { email, newPassword } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).send({ message: 'Email not found.' });
      }

      // Hash password baru sebelum menyimpan ke database
      const hashPassword = await hash(newPassword, 10);

      // Update password user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashPassword,
        },
      });

      //Send email confirmation reset password
      const templatePath = path.join(
        __dirname,
        '../templates',
        'conformationResetPassword.html',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name: user.username,
      });

      //Send registration email
      await transporter.sendMail({
        from: 'diahnof@gmail.com',
        to: user.email,
        subject: 'Confirmation Reset Password',
        html,
      });

      res.status(200).send({
        status: 'OK',
        message: 'Your password has been reset!',
        updatedUser,
      });
    } catch (error) {
      console.error('Failed to reset password:', error);
      res.status(500).send({ message: 'Failed to reset password.' });
    }
  }

  //change email
  async changeEmail(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in request.' });
    }

    const { newEmail, username } = req.body;

    if (!newEmail) {
      return res
        .status(400)
        .json({ message: 'New email address is required.' });
    }

    try {
      // Find the user based on ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Check existing email
      const existingUser = await prisma.user.findUnique({
        where: {
          email: newEmail,
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }

      // Update the user's email
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          username,
          email: newEmail,
        },
      });

      //Send email confirmation change email
      const templatePath = path.join(
        __dirname,
        '../templates',
        'verifyChangeEmail.html',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name: user.username,
      });

      //Send registration email
      await transporter.sendMail({
        from: 'diahnof@gmail.com',
        to: user.email,
        subject: 'Change Email Confirmation',
        html,
      });

      // Send success response
      res.status(200).json({
        status: 'OK',
        message: 'Email updated successfully.',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Failed to change email:', error);
      res.status(500).json({ message: 'Failed to change email.' });
    }
  }

  //Get data by Id
  async GetDataById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid user ID' });
      }

      // Use Prisma to fetch all related data from different tables
      const userData = await prisma.user.findUnique({
        where: { id },
        include: {
          UserDetail: true,
          referral: true,
          discountVoucher: true,
          Points: true,
        },
      });

      // Check if userData is found
      if (!userData) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }

      res.status(200).json({
        status: 'success',
        userData,
      });
    } catch (error) {
      console.error('Error fetching user data by ID:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user data',
      });
    }
  }
}
