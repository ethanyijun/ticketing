import { NotFoundError, requireAuth } from "@ethtickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const order = await Order.findOne({ userId, _id: req.params.id }).populate(
      "ticket"
    );
    if (!order) throw new NotFoundError();
    res.send(order);
  }
);
export { router as getOrderRouter };
