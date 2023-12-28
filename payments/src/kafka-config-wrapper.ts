import { KafkaConfig } from "@ethtickets/common";

class KafkaConfigWrapper {
  private _kafka?: KafkaConfig;

  get kafka() {
    if (!this._kafka) {
      throw new Error("Cannot access Kafka instance before connecting");
    }

    return this._kafka;
  }

  connect(clientId: string, brokers: string[]) {
    this._kafka = new KafkaConfig(clientId, brokers);
    console.log("Connected to Kafka!!!");
  }
}

export const kafkaConfigWrapper = new KafkaConfigWrapper();
