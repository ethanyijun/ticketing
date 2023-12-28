import { Subjects, OrderStatus, OrderCancelledEvent } from "@ethtickets/common";
import { kafkaConfigWrapper } from "../../../kafka-config-wrapper";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "123",
    version: 0,
  });
  await order.save();
  const listener = new OrderCancelledListener(kafkaConfigWrapper.kafka);
  const dataEvent: OrderCancelledEvent = {
    subject: Subjects.OrderCancelled,
    data: {
      id: order.id,
      version: 1,
      ticket: {
        id: "asldkfj",
      },
    },
  };
  return { listener, dataEvent };
};

it("creates and saves an order", async () => {
  const { listener, dataEvent } = await setup();
  await listener.onMessage(dataEvent.data);
  const order = await Order.findById(dataEvent.data.id);
  expect(order!).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});
