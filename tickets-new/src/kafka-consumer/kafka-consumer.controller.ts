import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaConsumerController {
  constructor() {}

  @EventPattern('ticketcreated')
  handleGetUser(@Payload() data: any) {
    console.log('received haha: ', data);
    return;
  }
}
