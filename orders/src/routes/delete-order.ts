import {
  // BadRequestError,
  // NotAuthorizedError,
  // NotFoundError,
  requireAuth,
  validateRequest,
} from "@ethtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    // const { title, price } = req.body;
    // const ticketId = req.params.id;
    // const findTicket = await Ticket.findById(ticketId);
    // if (!findTicket) throw new NotFoundError();
    // if (req.currentUser!.id !== findTicket.userId)
    //   throw new NotAuthorizedError();
    // findTicket.set({
    //   title,
    //   price,
    // });
    // await findTicket.save();
    // await new TicketUpdatedPublisher(kafkaWrapper.kafka).publish({
    //   id: findTicket.id,
    //   title: findTicket.title,
    //   price: findTicket.price,
    //   userId: findTicket.userId,
    // });
    // res.status(200).send(findTicket);
  }
);
export { router as deleteOrderRouter };
