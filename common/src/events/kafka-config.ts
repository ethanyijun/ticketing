import { Kafka } from "kafkajs";

export class KafkaConfig {
  kafka: Kafka;
  constructor(clientId: string, brokers: string[]) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers,
      // This is for EKS
      // ssl: true,
      // sasl: createMechanism({ region: "ap-southeast-2" }),
    });
  }

  async produce(topic: any, messages: any) {
    try {
      const producer = this.kafka.producer({
        idempotent: process.env.NODE_ENV === "production",
        retry: { retries: 10, initialRetryTime: 1000, factor: 0.3 },
      });
      await producer.connect();
      await producer.send({
        topic: topic,
        messages: [
          {
            // Use ticketId as key for partitioning if present
            key: messages.id || null,
            value: JSON.stringify(messages),
          },
        ],
        acks: -1,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async consume(
    topic: string,
    service: string,
    callback: (message: any, topic: string) => Promise<void>
  ) {
    try {
      const consumer = this.kafka.consumer({ groupId: `${topic}-${service}` });
      await consumer.connect();
      await consumer.subscribe({ topic: topic, fromBeginning: false });
      await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString();
          await callback(JSON.parse(value ?? ""), topic);
          console.log("message.offset: ", message.offset);

          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);

          console.log("commitOffsets!");
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
