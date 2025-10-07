import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export enum EventState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELED = 'canceled',
}

export class FilterEventDto {
  @IsOptional()
  @IsEnum(EventState)
  state?: EventState;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
