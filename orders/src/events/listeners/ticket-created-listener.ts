import { Listener, Subjects, TicketCreatedEvent } from "@ethtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  async onMessage(data: TicketCreatedEvent["data"]): Promise<void> {
    const { title, price, id } = data;
    const ticket = Ticket.build({
      title,
      price,
      isReserved: false,
      _id: id,
    });
    await ticket.save();
  }
  readonly subject = Subjects.TicketCreated;
}
