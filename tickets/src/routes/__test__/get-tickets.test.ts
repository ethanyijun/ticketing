import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  const cookie = global.signin();
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 100,
    })
    .expect(201);
};

it("has a route handler listening to /api/tickets for get requests", async () => {
  const response = await request(app).get("/api/tickets");
  expect(response.status).not.toEqual(404);
  expect(response.body).toEqual([]);
});

it("should return 200 with all tickets", async () => {
  await createTicket();
  await createTicket();
  const res = await request(app).get(`/api/tickets`).send().expect(200);
  expect(res.body.length).toEqual(2);
});
