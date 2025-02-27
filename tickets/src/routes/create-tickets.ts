import { requireAuth, validateRequest } from "@ethtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { kafkaConfigWrapper } from "../kafka-config-wrapper";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

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
    body("availableTickets")
      .isInt()
      .not()
      .isEmpty()
      .withMessage("Available tickets number must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, availableTickets } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      availableTickets,
    });
    await ticket.save();
    await new TicketCreatedPublisher(kafkaConfigWrapper.kafka).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      availableTickets: ticket.availableTickets,
      userEmail: req.currentUser!.email,
    });
    res.status(201).send(ticket);
  }
);
export { router as createTicketsRouter };
