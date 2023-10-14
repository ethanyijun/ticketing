import { requireAuth } from "@ethtickets/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/orders", async (req: Request, res: Response) => {
  // const findTicket = await Ticket.find({});
  // res.send(findTicket);
});
export { router as getOrdersRouter };
