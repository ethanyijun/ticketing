import { Publisher, Subjects, TicketUpdatedEvent } from "@ethtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
