// import KafkaConfig from "./config.js";

import KafkaConfig from "./config";
import { kafkaWrapper } from "./events/kafka-wrapper";
import { TicketCreatedPublisher } from "./events/publishers/ticket-created-publisher";

const sendMessageToKafka = async (req: any, res: any) => {
  try {
    // const { message } = req.body;
    // const kafkaConfig = new KafkaConfig();
    // const messages = [{ key: "key1", value: message }];
    // kafkaConfig.produce("test-topic", messages);
    await kafkaWrapper.connect("test-id", ["localhost:9092"]);
    console.log("connected!");
    await new TicketCreatedPublisher(kafkaWrapper.kafka).publish({
      id: "123",
      title: "title",
      price: 20,
      userId: "123",
    });

    res.status(200).json({
      status: "Ok!",
      message: "Message successfully send!",
    });
  } catch (error) {
    console.log(error);
  }
};

const constrollers = { sendMessageToKafka };

export default constrollers;
