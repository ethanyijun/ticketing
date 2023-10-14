import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("has a route handler listening to /api/ticket for get requests", async () => {
  const response = await request(app).get("/api/tickets/1");
  expect(response.status).not.toEqual(404);
});

it("should return 404 if ticket not found", async () => {
  const cookie = global.signin();
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("should return 401 if user not signed in", async () => {
  const res = await request(app).get("/api/tickets/1").send().expect(401);
});

it("should return 200 if signed in user request valid ticket", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 100,
    })
    .expect(201);

  const res = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(res.body.title).toEqual("test");
  expect(res.body.price).toEqual(100);
});
