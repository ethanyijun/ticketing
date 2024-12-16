import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@ethtickets/common";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  service = "email";

  async onMessage(data: PaymentCreatedEvent["data"]) {}
  readonly subject = Subjects.PaymentCreated;
}
