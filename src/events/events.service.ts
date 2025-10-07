import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Event } from './entities/event.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterEventDto } from './dto/filter-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    filterDto: FilterEventDto,
  ): Promise<{ data: Event[]; total: number; limit: number; offset: number }> {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const { state, search, location, dateFrom, dateTo } = filterDto;

      const where: any = {};

      if (state) {
        where.state = state;
      }

      if (location) {
        where.location = Like(`%${location}%`);
      }

      if (search) {
        where.title = Like(`%${search}%`);
      }

      if (dateFrom && dateTo) {
        where.date = Between(new Date(dateFrom), new Date(dateTo));
      } else if (dateFrom) {
        where.date = Between(new Date(dateFrom), new Date('2100-12-31'));
      } else if (dateTo) {
        where.date = Between(new Date('1970-01-01'), new Date(dateTo));
      }

      const [data, total] = await this.eventsRepository.findAndCount({
        where,
        take: limit,
        skip: offset,
        order: { date: 'ASC', createdAt: 'DESC' },
      });

      return { data, total, limit, offset };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los eventos');
    }
  }

  async create(eventData: Partial<Event>): Promise<Event> {
    try {
      const event = this.eventsRepository.create(eventData);
      return await this.eventsRepository.save(event);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el evento');
    }
  }
}