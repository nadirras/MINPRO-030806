import { Request, Response } from 'express';
import prisma from '@/prisma';

export class PaymentController {
  async createPayment(req: Request, res: Response) {
    const { userId, orderId, amount, discountId } = req.body;
    try {
      const payment = await prisma.payment.create({
        data: {
          userId,
          orderId,
          amount,
          discountId,
        },
      });

      res.status(201).send({
        status: 'created',
        message: 'add payment success',
        payment,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }

  async getPayments(req: Request, res: Response) {
    try {
      const payments = await prisma.payment.findMany();
      res.status(200).send({ payments });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch payments' });
    }
  }

  async getPaymentById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: +id },
      });
      if (!payment) {
        return res.status(404).send({ error: 'Payment not found' });
      }
      res.status(200).send({ payment });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch payment' });
    }
  }

  async updatePayment(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedPayment = await prisma.payment.update({
        where: { id: +id },
        data: req.body,
      });
      res.status(200).send({ updatedPayment });
    } catch (error) {
      res.status(400).send({ error: 'Failed to update payment' });
    }
  }

  async deletePayment(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.payment.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (error) {
      res.status(400).send({ error: 'Failed to delete payment' });
    }
  }
}
