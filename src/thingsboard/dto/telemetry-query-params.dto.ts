import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class TelemetryQueryParamsDto {
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
    type: String,
    required: true,
    description:
      'A string value representing the comma-separated list of telemetry keys.',
  })
  @IsNotEmpty()
  keys: string;
}

export class CalculateDeviceStopsDto extends PartialType(
  OmitType(TelemetryQueryParamsDto, ['keys']),
) {
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
