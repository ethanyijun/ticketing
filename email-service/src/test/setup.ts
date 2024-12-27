import mongoose from "mongoose";

import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}
jest.mock("../kafka-config-wrapper");

beforeAll(async () => {
  process.env.JWT_KEY = "whatever";
});

beforeEach(async () => {
  jest.clearAllMocks();
});

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test1@test",
  };
  const userToken = jwt.sign(payload, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: userToken });
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
