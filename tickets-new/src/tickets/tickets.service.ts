import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TicketDto } from './dto/ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './schemas/ticket.schema';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TicketsService {
  constructor(
    @Inject('HERO_SERVICE') private client: ClientKafka,
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
  ) {}

  async getTickets(): Promise<any[]> {
    return this.ticketModel.find().exec();
  }

  async createTicket(ticketDto: TicketDto): Promise<void> {
    const createdTicket = new this.ticketModel(ticketDto);
    await createdTicket.save();
    this.client.emit(
      'ticketcreated',
      JSON.stringify({
        id: createdTicket.id,
        title: createdTicket.title,
        price: createdTicket.price,
        userId: createdTicket.userId,
        version: createdTicket.version,
      }),
    );
    console.log('message published!!');
  }

  async getTicketById(id: string): Promise<any> {
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }
}
