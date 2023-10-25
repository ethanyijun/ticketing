import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
const ticketId = new mongoose.Types.ObjectId();

it("has a route handler listening to /api/orders/:id for get requests", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app).get(`/api/orders/${ticketId}`);
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user authenticated", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app).get(`/api/orders/${ticketId}`);
  expect(response.status).toEqual(401);
});

it("return status other than 401 if user signed in", async () => {
  const cookie = global.signin();
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .get(`/api/orders/${ticketId}`)
    .set("Cookie", cookie);
  expect(response.status).not.toEqual(401);
});

it("return signed in user order by id", async () => {
  const cookie = global.signin();
  const cookie2 = global.signin();

  const ticket = Ticket.build({
    title: "title1",
    price: 10,
    id: ticketId.toString(),
    isReserved: false,
  });
  const ticket2 = Ticket.build({
    title: "title2",
    price: 10,
    id: ticketId.toString(),
    isReserved: false,
  });
  await ticket.save();
  await ticket2.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie);
  expect(response.body.ticket.title).toEqual("title1");
  expect(response.status).toEqual(200);
});

it("cannot return order created by another user", async () => {
  const cookie = global.signin();
  const cookie2 = global.signin();

  const ticket = Ticket.build({
    title: "title1",
    price: 10,
    id: ticketId.toString(),
    isReserved: false,
  });
  const ticket2 = Ticket.build({
    title: "title2",
    price: 10,
    id: ticketId.toString(),
    isReserved: false,
  });
  await ticket.save();
  await ticket2.save();

  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);
  const response = await request(app)
    .get(`/api/orders/${order2.id}`)
    .set("Cookie", cookie);
  expect(response.status).toEqual(404);
});
