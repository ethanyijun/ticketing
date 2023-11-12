import { Subjects, TicketUpdatedEvent } from "@ethtickets/common";
import { kafkaConfigWrapper } from "../../../kafka-config-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(kafkaConfigWrapper.kafka);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
    isReserved: false,
  });
  await ticket.save();
  const dataEvent: TicketUpdatedEvent = {
    subject: Subjects.TicketUpdated,
    data: {
      id: ticket.id,
      version: ticket.version + 1,
      title: "test",
      price: 10,
      userId: new mongoose.Types.ObjectId().toHexString(),
    },
  };
  return { listener, dataEvent, ticket };
};

it("finds, updates, and saves a ticket", async () => {
  const { dataEvent, ticket, listener } = await setup();
  await listener.onMessage(dataEvent.data);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(dataEvent.data.title);
  expect(updatedTicket!.price).toEqual(dataEvent.data.price);
  expect(updatedTicket!.version).toEqual(dataEvent.data.version);
});

it("does not call ack if the event has a skipped version number", async () => {
  const { dataEvent, ticket, listener } = await setup();

  dataEvent.data.version = 10;

  try {
    await listener.onMessage(dataEvent.data);
  } catch (err) {}
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.version).not.toEqual(dataEvent.data.version);
});
