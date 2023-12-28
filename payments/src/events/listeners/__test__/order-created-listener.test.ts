import { Subjects, OrderCreatedEvent, OrderStatus } from "@ethtickets/common";
import { kafkaConfigWrapper } from "../../../kafka-config-wrapper";
import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(kafkaConfigWrapper.kafka);
  const dataEvent: OrderCreatedEvent = {
    subject: Subjects.OrderCreated,
    data: {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 1,
      userId: new mongoose.Types.ObjectId().toHexString(),
      ticket: {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
      },
      expiresAt: new Date().toISOString(),
      status: OrderStatus.Created,
    },
  };
  return { listener, dataEvent };
};

it("creates and saves an order", async () => {
  const { listener, dataEvent } = await setup();
  await listener.onMessage(dataEvent.data);
  const order = await Order.findById(dataEvent.data.id);
  expect(order!).toBeDefined();
  expect(order!.userId).toEqual(dataEvent.data.userId);
  expect(order!.price).toEqual(dataEvent.data.ticket.price);
});
