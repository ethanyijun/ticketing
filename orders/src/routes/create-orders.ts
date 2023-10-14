import {
  // BadRequestError,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket Id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // const { title, price } = req.body;
    // const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    // await ticket.save();
    // await new TicketCreatedPublisher(kafkaWrapper.kafka).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    // });
    // res.status(201).send(ticket);
  }
);
export { router as createOrdersRouter };
