import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-completed-publisher";
import { kafkaConfigWrapper } from "../kafka-config-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    "I want to publish an expiration:complete event for orderId ",
    job.data.orderId
  );
  await new ExpirationCompletedPublisher(kafkaConfigWrapper.kafka).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
