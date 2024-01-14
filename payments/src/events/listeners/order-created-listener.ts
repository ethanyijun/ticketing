import { Listener, OrderCreatedEvent, Subjects } from "@ethtickets/common";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  service = "payment";
  async onMessage(data: OrderCreatedEvent["data"]) {
    const {
      id: orderId,
      version,
      userId,
      ticket: { price },
      status,
    } = data;
    const order = Order.build({
      id: orderId,
      status,
      userId,
      version,
      price,
    });
    await order.save();
  }
  readonly subject = Subjects.OrderCreated;
}
