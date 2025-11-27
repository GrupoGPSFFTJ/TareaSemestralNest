import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Event, EventState } from './entities/event.entity';
import { BookingStatus } from '../bookings/entities/booking.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      // Validar que la fecha sea futura
      const eventDate = new Date(createEventDto.date);
      if (eventDate < new Date()) {
        throw new BadRequestException('La fecha del evento debe ser futura');
      }

      const event = this.eventsRepository.create(createEventDto);
      return await this.eventsRepository.save(event);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el evento');
    }
  }

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
        relations: ['organizer', 'bookings'],
      });

      return { data, total, limit, offset };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los eventos');
    }
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'bookings', 'bookings.user'],
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Validar que si cambia la fecha, sea futura
    if (updateEventDto.date) {
      const eventDate = new Date(updateEventDto.date);
      if (eventDate < new Date()) {
        throw new BadRequestException('La fecha del evento debe ser futura');
      }
    }

    // No permitir reducir capacidad si hay reservas
    if (updateEventDto.capacity && updateEventDto.capacity < event.capacity) {
      const bookingsCount = await this.getBookingsCount(id);
      if (updateEventDto.capacity < bookingsCount) {
        throw new BadRequestException(
          `No se puede reducir la capacidad a ${updateEventDto.capacity}. Ya hay ${bookingsCount} reservas confirmadas`,
        );
      }
    }

    Object.assign(event, updateEventDto);
    return await this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }

  async cancelEvent(id: number): Promise<Event> {
    const event = await this.findOne(id);
    event.state = EventState.CANCELED;
    return await this.eventsRepository.save(event);
  }

  async publishEvent(id: number): Promise<Event> {
    const event = await this.findOne(id);
    
    if (event.state !== EventState.DRAFT) {
      throw new BadRequestException('Solo eventos en borrador pueden ser publicados');
    }

    event.state = EventState.PUBLISHED;
    return await this.eventsRepository.save(event);
  }

  async getAvailableCapacity(id: number): Promise<number> {
    const event = await this.findOne(id);
    const bookingsCount = await this.getBookingsCount(id);
    return event.capacity - bookingsCount;
  }

  async getBookingsCount(eventId: number): Promise<number> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['bookings'],
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${eventId} no encontrado`);
    }

    // Contar solo reservas confirmadas
    return event.bookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'pending',
    ).reduce((sum, booking) => sum + booking.quantity, 0);
  }

  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return await this.eventsRepository.find({
      where: { organizerId },
      relations: ['bookings'],
      order: { date: 'ASC' },
    });
  }

  async getEventStats(eventId: number) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['bookings'],
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${eventId} no encontrado`);
    }

    // Filtrar solo reservas confirmadas
    const confirmedBookings = event.bookings.filter(
      (booking) => booking.status === BookingStatus.CONFIRMED,
    );

    // Calcular estadísticas
    const totalTicketsSold = confirmedBookings.reduce(
      (sum, booking) => sum + booking.quantity,
      0,
    );

    const totalRevenue = confirmedBookings.reduce(
      (sum, booking) => sum + Number(booking.totalPrice),
      0,
    );

    const availableCapacity = event.capacity - totalTicketsSold;
    const occupancyRate = ((totalTicketsSold / event.capacity) * 100).toFixed(2);

    return {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      capacity: event.capacity,
      ticketsSold: totalTicketsSold,
      availableTickets: availableCapacity,
      occupancyRate: `${occupancyRate}%`,
      totalRevenue: totalRevenue,
      pricePerTicket: event.price,
      totalBookings: confirmedBookings.length,
      status: event.state,
    };
  }
}