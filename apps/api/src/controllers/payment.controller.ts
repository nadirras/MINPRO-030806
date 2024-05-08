import { Request, Response } from 'express';
import prisma from '@/prisma';

export class PaymentController {

  async createPayment(req: Request, res: Response) {
    const transactionResult = await prisma.$transaction(async(prisma) =>{
      try {
        const payment = await prisma.sample.create({
          data: req.body,
        });
        
        return res.status(201).send({
          status: "created",
          message: "add payment success",
          payment
        });
      } catch (error) {
        return res.status(400).send({
          status: "error",
          error
        })
      }
      
    })

    

   
  }
}
