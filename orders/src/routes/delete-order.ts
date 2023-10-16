import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.currentUser!.id,
    });

    if (!order) throw new NotFoundError();
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an event saying this was cancelled
    res.status(204).send(order);
  }
);
export { router as deleteOrderRouter };
