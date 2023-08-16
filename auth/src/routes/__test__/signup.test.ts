import request from "supertest";
import { app } from "../../app";

it("return 201 on successful sign up", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(201);
});

it("return 400 on invalid email input", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test.com", password: "12345678" })
    .expect(400, {
      errors: [{ message: "Email must be valid", field: "email" }],
    });
});

it("return 400 on invalid password input", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@123.com", password: "123" })
    .expect(400, {
      errors: [
        {
          message: "Password must be between 4 and 20 characters",
          field: "password",
        },
      ],
    });
});

it("return 400 on invalid password and invalid email input", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test.com", password: "123" })
    .expect(400, {
      errors: [
        { message: "Email must be valid", field: "email" },
        {
          message: "Password must be between 4 and 20 characters",
          field: "password",
        },
      ],
    });

  await request(app)
    .post("/api/users/signup")
    .send({})
    .expect(400, {
      errors: [
        { message: "Email must be valid", field: "email" },
        {
          message: "Password must be between 4 and 20 characters",
          field: "password",
        },
      ],
    });
});

it("return 400 on signing up existing email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(400);
});

it("return cookie", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
