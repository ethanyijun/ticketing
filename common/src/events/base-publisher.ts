import { KafkaConfig } from "./kafka-config";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected kafkaConfig: KafkaConfig;

  constructor(kafkaConfig: KafkaConfig) {
    this.kafkaConfig = kafkaConfig;
  }
  async publish(data: T["data"]): Promise<void> {
    console.log("Try to publish Event to subject", this.subject);
    try {
      await this.kafkaConfig.produce(this.subject, data);

      console.log(
        `Event published, topic: ${this.subject}, message: ${JSON.stringify(
          data
        )}`
      );
    } catch (error) {
      console.error(error);
    }
  }
}
