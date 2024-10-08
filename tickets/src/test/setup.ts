import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
  var signinadmin: () => string[];
}
jest.mock("../kafka-config-wrapper");

let mongo: MongoMemoryServer | undefined;
beforeAll(async () => {
  process.env.JWT_KEY = "whatever";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  const mongooseOpts = {};
  await mongoose.connect(mongoUri, mongooseOpts);
});

beforeEach(async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test1@test",
    role: "user",
  };
  const userToken = jwt.sign(payload, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: userToken });
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};

global.signinadmin = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test1@test",
    role: "admin",
  };
  const userToken = jwt.sign(payload, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: userToken });
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
