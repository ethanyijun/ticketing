import { Listener, Subjects, TicketUpdatedEvent } from "@ethtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  async onMessage(data: TicketUpdatedEvent["data"]): Promise<void> {
    const { id, title, price } = JSON.parse(data.toString());
    const ticket = await Ticket.findById(id);
    if (!ticket) throw new Error("Ticket not found");
    ticket.set({ title, price });
    await ticket.save();
  }
  readonly subject = Subjects.TicketUpdated;
}
