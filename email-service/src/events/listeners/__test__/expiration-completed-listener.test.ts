import {
  ExpirationCompleted,
  OrderStatus,
  Subjects,
  TicketCreatedEvent,
} from "@ethtickets/common";
import { kafkaConfigWrapper } from "../../../kafka-config-wrapper";
import mongoose from "mongoose";
import { ExpirationCompletedListener } from "../expiration-completed-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new ExpirationCompletedListener(kafkaConfigWrapper.kafka);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
    isReserved: false,
  });
  await ticket.save();
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket.id,
  });
  await order.save();
  const dataEvent: ExpirationCompleted["data"] = {
    orderId: order.id,
  };
  return { listener, dataEvent };
};

it("updates the order status to cancelled", async () => {
  const { listener, dataEvent } = await setup();
  await listener.onMessage(dataEvent);
  const order = await Order.findById(dataEvent.orderId);
  expect(order!).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
  expect(kafkaConfigWrapper.kafka.produce).toHaveBeenCalled();

  const eventData = (kafkaConfigWrapper.kafka.produce as jest.Mock).mock
    .calls[0][1];

  expect(eventData.orderId).toEqual(dataEvent.orderId);
});
