import { Listener, Subjects, TicketCreatedEvent } from "@ethtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  service = "orders";
  async onMessage(data: TicketCreatedEvent["data"]) {
    const { id, title, price, availableTickets } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
      availableTickets,
    });
    await ticket.save();
  }
  readonly subject = Subjects.TicketCreated;
}
