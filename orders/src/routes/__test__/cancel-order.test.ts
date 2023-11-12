import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus } from "@ethtickets/common";
import { Order } from "../../models/order";
import { kafkaConfigWrapper } from "../../kafka-config-wrapper";
const ticketId = new mongoose.Types.ObjectId();
const ticketId2 = new mongoose.Types.ObjectId();

it("has a route handler listening to /api/orders/:id for delete requests", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app).delete(`/api/orders/${ticketId}`);
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user authenticated", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app).delete(`/api/orders/${ticketId}`);
  expect(response.status).toEqual(401);
});

it("return status other than 401 if user signed in", async () => {
  const cookie = global.signin();
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .delete(`/api/orders/${ticketId}`)
    .set("Cookie", cookie);
  expect(response.status).not.toEqual(401);
});

it("successfully delete order by id if the order belongs to the user", async () => {
  const cookie = global.signin();
  const cookie2 = global.signin();

  const ticket = Ticket.build({
    title: "title1",
    price: 10,
    isReserved: false,
    id: ticketId.toHexString(),
  });
  const ticket2 = Ticket.build({
    title: "title2",
    price: 10,
    isReserved: false,
    id: ticketId2.toHexString(),
  });
  await ticket.save();
  ticket.version = 1;
  await ticket2.save();
  ticket2.version = 1;

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
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie);
  const existingOrder = await Order.findById(order.id);
  expect(existingOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(response.status).toEqual(204);
});

it("cannot delete order if created by another user", async () => {
  const cookie = global.signin();
  const cookie2 = global.signin();

  const ticket = Ticket.build({
    title: "title1",
    price: 10,
    isReserved: false,
    id: ticketId.toHexString(),
  });
  const ticket2 = Ticket.build({
    title: "title2",
    price: 10,
    isReserved: false,
    id: ticketId2.toHexString(),
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
    .delete(`/api/orders/${order2.id}`)
    .set("Cookie", cookie);
  expect(response.status).toEqual(404);
});

it("publishes a cancel event", async () => {
  const cookie = global.signin();
  const ticket = Ticket.build({
    title: "title",
    price: 10,
    isReserved: false,
    id: ticketId.toHexString(),
  });
  await ticket.save();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  await request(app).delete(`/api/orders/${order.id}`).set("Cookie", cookie);
  expect(kafkaConfigWrapper.kafka.produce).toHaveBeenCalledTimes(2);
});
