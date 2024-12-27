import { Listener, PaymentCreatedEvent, Subjects } from "@ethtickets/common";
import { NodeMailer } from "../../nodemailer";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  service = "email";

  async onMessage(data: PaymentCreatedEvent["data"]) {}
  readonly subject = Subjects.PaymentCreated;
}
