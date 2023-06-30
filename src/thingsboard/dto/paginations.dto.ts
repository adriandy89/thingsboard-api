import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum SortProperty {
  createdTime = 'createdTime',
}

export class CalculateAllDevicesStopsDto {
  @ApiProperty({
    type: Number,
    required: false,
    default: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  startTs?: number = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;

  @ApiProperty({
    type: Number,
    required: false,
    default: new Date().getTime(),
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  endTs?: number = new Date().getTime();

  @ApiProperty({
    enum: SortOrder,
    enumName: 'sortOrder',
    description: 'Select sort order',
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: string = SortOrder.ASC;

  @ApiProperty({
    enum: SortProperty,
    enumName: 'sortProperty',
    description: 'Select sort by property',
    required: false,
  })
  @IsEnum(SortProperty)
  @IsOptional()
  sortProperty?: string = SortProperty.createdTime;

  @ApiProperty({
    type: Number,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty({
    type: Number,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  @ApiProperty({
    required: false,
    default: false,
  })
  @IsOptional()
  includeCustomers?: boolean = false;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description:
      'The case insensitive "substring" filter based on the device name.',
  })
  @IsOptional()
  textSearch?: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Stop time in minutes. Default value is 2.',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stopInMinutes?: number = 2;
}
