import {
  Listener,
  Subjects,
  ExpirationCompleted,
  OrderStatus,
} from "@ethtickets/common";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompleted> {
  async onMessage(data: ExpirationCompleted["data"]) {
    const { orderId } = data;
    const order = await Order.findById(orderId);

    if (!order) {
      console.log("Order not found!!!");
      return;
    }
    if (order.status === OrderStatus.Completed) return;
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledPublisher(this.kafkaConfig).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.toString(),
      },
    });
  }
  readonly subject = Subjects.ExpirationComplete;
}
