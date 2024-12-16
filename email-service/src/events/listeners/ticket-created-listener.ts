import { Listener, Subjects, TicketCreatedEvent } from "@ethtickets/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  service = "email";
  async onMessage(data: TicketCreatedEvent["data"]) {}
  readonly subject = Subjects.TicketCreated;
}
