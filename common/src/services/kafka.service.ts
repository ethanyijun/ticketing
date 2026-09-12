// kafka.service.ts

import { Injectable } from "@nestjs/common";
import { Kafka, KafkaConfig } from "kafkajs";

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  constructor(clientId: string, brokers: string[]) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers,
      // ssl: true,
      // sasl: createMechanism({ region: "ap-southeast-2" }),
    });
  }

  // Method to produce messages to a Kafka topic
  async produceMessage(topic: string, message: string): Promise<void> {
    try {
      const producer = this.kafka.producer({ idempotent: true });
      await producer.connect();
      await producer.send({
        topic: topic,
        messages: [
          {
            key: null,
            value: JSON.stringify(message),
          },
        ],
        acks: -1,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Method to consume messages from a Kafka topic
  async consumeMessages(
    topic: any,
    service: string,
    callback: (message: string, topic: string) => void
  ): Promise<void> {
    try {
      const consumer = this.kafka.consumer({ groupId: `${topic}-${service}` });
      await consumer.connect();
      await consumer.subscribe({ topic: topic, fromBeginning: false });
      await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString();
          callback(JSON.parse(value ?? ""), topic);
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
