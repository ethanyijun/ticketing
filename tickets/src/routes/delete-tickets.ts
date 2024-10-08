import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { Ticket } from "../models/ticket";
import { kafkaConfigWrapper } from "../kafka-config-wrapper";
// import { TicketDeletedPublisher } from "../events/publishers/ticket-deleted-publisher";

const router = express.Router();

router.delete(
  "/api/tickets/:id",
  requireAuth,
  [param("id").isMongoId().withMessage("Valid ticket ID must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (req.currentUser!.role !== "admin") {
      throw new NotAuthorizedError();
    }

    await Ticket.findByIdAndDelete(ticketId);

    // await new TicketDeletedPublisher(kafkaConfigWrapper.kafka).publish({
    //   id: ticket.id,
    //   version: ticket.version,
    // });

    res.status(200).json({
      message: "Ticket successfully deleted",
      id: ticketId,
    });
  }
);

export { router as deleteTicketsRouter };
