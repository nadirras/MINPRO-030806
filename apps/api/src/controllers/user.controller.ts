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
import jwt from 'jsonwebtoken';
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
  // async updateProfile(req: Request, res: Response) {
  //   try {
  //     const userId = req.user?.id;
  //     let newPath = null;
  //     const tanggalLahir = new Date(req.body.tanggal_lahir);

  //     if (req.file) {
  //       const { originalname, path } = req.file;
  //       const parts = originalname.split('.');
  //       const ext = parts[parts.length - 1];
  //       newPath = path + '.' + ext;
  //       fs.renameSync(path, newPath);
  //     }
  //     // const {
  //     //   nama_depan,
  //     //   nama_belakang,
  //     //   jenis_kelamin,
  //     //   tanggal_lahir,
  //     //   nomor_telepon,
  //     // } = req.body;

  //     if (!userId) {
  //       throw new Error('User ID not found in request.');
  //     }

  //     // // Get username and email from the associated User entity
  //     const user = await prisma.userDetail.findUnique({
  //       where: { userId: userId },
  //     });

  //     if (!user) {
  //       throw new Error('User not found.');
  //     }

  //     const updateUserDetail = await prisma.userDetail.update({
  //       where: { userId },
  //       data: {
  //         nama_depan: req.body.nama_depan,
  //         nama_belakang: req.body.nama_belakang,
  //         jenis_kelamin: req.body.jenis_kelamin,
  //         tanggal_lahir: tanggalLahir,
  //         nomor_telepon: req.body.nomor_telepon,
  //         photo_profile: newPath ? newPath : user?.photo_profile,
  //       },
  //     });
  //     // const { username, email } = user;

  //     res.status(200).json({
  //       status: 'OK',
  //       message: 'Profile updated successfully',
  //       userDetail: updateUserDetail,
  //       // username,
  //       // email,
  //     });
  //   } catch (err) {
  //     console.error('Failed to update profile:', err);
  //     res.status(400).json({
  //       status: 'error',
  //       message: err,
  //     });
  //   }
  // }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User ID not found in request.');
      }

      const {
        nama_depan,
        nama_belakang,
        jenis_kelamin,
        tanggal_lahir,
        nomor_telepon,
      } = req.body;

      console.log(req.file);

      // Validasi format tanggal_lahir (YYYY-MM-DD)
      if (tanggal_lahir && !/^(\d{4})-(\d{2})-(\d{2})$/.test(tanggal_lahir)) {
        throw new Error('Tanggal lahir harus diisi dalam format YYYY-MM-DD.');
      }

      // Retrieve existing user detail or create a new one if not found
      let existingUserDetail = await prisma.userDetail.findUnique({
        where: { userId },
      });

      if (!existingUserDetail) {
        // Create a new user detail if not found
        existingUserDetail = await prisma.userDetail.create({
          data: {
            userId,
            nama_depan,
            nama_belakang,
            jenis_kelamin,
            tanggal_lahir: new Date(tanggal_lahir),
            nomor_telepon,
            photo_profile: `http://localhost:8000/public/images/${req.file?.filename}`, // Set initial photo_profile to null or update accordingly
          },
        });
      } else {
        // Prepare updated data based on existing values and incoming changes
        const updatedDetails: any = {};

        if (
          nama_depan !== undefined &&
          nama_depan !== existingUserDetail.nama_depan
        ) {
          updatedDetails.nama_depan = nama_depan;
        }

        if (
          nama_belakang !== undefined &&
          nama_belakang !== existingUserDetail.nama_belakang
        ) {
          updatedDetails.nama_belakang = nama_belakang;
        }

        if (
          jenis_kelamin !== undefined &&
          jenis_kelamin !== existingUserDetail.jenis_kelamin
        ) {
          updatedDetails.jenis_kelamin = jenis_kelamin;
        }

        if (
          tanggal_lahir !== undefined &&
          tanggal_lahir !== existingUserDetail.tanggal_lahir?.toISOString()
        ) {
          updatedDetails.tanggal_lahir = new Date(tanggal_lahir);
        }

        if (
          nomor_telepon !== undefined &&
          nomor_telepon !== existingUserDetail.nomor_telepon
        ) {
          updatedDetails.nomor_telepon = nomor_telepon;
        }

        // Update photo_profile only if a new file is uploaded
        const imageUrl = req.file
          ? `http://localhost:8000/public/images/${req.file.filename}`
          : null;

        if (imageUrl && imageUrl !== existingUserDetail.photo_profile) {
          updatedDetails.photo_profile = imageUrl;
        }

        if (Object.keys(updatedDetails).length > 0) {
          const updateUserDetail = await prisma.userDetail.update({
            where: { userId },
            data: updatedDetails,
          });

          // Get username and email from the associated User entity
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, email: true },
          });

          if (!user) {
            throw new Error('User not found.');
          }

          res.status(200).send({
            status: 'OK',
            message: 'Profile updated successfully',
            userDetail: updateUserDetail,
            username: user.username,
            email: user.email,
          });
        } else {
          // No changes were made
          res.status(200).send({
            status: 'OK',
            message: 'No changes applied',
            userDetail: existingUserDetail,
          });
        }
      }
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

      const payload = {
        id: user.id,
        reset: true,
      };

      const reset_token = sign(payload, process.env.KEY_JWT!);
      //Prepare email template
      const link = `http://localhost:3000/reset-password/${reset_token}`;

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
        link,
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
        reset_token,
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
      return res.status(401).send({ message: 'User ID not found in request.' });
    }

    const { newEmail } = req.body;

    if (!newEmail) {
      return res
        .status(400)
        .send({ message: 'New email address is required.' });
    }

    try {
      // Find the user based on ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Check if the new email is already in use
      const existingUser = await prisma.user.findUnique({
        where: {
          email: newEmail,
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }

      // Generate JWT token for email verification
      const payload = {
        id: user.id,
        newEmail: newEmail,
      };
      const token = sign(payload, jwtKey!, { expiresIn: '1d' });
      const link = `http://localhost:3000/verifikasi-email/${userId}`;

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
        link,
      });

      //Send verify email
      await transporter.sendMail({
        from: 'diahnof@gmail.com',
        to: newEmail,
        subject: 'Change Email Confirmation',
        html,
      });

      // Send success response
      res.status(200).send({
        status: 'OK',
        message:
          'Verification email sent. Please check your new email to verify the address',
        newEmail,
        token,
      });
    } catch (error) {
      console.error('Failed to change email:', error);
      res.status(500).send({ message: 'Failed to change email.' });
    }
  }

  //verify new wmail
  async verifyChangeEmail(req: Request, res: Response) {
    try {
      // get token from req.params
      let token: string | undefined = req.params.token;

      if (!token) {
        token =
          (req.query.token as string) ||
          req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          throw new Error('Token is required.');
        }
      }

      // Verify token
      const jwtKey = process.env.KEY_JWT!;
      const verifyUser = jwt.verify(token, jwtKey) as {
        id: number;
        newEmail: string;
      };

      // Debug logging
      console.log('Decoded token:', verifyUser);

      if (!verifyUser.id || !verifyUser.newEmail) {
        throw new Error('Invalid token payload');
      }

      //Update email in database
      const updateUser = await prisma.user.update({
        where: { id: verifyUser.id },
        data: { email: verifyUser.newEmail },
      });

      res.status(200).send({
        status: 'OK',
        message: 'Email updated successfully.',
        user: updateUser,
      });
    } catch (error) {
      console.error('Failed to verify email change:', error);
      res.status(500).send({ message: 'Failed to verify email change.' });
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
