import { Listener, Subjects, TicketCreatedEvent } from "@ethtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  async onMessage(data: TicketCreatedEvent["data"]) {
    const { id, title, price } = JSON.parse(data.toString());
    const ticket = Ticket.build({
      id,
      title,
      price,
      isReserved: false,
    });
    await ticket.save();
  }
  readonly subject = Subjects.TicketCreated;
}
