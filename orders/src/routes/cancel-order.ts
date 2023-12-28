import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { kafkaConfigWrapper } from "../kafka-config-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.currentUser!.id,
    }).populate("ticket");

    if (!order) throw new NotFoundError();
    order.status = OrderStatus.Cancelled;
    await order.save();
    await new OrderCancelledPublisher(kafkaConfigWrapper.kafka).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.toString(),
      },
    });
    res.status(204).send(order);
  }
);
export { router as cancelOrderRouter };
