import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    const event = await this.eventsRepository.findOne({
      where: { id: bookingData.eventId }
    });

    if (!event) {
      throw new ConflictException('Event not found');
    }

    // Verificar capacidad
    const currentBookings = await this.bookingsRepository.count({
      where: { eventId: bookingData.eventId }
    });

    if (currentBookings >= event.capacity) {
      throw new ConflictException('Event is fully booked');
    }

    const booking = this.bookingsRepository.create(bookingData);
    return this.bookingsRepository.save(booking);
  }
}