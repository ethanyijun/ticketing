import mongoose from "mongoose";
import { app } from "./app";
import { kafkaConfigWrapper } from "./kafka-config-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }
  if (!process.env.KAFKA_BROKERS) {
    throw new Error("KAFKA_BROKERS must be defined");
  }
  try {
    kafkaConfigWrapper.connect(process.env.KAFKA_CLIENT_ID, [
      process.env.KAFKA_BROKERS,
    ]);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};
start();
