import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

export class FilterBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  eventId?: number;
}
