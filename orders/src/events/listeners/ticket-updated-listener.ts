import { Listener, Subjects, TicketUpdatedEvent } from "@ethtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  service = "orders";

  async onMessage(data: TicketUpdatedEvent["data"]): Promise<void> {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByEvent({ id, version: version + 1 });

    if (!ticket) {
      console.log("Not found!!!");
      return;
    }
    ticket.set({ title, price, version });
    await ticket.save();
  }
  readonly subject = Subjects.TicketUpdated;
}
