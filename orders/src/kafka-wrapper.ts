import { Kafka } from "kafkajs";

class KafkaWrapper {
  private _kafka?: Kafka;

  get kafka() {
    if (!this._kafka) {
      throw new Error("Cannot access Kafka instance before connecting");
    }

    return this._kafka;
  }

  connect(clientId: string, brokers: string[]) {
    this._kafka = new Kafka({
      clientId,
      brokers,
    });
  }
}

export const kafkaWrapper = new KafkaWrapper();
