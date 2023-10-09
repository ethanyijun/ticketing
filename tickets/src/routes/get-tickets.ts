import { requireAuth } from "@ethtickets/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const findTicket = await Ticket.find({});
  res.send(findTicket);
});
export { router as getTicketsRouter };
