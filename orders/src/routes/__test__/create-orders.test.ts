import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { kafkaConfigWrapper } from "../../kafka-config-wrapper";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user authenticated", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).toEqual(401);
});

it("return status other than 401 if user signed in", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it("error when ticket id not provided", async () => {
  const cookie = global.signin();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});

it("error when ticket not exists", async () => {
  const cookie = global.signin();
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId,
    })
    .expect(404);
});

it("error when ticket reserved", async () => {
  const cookie = global.signin();
  const ticketId = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    id: ticketId.toString(),
    title: "title",
    price: 10,
    isReserved: true,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("successfully create new order", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const cookie = global.signin();
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    id: ticketId.toString(),
    isReserved: false,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  const existingTicket = await Ticket.findById(ticket.id);
  expect(existingTicket?.isReserved).toEqual(true);
});

it("publishes an event", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const cookie = global.signin();
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    id: ticketId.toString(),
    isReserved: false,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  expect(kafkaConfigWrapper.kafka.producer).toHaveBeenCalled();
});
