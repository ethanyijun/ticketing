import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@ethtickets/common";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  async onMessage(data: OrderCancelledEvent["data"]) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
  }
  readonly subject = Subjects.OrderCancelled;
}
