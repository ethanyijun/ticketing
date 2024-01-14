import {
  Listener,
  NotFoundError,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
  TicketCreatedEvent,
} from "@ethtickets/common";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  service = "orders";

  async onMessage(data: PaymentCreatedEvent["data"]) {
    const { orderId } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = OrderStatus.Completed;
    await order.save();
  }
  readonly subject = Subjects.PaymentCreated;
}
