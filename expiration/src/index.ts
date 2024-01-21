import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { kafkaConfigWrapper } from "./kafka-config-wrapper";

const start = async () => {
  console.log("Start expiration service...");
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
    await new OrderCreatedListener(kafkaConfigWrapper.kafka).listen();
  } catch (error) {
    console.error(error);
  }
};
start();
