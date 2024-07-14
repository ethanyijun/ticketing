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
import axios from "axios";

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
    console.log("jwt:", req.session?.jwt);
    const { ticketId } = req.body;
    const findTicket = await Ticket.findOne({
      _id: ticketId,
    });
    if (!findTicket) {
      throw new NotFoundError();
    }
    // if (findTicket.isReserved)
    //   throw new BadRequestError("Ticket is already reserved");

    let now = new Date();
    now.setMinutes(now.getMinutes() + 5); // timestamp
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
    // const client = axios.create({
    //   //www.ethangai.xyz
    //   baseURL:
    //     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    //   headers: { ...req.headers, Host: "ticketing.dev" },
    //   // baseURL: "http://ticketing.dev/",
    //   // headers: { ...req.headers, Host: "ticketing.dev" },
    // });
    // const response = await client.get(`/api/tickets/${findTicket.id}`);

    // pass in the header
    // const response = await axios.put(
    //   `http://tickets-srv:3000/api/tickets/book/${findTicket.id}`,
    //   {},
    //   { headers: { Authorization: `Bearer ${req.session?.jwt}` } }
    // );
    // console.log("tickett: ", response.data);
    // .then((response) => {
    //   console.log("tickett: ", response.data);
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    // });

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
