import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaConsumerModule } from './kafka-consumer/kafka-consumer.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  const consumerApp = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS],
      },
      consumer: {
        groupId: 'ticketcreated-orders',
      },
    },
  });

  await consumerApp.listen();
}
bootstrap();
