import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Event } from '../events/entities/event.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    filterDto: FilterBookingDto,
  ): Promise<{ data: Booking[]; total: number; limit: number; offset: number }> {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const { status, userId, eventId } = filterDto;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (userId) {
        where.userId = userId;
      }

      if (eventId) {
        where.eventId = eventId;
      }

      const [data, total] = await this.bookingsRepository.findAndCount({
        where,
        take: limit,
        skip: offset,
        order: { createdAt: 'DESC' },
      });

      return { data, total, limit, offset };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las reservas');
    }
  }

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