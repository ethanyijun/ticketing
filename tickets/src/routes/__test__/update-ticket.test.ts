import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { kafkaWrapper } from "../../kafka-config-wrapper";

it("has a route handler listening to /api/tickets for update requests", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`).send({});

  expect(response.status).not.toEqual(404);
});

it("return 404 if ticket id not exists", async () => {
  const cookie = global.signin();

  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "test1",
      price: 1,
    });

  expect(response.status).toEqual(404);
});

it("return 401 if user not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`).send({});

  expect(response.status).toEqual(401);
});

it("return 401 if user authenticated but not own the ticket", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 99.95,
    })
    .expect(201);

  const anotherCookie = global.signin();
  const response = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", anotherCookie)
    .send({
      title: "test1",
      price: 99,
    });

  expect(response.status).toEqual(401);
});

it("return 400 if user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 99.95,
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test1",
      price: -1,
    });
  expect(response.status).toEqual(400);
});

it("successfully update the ticket if user authenticated and own the ticket", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 99.95,
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test1",
      price: 1,
    });
  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual("test1");
  expect(response.body.price).toEqual(1);
});

it("publish an event", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 99.95,
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test1",
      price: 1,
    });
  expect(kafkaWrapper.kafka.producer).toHaveBeenCalled();
});
