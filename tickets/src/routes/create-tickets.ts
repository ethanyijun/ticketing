import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { kafkaWrapper } from "../kafka-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must be valid"),
    body("price")
      .isFloat({ gt: 0 })
      .not()
      .isEmpty()
      .withMessage("Price must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();
    await new TicketCreatedPublisher(kafkaWrapper.kafka).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  }
);
export { router as createTicketsRouter };
