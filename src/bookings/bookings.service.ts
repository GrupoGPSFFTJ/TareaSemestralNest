import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Event, EventState } from '../events/entities/event.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { eventId, userId, quantity = 1 } = createBookingDto;

    // Verificar que el evento existe
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['bookings'],
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${eventId} no encontrado`);
    }

    // Verificar que el evento está publicado
    if (event.state !== EventState.PUBLISHED) {
      throw new BadRequestException('Solo se pueden hacer reservas en eventos publicados');
    }

    // Verificar que el evento no ha pasado
    if (new Date(event.date) < new Date()) {
      throw new BadRequestException('No se pueden hacer reservas para eventos pasados');
    }

    // Calcular reservas actuales confirmadas
    const currentBookings = event.bookings
      .filter((b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING)
      .reduce((sum, b) => sum + b.quantity, 0);

    // Verificar capacidad disponible
    const availableCapacity = event.capacity - currentBookings;
    if (quantity > availableCapacity) {
      throw new ConflictException(
        `No hay suficiente capacidad. Disponibles: ${availableCapacity}, Solicitadas: ${quantity}`,
      );
    }

    // Verificar que el usuario no tenga ya una reserva activa para este evento
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        userId,
        eventId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existingBooking) {
      throw new ConflictException('Ya tienes una reserva confirmada para este evento');
    }

    // Calcular precio total
    const totalPrice = event.price * quantity;

    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      quantity,
      totalPrice,
      status: event.price > 0 ? BookingStatus.PENDING : BookingStatus.CONFIRMED,
      isPaid: event.price === 0, // Si es gratis, marcar como pagado
    });

    return await this.bookingsRepository.save(booking);
  }

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
        relations: ['user', 'event'],
      });

      return { data, total, limit, offset };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las reservas');
    }
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!booking) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    
    Object.assign(booking, updateBookingDto);
    return await this.bookingsRepository.save(booking);
  }

  async cancel(id: number): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    // Verificar que el evento no haya pasado
    if (new Date(booking.event.date) < new Date()) {
      throw new BadRequestException('No se pueden cancelar reservas de eventos pasados');
    }

    booking.status = BookingStatus.CANCELED;
    return await this.bookingsRepository.save(booking);
  }

  async confirmPayment(id: number, paymentId: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.isPaid) {
      throw new BadRequestException('La reserva ya está pagada');
    }

    booking.isPaid = true;
    booking.paymentId = paymentId;
    booking.status = BookingStatus.CONFIRMED;

    return await this.bookingsRepository.save(booking);
  }

  async getAttendeesByEvent(eventId: number): Promise<Booking[]> {
    const bookings = await this.bookingsRepository.find({
      where: {
        eventId,
        status: BookingStatus.CONFIRMED,
      },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    return bookings;
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }
}