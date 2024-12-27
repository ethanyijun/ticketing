import { Listener, Subjects, TicketCreatedEvent } from "@ethtickets/common";
import { NodeMailer } from "../../nodemailer";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  service = "email";
  async onMessage(data: TicketCreatedEvent["data"]) {
    const nodeMailer = new NodeMailer();
    nodeMailer.sendEmail(
      data.userEmail,
      "You have new ticket created from ticketing",
      `Ticket: ${data.title} has been created for you.`
    );
  }
  readonly subject = Subjects.TicketCreated;
}
