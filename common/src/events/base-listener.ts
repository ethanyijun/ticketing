import { Subjects } from "./subjects";
import { KafkaConfig } from "./kafka-config";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract service: string;
  abstract onMessage(data: T["data"]): void;
  protected kafkaConfig: KafkaConfig;

  constructor(kafkaConfig: KafkaConfig) {
    this.kafkaConfig = kafkaConfig;
  }

  async listen() {
    console.log(`Try to listen to topic: ${this.subject}`);
    this.kafkaConfig.consume(
      this.subject,
      this.service,
      async (value: any, topic: any) => {
        console.log(`📨 Receive message: ${value} from topic ${this.subject}`);
        await this.onMessage(value);
      }
    );
  }
}
