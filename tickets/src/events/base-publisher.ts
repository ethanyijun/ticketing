// import { Stan } from 'node-nats-streaming';
import { Kafka } from "kafkajs";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Kafka;

  constructor(client: Kafka) {
    this.client = client;
  }

  async publish(data: T["data"]): Promise<void> {
    const producer = this.client.producer();
    try {
      await producer.connect();
      await producer.send({
        topic: this.subject,
        messages: [
          {
            key: null,
            value: JSON.stringify(data),
          },
        ],
      });
    } catch (error) {
      console.error(error);
    } finally {
      await producer.disconnect();
    }
  }
}
