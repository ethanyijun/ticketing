import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), TicketsModule],
})
export class AppModule {}
