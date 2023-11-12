import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from "@ethtickets/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { kafkaConfigWrapper } from "../../kafka-config-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  async onMessage(data: OrderCreatedEvent["data"]) {
    const {
      ticket: { id: ticketId },
      id: orderId,
    } = data;

    const findTicket = await Ticket.findById(ticketId);
    if (!findTicket) throw new NotFoundError();
    findTicket.set({
      orderId,
    });
    await findTicket.save();
    await new TicketUpdatedPublisher(this.kafkaConfig).publish({
      id: findTicket.id,
      title: findTicket.title,
      price: findTicket.price,
      userId: findTicket.userId,
      version: findTicket.version,
      orderId: orderId,
    });
  }
  readonly subject = Subjects.OrderCreated;
}
