import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { sign} from 'jsonwebtoken';
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
      const {username, email, password, usedReferralCode} = req.body
      
      //check if required fields are provided
      if (!username || !email || !password) {
        return res.status(400).send({
          status : 'error',
          mesage: 'Username, email, and password are required fields'
        })
      }

       // Check if the email or username already exists to prevent duplicates
       const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
      });
      
      if (existingUser) {
        return res.status(400).json({
            status: 'error',
            message: 'Email is already registered. Please use a different email.'
        });
      }

       // Hash the password before storing in the database
       const salt = await genSalt(10);
       const hashPassword = await hash(password, salt);

      //Create new user in the database
      const newUser = await prisma.user.create({
        data : {
          username, 
          email, 
          password: hashPassword,
          usedReferralCode
        }
      })

      //Generate JWT token 
      const payload = {
        id: newUser.id
      }

      const token = sign(payload, process.env.KEY_JWT!);
      //Prepare email template
      const link = `http://localhost:3000/verify/${token}`;
      const templatePath = path.join(__dirname, '../templates', 'register.html');
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name : newUser.username,
        link
      })

      //Send registration email 
      await transporter.sendMail({
        from: 'diahnof@gmail.com',
        to : newUser.email,
        subject : 'Welcome to Loket.com',
        html
      })

      //Send response
      res.status(201).send({
        status : 'OK',
        message: 'User registered successfully',
        user : newUser,
        token
      })
    } catch (err) {
      console.error('Failed to register account', err)
      res.status(400).send({
        status: 'error',
        message: 'Failed to register account'
      })
    }
  }

  //verify account 
  // async verifyUser(req: Request, res: Response) {
  //   try {
  //     await prisma.user.update({
  //       data: {
  //         activation: true
  //       },
  //       where : {
  //         id: req.user?.id
  //       }
  //     })

  //     res.status(200).send({
  //       status : 'OK',
  //       message : 'Verify Account Success'
  //     })

  //   } catch (err) {
  //     console.log(err);
  //     res.status(400).send({
  //       status: 'error',
  //       message: 'Verification account has been failed'
  //     })
  //   }
  // }

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
  //   async forgotPassword(req: Request, res: Response) {
  //     const { email } = req.body;

  // try {
  //   // Cari pengguna berdasarkan alamat email
  //   const user = await prisma.user.findUnique({
  //     where: { email }
  //   });

  //   if (!user) {
  //     return res.status(404).json({ message: "User not found" });
  //   }

  //   // Generate token reset password (misalnya menggunakan library uuid atau random string)
  //   const resetToken = await bcrypt.hash(email, 10);

  //   // Simpan token reset pada data pengguna di database
  //   await prisma.user.update({
  //     where: { id: user.id },
  //     data: { resetToken }
  //   });

  //   // Kirim email reset password dengan link berisi token
  //   const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     secure: process.env.SMTP_SECURE === 'true',
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS
  //     }
  //   });

  //   await transporter.sendMail({
  //     from: 'your-email@example.com',
  //     to: email,
  //     subject: 'Reset Your Password',
  //     html: `Click <a href="${resetLink}">here</a> to reset your password.`
  //   });

  //   res.status(200).json({ message: "Reset password email sent successfully" });
  // } catch (error) {
  //   console.error("Error in forgotPassword:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
  // }

  // async resetPassword(req: Request, res: Response) {
  //   const { resetToken, newPassword } = req.body;

  // try {
  //   // Cari user berdasarkan token reset
  //   const user = await prisma.user.findUnique({
  //     where: { resetToken }
  //   });

  //   if (!user) {
  //     return res.status(404).json({ message: "Invalid or expired reset token" });
  //   }

  //   // Hash password baru
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(newPassword, salt);

  //   // Update password pengguna dan hapus token reset
  //   await prisma.user.update({
  //     where: { id: user.id },
  //     data: {
  //       password: hashedPassword,
  //       resetToken: null // Hapus token reset setelah password direset
  //     }
  //   });

  //   res.status(200).json({ message: "Password reset successfully" });
  // } catch (error) {
  //   console.error("Error in resetPassword:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
  // }
}

