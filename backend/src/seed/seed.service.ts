import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Event, EventState } from '../events/entities/event.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    const existingUsers = await this.usersRepository.count();
    
    if (existingUsers === 0) {
      // Hashear contraseñas
      const adminPass = await bcrypt.hash('admin123', 10);
      const orgPass = await bcrypt.hash('org123', 10);
      const userPass = await bcrypt.hash('user123', 10);

      // Crear usuarios
      const admin = await this.usersRepository.save({
        email: 'admin@eventix.com',
        password: adminPass,
        firstName: 'Admin',
        lastName: 'Sistema',
        role: UserRole.ADMIN,
        phone: '+1234567890',
      });

      const organizer1 = await this.usersRepository.save({
        email: 'organizer1@eventix.com',
        password: orgPass,
        firstName: 'Carlos',
        lastName: 'Organizer',
        role: UserRole.ORGANIZER,
        phone: '+1234567891',
      });

      const organizer2 = await this.usersRepository.save({
        email: 'organizer2@eventix.com',
        password: orgPass,
        firstName: 'María',
        lastName: 'Promoter',
        role: UserRole.ORGANIZER,
        phone: '+1234567892',
      });

      const user1 = await this.usersRepository.save({
        email: 'user1@example.com',
        password: userPass,
        firstName: 'Juan',
        lastName: 'Pérez',
        role: UserRole.USER,
        phone: '+1234567893',
      });

      const user2 = await this.usersRepository.save({
        email: 'user2@example.com',
        password: userPass,
        firstName: 'Ana',
        lastName: 'García',
        role: UserRole.USER,
        phone: '+1234567894',
      });

      const user3 = await this.usersRepository.save({
        email: 'user3@example.com',
        password: userPass,
        firstName: 'Pedro',
        lastName: 'Martínez',
        role: UserRole.USER,
      });

      console.log('✅ Usuarios creados');

      // Crear eventos
      const event1 = await this.eventsRepository.save({
        title: 'Conferencia de Tecnología 2025',
        description: 'Evento anual sobre las últimas tendencias en tecnología y desarrollo de software.',
        date: new Date('2025-11-15T09:00:00'),
        location: 'Centro de Convenciones',
        capacity: 200,
        price: 0,
        state: EventState.PUBLISHED,
        organizerId: organizer1.id,
        category: 'charla',
      });

      const event2 = await this.eventsRepository.save({
        title: 'Workshop de React Avanzado',
        description: 'Taller práctico sobre React, Hooks, Context API y mejores prácticas.',
        date: new Date('2025-12-01T14:00:00'),
        location: 'Universidad Central',
        capacity: 50,
        price: 25.00,
        state: EventState.PUBLISHED,
        organizerId: organizer1.id,
        category: 'taller',
      });

      const event3 = await this.eventsRepository.save({
        title: 'Concierto de Jazz en Vivo',
        description: 'Noche de jazz con artistas locales e internacionales.',
        date: new Date('2025-11-30T20:00:00'),
        location: 'Teatro Municipal',
        capacity: 300,
        price: 15.00,
        state: EventState.PUBLISHED,
        organizerId: organizer2.id,
        category: 'concierto',
      });

      const event4 = await this.eventsRepository.save({
        title: 'Hackathon 48 Horas',
        description: 'Competencia de programación intensiva para resolver desafíos reales.',
        date: new Date('2025-12-10T08:00:00'),
        location: 'Campus Universitario',
        capacity: 100,
        price: 10.00,
        state: EventState.PUBLISHED,
        organizerId: organizer2.id,
        category: 'taller',
      });

      const event5 = await this.eventsRepository.save({
        title: 'Evento en Borrador',
        description: 'Este evento aún no está publicado.',
        date: new Date('2025-12-20T10:00:00'),
        location: 'Por definir',
        capacity: 80,
        price: 0,
        state: EventState.DRAFT,
        organizerId: organizer1.id,
        category: 'charla',
      });

      console.log('✅ Eventos creados');

      // Crear reservas
      await this.bookingsRepository.save({
        userId: user1.id,
        eventId: event1.id,
        quantity: 1,
        totalPrice: 0,
        status: BookingStatus.CONFIRMED,
        isPaid: true,
      });

      await this.bookingsRepository.save({
        userId: user2.id,
        eventId: event1.id,
        quantity: 2,
        totalPrice: 0,
        status: BookingStatus.CONFIRMED,
        isPaid: true,
      });

      await this.bookingsRepository.save({
        userId: user1.id,
        eventId: event2.id,
        quantity: 1,
        totalPrice: 25.00,
        status: BookingStatus.PENDING,
        isPaid: false,
      });

      await this.bookingsRepository.save({
        userId: user3.id,
        eventId: event3.id,
        quantity: 2,
        totalPrice: 30.00,
        status: BookingStatus.CONFIRMED,
        isPaid: true,
        paymentId: 'pay_123456789',
      });

      await this.bookingsRepository.save({
        userId: user2.id,
        eventId: event4.id,
        quantity: 1,
        totalPrice: 10.00,
        status: BookingStatus.CONFIRMED,
        isPaid: true,
        paymentId: 'pay_987654321',
      });

      console.log('✅ Reservas creadas');
      console.log('🎉 Base de datos inicializada con datos de prueba');
    }
  }
}