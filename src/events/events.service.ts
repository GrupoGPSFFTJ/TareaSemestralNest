import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async create(eventData: Partial<Event>): Promise<Event> {
    const event = this.eventsRepository.create(eventData);
    return this.eventsRepository.save(event);
  }
}