import request from "supertest";
import { app } from "../../app";

it("return 201 on successful sign in", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(200);
});

it("return 400 on invalid password input", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test1@test.com", password: "123" })
    .expect(400, {
      errors: [{ message: "Login request failed" }],
    });
});

it("return cookie", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(200);
  console.log(response.get("Set-Cookie"));
  expect(response.get("Set-Cookie")).toBeDefined();
});
