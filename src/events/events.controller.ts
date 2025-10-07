import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { BasicAuthGuard } from '../auth/basic-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterEventDto } from './dto/filter-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterEventDto,
  ): Promise<{ data: Event[]; total: number; limit: number; offset: number }> {
    return this.eventsService.findAll(paginationDto, filterDto);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() eventData: Partial<Event>): Promise<Event> {
    return this.eventsService.create(eventData);
  }
}