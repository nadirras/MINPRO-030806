import { Request, Response } from 'express';
import prisma from '@/prisma';

export class DiscountController {
  async createDiscountVoucher(req: Request, res: Response) {
    try {
      const {
        userId,
        discountCoupon,
        discountPercentage,
        expired_date,
        discount_status,
      } = req.body;
      const discountVoucher = await prisma.discountVoucher.create({
        data: {
          userId,
          discountCoupon,
          discountPercentage,
          expired_date,
          discount_status,
        },
      });
      res.status(201).send({
        status: 'created',
        discountVoucher,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getdiscountVoucherById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const discountVoucher = await prisma.discountVoucher.findUnique({
        where: { id: +id },
      });

      if (!discountVoucher) {
        res.status(404).send({
          status: 'error',
          message: 'discount voucher not found',
        });
      }

      res.status(200).send({
        status: 'ok',
        discountVoucher,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
  async updateDiscountVoucher(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedDiscountVoucher = await prisma.discountVoucher.update({
        where: { id: Number(id) },
        data: req.body,
      });
      res.status(200).send({ updatedDiscountVoucher });
    } catch (error) {
      res.status(400).send({ error: 'Failed to update discount voucher' });
    }
  }

  async deleteDiscountVoucher(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.discountVoucher.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (error) {
      res.status(400).send({ error: 'Failed to delete discount voucher' });
    }
  }
}
