import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { BasicAuthGuard } from '../auth/basic-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBookingDto,
  ): Promise<{ data: Booking[]; total: number; limit: number; offset: number }> {
    return this.bookingsService.findAll(paginationDto, filterDto);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() bookingData: Partial<Booking>): Promise<Booking> {
    return this.bookingsService.create(bookingData);
  }
}