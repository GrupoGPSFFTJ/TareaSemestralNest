import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { BasicAuthGuard } from '../auth/basic-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() bookingData: Partial<Booking>): Promise<Booking> {
    return this.bookingsService.create(bookingData);
  }
}