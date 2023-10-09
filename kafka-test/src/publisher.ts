// const { Kafka } = require("kafkajs");

// import bodyParser from "body-parser";
// import express from "express";
// import constrollers from "./controller";
// import KafkaConfig from "./config";
// import KafkaConfig from "./config";

// const kafka = new Kafka({
//   clientId: "my-app",
//   brokers: ["localhost:9092"],
// });

// const producer = kafka.producer();

// var sendMessage = async () => {
//   await producer.connect();
//   await producer.send({
//     topic: "topic-name",
//     messages: [
//       { key: "key1", value: "hello world" },
//       { key: "key2", value: "hey hey!" },
//     ],
//   });
//   await producer.disconnect();
// };

// sendMessage();

//##############
// import KafkaConfig from "./config";
// import { kafkaWrapper } from "./events/kafka-wrapper";
// import { TicketCreatedPublisher } from "./events/publishers/ticket-created-publisher";

// console.clear();

// async function run() {
//   try {
//     await kafkaWrapper.connect("test-id", ["localhost:9092"]);
//     console.log("connected!");
//     await new TicketCreatedPublisher(kafkaWrapper.kafka).publish({
//       id: "123",
//       title: "title",
//       price: 20,
//       userId: "123",
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }
// const kafkaConfig = new KafkaConfig();

// run();
// kafkaConfig.consume("ticket-created", (value: any) => {
//   console.log("📨 Receive message: ", value);
// });

// const stan = nats.connect("ticketing", "abc", {
//   url: "http://localhost:4222",
// });

// stan.on("connect", async () => {
//   console.log("Publisher connected to NATS");

//   const publisher = new TicketCreatedPublisher(stan);
//   try {
//     await publisher.publish({
//       id: "123",
//       title: "concert",
//       price: 20,
//     });
//   } catch (err) {
//     console.error(err);
//   }

// const data = JSON.stringify({
//   id: '123',
//   title: 'concert',
//   price: '$20',
// });

// stan.publish('TicketCreated', data, () => {
//   console.log('Event published');
// });
// });
import express from "express";
import bodyParser from "body-parser";
import constrollers from "./controller";
import KafkaConfig from "./config";
// import constrollers from "./controller.js";
// import KafkaConfig from "./config.js";

const app = express();
const jsonParser = bodyParser.json();

app.post("/api/send", jsonParser, constrollers.sendMessageToKafka);

// consume from topic "test-topic"
const kafkaConfig = new KafkaConfig();
kafkaConfig.consume("ticket-created", (value: any) => {
  console.log("📨 Receive message: ", value);
});

// const client = new kafka.KafkaClient({
//   kafkaHost: "localhost:9092",
// });
// const producer = new kafka.Producer(client);
// producer.on("ready", async () => {
//   console.log("ready!!");
//   app.post("/api/send", async(req, res) => {
//     producer.send([{
//       topic:
//     }])
//   });

// });

app.listen(8080, () => {
  console.log(`Server is running on port 8080.`);
});
