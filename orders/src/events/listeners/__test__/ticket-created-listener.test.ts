import { Subjects, TicketCreatedEvent } from "@ethtickets/common";
import { kafkaConfigWrapper } from "../../../kafka-config-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketCreatedListener(kafkaConfigWrapper.kafka);
  const dataEvent: TicketCreatedEvent = {
    subject: Subjects.TicketCreated,
    data: {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 1,
      title: "test",
      price: 10,
      userId: new mongoose.Types.ObjectId().toHexString(),
    },
  };
  return { listener, dataEvent };
};

it("creates and saves a ticket", async () => {
  const { listener, dataEvent } = await setup();
  await listener.onMessage(dataEvent.data);
  const ticket = await Ticket.findById(dataEvent.data.id);
  expect(ticket!).toBeDefined();
  expect(ticket!.title).toEqual(dataEvent.data.title);
  expect(ticket!.price).toEqual(dataEvent.data.price);
});
