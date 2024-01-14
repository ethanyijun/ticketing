import { OrderStatus, Subjects, OrderCancelledEvent } from "@ethtickets/common";
import { kafkaConfigWrapper } from "../../../kafka-config-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancel-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(kafkaConfigWrapper.kafka);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "test",
    price: 12,
    userId: "123",
  });
  ticket.orderId = orderId;
  await ticket.save();
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  return { listener, data, ticket, orderId };
};

it("updates ticket, publishes an event, and acks the message", async () => {
  const { listener, data, ticket, orderId } = await setup();
  await listener.onMessage(data);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(undefined);
  expect(kafkaConfigWrapper.kafka.produce).toHaveBeenCalled();

  expect(
    (kafkaConfigWrapper.kafka.produce as jest.Mock).mock.calls[0][1].orderId
  ).toEqual(undefined);
});

// it("publish a ticket updated event", async () => {
//   const { listener, data, ticket } = await setup();
//   await listener.onMessage(data);
//   expect(kafkaConfigWrapper.kafka.produce).toHaveBeenCalled();
//   expect(data.id).toEqual(
//     (kafkaConfigWrapper.kafka.produce as jest.Mock).mock.calls[0][1].orderId
//   );
// });
