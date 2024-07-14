import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from "@ethtickets/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  service = "tickets";

  async onMessage(data: OrderCancelledEvent["data"]): Promise<void> {
    const {
      ticket: { id: ticketId },
    } = data;
    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket) throw new NotFoundError();
    findTicket.set({
      orderId: undefined,
      availableTickets: findTicket.availableTickets + 1,
    });
    await findTicket.save();
    await new TicketUpdatedPublisher(this.kafkaConfig).publish({
      id: findTicket.id,
      title: findTicket.title,
      price: findTicket.price,
      userId: findTicket.userId,
      version: findTicket.version,
      availableTickets: findTicket.availableTickets + 1,
      // orderId: findTicket.orderId,
    });
  }
  readonly subject = Subjects.OrderCancelled;
}
