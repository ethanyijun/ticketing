import { OrderStatus, Subjects, OrderCreatedEvent } from "@ethtickets/common";
import { kafkaConfigWrapper } from "../../../kafka-config-wrapper";
import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new OrderCreatedListener(kafkaConfigWrapper.kafka);
  const ticket = Ticket.build({
    title: "test",
    price: 12,
    userId: "123",
  });
  await ticket.save();
  console.log("test ticket: ", ticket);
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "123",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    expiresAt: "2012",
    status: OrderStatus.Created,
  };

  return { listener, data, ticket };
};

it("creates and saves a ticket", async () => {
  const { listener, data, ticket } = await setup();
  await listener.onMessage(data);
  //   const ticketFound = await Ticket.findByEvent({
  //     id: data.id,
  //     version: data.version,
  //   });
  //   expect(ticketFound!).toBeDefined();
  //   expect(ticket!.orderId).toEqual(data.id);
  //   expect(ticket!.price).toEqual(data.price);
});
