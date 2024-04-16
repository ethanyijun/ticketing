import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema()
export class Ticket {
  @Prop()
  title: string;
  @Prop()
  price: number;
  @Prop()
  userId: string;
  @Prop()
  version: number;
  @Prop()
  orderId: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
