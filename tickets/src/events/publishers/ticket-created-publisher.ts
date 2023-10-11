import { Publisher, Subjects, TicketCreatedEvent } from "@ethtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
