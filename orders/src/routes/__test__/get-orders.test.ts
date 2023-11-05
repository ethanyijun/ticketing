import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
const ticketId = new mongoose.Types.ObjectId();
const ticketId2 = new mongoose.Types.ObjectId();

it("has a route handler listening to /api/orders for get requests", async () => {
  const response = await request(app).get("/api/orders");

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user authenticated", async () => {
  const response = await request(app).get("/api/orders");

  expect(response.status).toEqual(401);
});

it("return status other than 401 if user signed in", async () => {
  const cookie = global.signin();
  const response = await request(app).get("/api/orders").set("Cookie", cookie);
  expect(response.status).not.toEqual(401);
});

it("only return signed in user orders", async () => {
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
    id: ticketId2.toString(),
    isReserved: false,
  });
  await ticket.save();
  await ticket2.save();
  ticket.version = 1;
  ticket2.version = 1;
  await request(app)
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
  const response = await request(app).get("/api/orders").set("Cookie", cookie);
  expect(response.body.length).toEqual(1);
  expect(response.body[0].ticket.title).toEqual("title1");
  expect(response.status).toEqual(200);
});
