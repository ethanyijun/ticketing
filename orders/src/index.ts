import mongoose from "mongoose";
import { app } from "./app";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { kafkaConfigWrapper } from "./kafka-config-wrapper";
import { ExpirationCompletedListener } from "./events/listeners/expiration-completed-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  console.log("Start order service......");

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
    kafkaConfigWrapper.connect(
      process.env.KAFKA_CLIENT_ID,
      process.env.KAFKA_BROKERS.split(",")
    );
    await new TicketCreatedListener(kafkaConfigWrapper.kafka).listen();
    await new TicketUpdatedListener(kafkaConfigWrapper.kafka).listen();
    await new PaymentCreatedListener(kafkaConfigWrapper.kafka).listen();
    await new ExpirationCompletedListener(kafkaConfigWrapper.kafka).listen();
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
