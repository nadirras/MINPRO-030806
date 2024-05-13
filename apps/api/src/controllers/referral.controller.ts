import { Request, Response } from 'express';
import prisma from '@/prisma';

export class ReferralController {
  async createReferralVoucher(req: Request, res: Response) {
    try {
      const { userId, myReferralCode } = req.body;
      const referral = await prisma.referral.create({
        data: {
          userId,
          myReferralCode,
        },
      });
      res.status(201).send({
        status: 'created',
        referral,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getreferralById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const referral = await prisma.referral.findUnique({
        where: { id: +id },
      });

      if (!referral) {
        res.status(404).send({
          status: 'error',
          message: 'referral voucher not found',
        });
      }

      res.status(200).send({
        status: 'ok',
        referral,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
  async updateReferralVoucher(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedReferralVoucher = await prisma.referral.update({
        where: { id: Number(id) },
        data: req.body,
      });
      res.status(200).send({ updatedReferralVoucher });
    } catch (error) {
      res.status(400).send({ error: 'Failed to update referral voucher' });
    }
  }

  async deleteReferralVoucher(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.referral.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (error) {
      res.status(400).send({ error: 'Failed to delete referral voucher' });
    }
  }
}
