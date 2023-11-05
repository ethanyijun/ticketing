import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from "@ethtickets/common";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  async onMessage(data: OrderCreatedEvent["data"]) {
    const {
      ticket: { id: ticketId },
      id: orderId,
    } = data;
    console.log("listener ticket id: ", ticketId);

    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket) throw new NotFoundError();
    findTicket.set({
      orderId,
    });
    await findTicket.save();
  }
  readonly subject = Subjects.OrderCreated;
}
