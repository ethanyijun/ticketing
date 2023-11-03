import { Listener, Subjects, TicketUpdatedEvent } from "@ethtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  async onMessage(data: TicketUpdatedEvent["data"]): Promise<void> {
    const { id, title, price, version } = JSON.parse(data.toString());
    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      console.log("Not found!!!");
      return;
    }
    //  throw new Error("Ticket not found");
    ticket.set({ title, price });
    await ticket.save();
  }
  readonly subject = Subjects.TicketUpdated;
}
