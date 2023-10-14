import { NotFoundError, requireAuth } from "@ethtickets/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    // const ticketId = req.params.id;
    // const findTicket = await Ticket.findById(ticketId);
    // if (!findTicket) throw new NotFoundError();
    // res.send(findTicket);
  }
);
export { router as getOrderRouter };
