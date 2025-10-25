import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum EventState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  location: string;

  @Column()
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number; // Precio de la entrada (0 = gratis)

  @Column({
    type: 'simple-enum',
    enum: EventState,
    default: EventState.DRAFT,
  })
  state: EventState;

  @Column()
  organizerId: number;

  @ManyToOne(() => User, (user) => user.organizedEvents, { eager: true })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @Column({ nullable: true })
  category: string; // charla, taller, concierto, etc.

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}