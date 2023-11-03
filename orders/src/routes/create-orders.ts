import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  // BadRequestError,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { kafkaConfigWrapper } from "../kafka-config-wrapper";

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
    const { ticketId } = req.body;
    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket) throw new NotFoundError();
    if (findTicket.isReserved)
      throw new BadRequestError("Ticket is already reserved");

    let now = new Date();
    now.setMinutes(now.getMinutes() + 15); // timestamp
    const expiration = new Date(now);
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticketId,
    });
    await order.save();
    findTicket.isReserved = true;
    await findTicket.save();
    await new OrderCreatedPublisher(kafkaConfigWrapper.kafka).publish({
      id: order.id,
      userId: order.userId,
      version: order.version,
      ticket: {
        id: ticketId as string,
        price: findTicket.price,
      },
      expiresAt: order.expiresAt.toISOString(),
      status: order.status,
    });
    res.status(201).send(order);
  }
);
export { router as createOrdersRouter };
