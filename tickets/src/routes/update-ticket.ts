import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { kafkaConfigWrapper } from "../kafka-config-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must be valid"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticketId = req.params.id;
    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket) throw new NotFoundError();
    if (req.currentUser!.id !== findTicket.userId)
      throw new NotAuthorizedError();
    findTicket.set({
      title,
      price,
    });
    await findTicket.save();
    await new TicketUpdatedPublisher(kafkaConfigWrapper.kafka).publish({
      id: findTicket.id,
      title: findTicket.title,
      price: findTicket.price,
      userId: findTicket.userId,
      version: findTicket.version,
    });
    res.status(200).send(findTicket);
  }
);
export { router as updateTicketRouter };
