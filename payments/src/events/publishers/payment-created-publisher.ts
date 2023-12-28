import { Publisher, Subjects, PaymentCreatedEvent } from "@ethtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
