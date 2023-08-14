import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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
