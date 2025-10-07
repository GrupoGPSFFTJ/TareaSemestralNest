import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { BasicAuthGuard } from '../auth/basic-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() eventData: Partial<Event>): Promise<Event> {
    return this.eventsService.create(eventData);
  }
}