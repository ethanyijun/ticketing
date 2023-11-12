import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from "@ethtickets/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  async onMessage(data: OrderCancelledEvent["data"]): Promise<void> {
    const {
      ticket: { id: ticketId },
    } = data;
    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket) throw new NotFoundError();
    findTicket.set({
      orderId: undefined,
    });
    await findTicket.save();
    await new TicketUpdatedPublisher(this.kafkaConfig).publish({
      id: findTicket.id,
      title: findTicket.title,
      price: findTicket.price,
      userId: findTicket.userId,
      version: findTicket.version,
      orderId: findTicket.orderId,
    });
  }
  readonly subject = Subjects.OrderCancelled;
}
