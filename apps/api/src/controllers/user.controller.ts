import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
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
export class UserController {
  //create account
  async createAccount(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const users = await prisma.user.create({
        data: {
          ...req.body,
          password: hashPassword,
        },
      });

      const payload = {
        id: users.id,
      };
      const token = sign(payload, jwtKey!, { expiresIn: '1d' });
      const link = `http://localhost:3000/verifikasi/${token}`;

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

      await transporter.sendMail({
        from: mailUser,
        to: users.email,
        subject: 'Welcome to EventZenith',
        html,
      });

      res.status(201).send({
        status: 'ok',
        message: 'User created!',
        users,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: error,
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
      const token = sign(payload, jwtKey!, { expiresIn: '10m' });

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

  async keepLogin(req: Request, res: Response) {
    try {
      const users = await prisma.user.findFirst({
        where: { id: req.user?.id },
      });
      res.status(200).send({
        status: 'ok',
        users,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      await prisma.user.update({
        data: {
          activation: true,
        },
        where: {
          id: req.user?.id,
        },
      });
      res.status(200).send({
        status: 'ok',
        message: 'verify account success',
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }

  //forgot password
  async forgotPassword(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}
