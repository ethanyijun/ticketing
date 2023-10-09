import { Kafka } from "kafkajs";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"]): void;
  private client: Kafka;
  protected ackWait = 5 * 1000;

  constructor(client: Kafka) {
    this.client = client;
  }

  async consume() {
    const consumer = this.client.consumer({ groupId: "test-group" });

    try {
      await consumer.connect();
      await consumer.subscribe({ topic: this.subject, fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log(
            `Message received: ${this.subject} / ${this.queueGroupName}: ${message}`
          );

          const value = message.value?.toString();
          this.onMessage(value);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
