import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer | undefined;
beforeAll(async () => {
  process.env.JWT_KEY = "whatever";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  const mongooseOpts = {};
  await mongoose.connect(mongoUri, mongooseOpts);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  const deleteCollections = collections.map((collection) =>
    collection.deleteMany({})
  );
  Promise.all(deleteCollections);
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test1@test.com", password: "12345678" })
    .expect(201);
  return response.get("Set-Cookie");
};
