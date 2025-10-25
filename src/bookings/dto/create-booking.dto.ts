import { IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  eventId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
