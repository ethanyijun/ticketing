import { Listener, Subjects, TicketUpdatedEvent } from "@ethtickets/common";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  service = "email";

  async onMessage(data: TicketUpdatedEvent["data"]): Promise<void> {}
  readonly subject = Subjects.TicketUpdated;
}
