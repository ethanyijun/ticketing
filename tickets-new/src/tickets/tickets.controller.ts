import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketDto } from './dto/ticket.dto';
import { Ticket } from './schemas/ticket.schema';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('api')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('new-tickets')
  async create(@Body() ticketDto: TicketDto) {
    try {
      const createdTicket = await this.ticketsService.createTicket(ticketDto);
      return { message: 'Ticket created successfully!', data: createdTicket };
    } catch (error) {
      throw new HttpException(
        'Failed to create ticket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tickets')
  async getTickets(): Promise<Ticket[]> {
    return this.ticketsService.getTickets();
  }

  @Get('tickets/:id')
  async getTicketById(@Param('id') id: string) {
    const ticket = await this.ticketsService.getTicketById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }
  // This works!!!
  @EventPattern('ticketcreated')
  handleTicketCreated(@Payload() data: any) {
    console.log('received form: ', data);
    return;
  }
}
