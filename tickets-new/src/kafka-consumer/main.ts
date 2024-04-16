// import { NestFactory } from '@nestjs/core';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { AppModule } from 'src/app.module';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.KAFKA,
//       options: {
//         client: {
//           brokers: [process.env.KAFKA_BROKERS],
//         },
//         consumer: {
//           groupId: 'ticketcreated-orders',
//         },
//       },
//     },
//   );
//   console.log('kafka consumer app!');
//   await app.listen();
// }
// bootstrap();
