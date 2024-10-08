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
  "/api/tickets/book/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket) throw new NotFoundError();
    if (findTicket.availableTickets == 0)
      throw new BadRequestError("No available tickets!!");
    if (req.currentUser!.id !== findTicket.userId)
      throw new NotAuthorizedError();
    findTicket.set({
      availableTickets: findTicket.availableTickets - 1,
    });
    await findTicket.save();
    res.status(200).send(findTicket);
  }
);
export { router as bookTicketRouter };
