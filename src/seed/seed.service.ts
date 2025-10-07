import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async onModuleInit() {
    await this.seedEvents();
  }

  private async seedEvents() {
    const existingEvents = await this.eventsRepository.count();
    
    if (existingEvents === 0) {
      const events = [
        {
          title: 'Conferencia de Tecnología 2024',
          description: 'La mayor conferencia de tecnología del año',
          date: new Date('2024-03-15T10:00:00Z'),
          location: 'Centro de Convenciones',
          capacity: 100,
          state: 'published',
          organizerId: 1,
        },
        {
          title: 'Taller de NestJS',
          description: 'Aprende NestJS desde cero',
          date: new Date('2024-03-20T14:00:00Z'),
          location: 'Aula Virtual',
          capacity: 50,
          state: 'published',
          organizerId: 1,
        },
        {
          title: 'Concierto de Rock',
          description: 'Bandas locales en vivo',
          date: new Date('2024-04-05T20:00:00Z'),
          location: 'Parque Central',
          capacity: 200,
          state: 'published',
          organizerId: 2,
        },
      ];

      await this.eventsRepository.save(events);
      console.log('Datos de prueba insertados correctamente');
    }
  }
}