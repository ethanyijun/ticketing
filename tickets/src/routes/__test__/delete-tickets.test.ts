// New test file for delete tickets
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { kafkaConfigWrapper } from "../../kafka-config-wrapper";
import mongoose from "mongoose";

jest.mock("../../kafka-config-wrapper");

describe("Delete Tickets", () => {
  it("returns a 404 if the ticket does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .delete(`/api/tickets/${id}`)
      .set("Cookie", global.signin())
      .send()
      .expect(404);
  });

  it("returns a 401 if the user is not authenticated", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "test",
        price: 20,
      });

    await request(app)
      .delete(`/api/tickets/${response.body.id}`)
      .send()
      .expect(401);
  });

  it("returns a 403 if the user does not have admin access", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "test",
        price: 20,
        availableTickets: 10,
      })
      .expect(201);

    await request(app)
      .delete(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(403);
  });

  it("deletes the ticket if the user owns it", async () => {
    const cookie = global.signinadmin();

    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "test",
        price: 20,
        availableTickets: 10,
      });

    await request(app)
      .delete(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(200);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send();
    expect(ticketResponse.status).toEqual(404);
  });

  //   it("publishes an event", async () => {
  //     const cookie = global.signin();

  //     const response = await request(app)
  //       .post("/api/tickets")
  //       .set("Cookie", cookie)
  //       .send({
  //         title: "test",
  //         price: 20,
  //       });

  //     await request(app)
  //       .delete(`/api/tickets/${response.body.id}`)
  //       .set("Cookie", cookie)
  //       .send()
  //       .expect(200);

  //     expect(kafkaConfigWrapper.kafka.produce).toHaveBeenCalled();
  //   });
});
