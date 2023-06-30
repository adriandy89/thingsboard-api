import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ThingsboardService } from './thingsboard.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login.interface';
import {
  CalculateDeviceStopsDto,
  TelemetryQueryParamsDto,
} from './dto/telemetry-query-params.dto';
import { CalculateAllDevicesStopsDto } from './dto/paginations.dto';

@ApiTags('thingsboard')
@Controller('thingsboard')
export class ThingsboardController {
  constructor(private readonly thingsboardService: ThingsboardService) {}

  @ApiBody({
    schema: {
      example: {
        username: 'admin@gmail.com',
        password: 'admin',
      },
    },
  })
  @Post('login')
  async postHello(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.thingsboardService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('user/info')
  async getUserInfo(@Headers() headers): Promise<any> {
    const authorizationHeader = headers.authorization;
    if (!authorizationHeader || authorizationHeader.trim() === '') {
      throw new BadRequestException('Authorization header is required');
    }
    const jwt = authorizationHeader?.split(' ')[1];
    return this.thingsboardService.getUserInfo(jwt);
  }

  @ApiBearerAuth()
  @Get('/DEVICE/:deviceId/telemetry/values/timeseries')
  async getDeviceTelemetryTimeSeries(
    @Headers() headers,
    @Param('deviceId') deviceId: string,
    @Query() queryParams: TelemetryQueryParamsDto,
  ): Promise<any> {
    console.log(queryParams);
    const authorizationHeader = headers.authorization;
    if (!authorizationHeader || authorizationHeader.trim() === '') {
      throw new BadRequestException('Authorization header is required');
    }
    const jwt = authorizationHeader?.split(' ')[1];
    return this.thingsboardService.getDeviceTelemetryTimeSeries(
      jwt,
      deviceId,
      queryParams,
    );
  }

  @ApiBearerAuth()
  @Get('/DEVICE/:deviceId/telemetry/calculateDeviceStops')
  async calculateDeviceStops(
    @Headers() headers,
    @Param('deviceId') deviceId: string,
    @Query() queryParams: CalculateDeviceStopsDto,
  ): Promise<any> {
    console.log(queryParams);
    const authorizationHeader = headers.authorization;
    if (!authorizationHeader || authorizationHeader.trim() === '') {
      throw new BadRequestException('Authorization header is required');
    }
    const jwt = authorizationHeader?.split(' ')[1];
    return this.thingsboardService.calculateDeviceStops(
      jwt,
      deviceId,
      queryParams,
    );
  }

  @ApiBearerAuth()
  @Get('/deviceInfos/all/calculateDeviceStops')
  async calculateAllDevicesStops(
    @Headers() headers,
    @Query() queryParams: CalculateAllDevicesStopsDto,
  ): Promise<any> {
    console.log(queryParams);
    const authorizationHeader = headers.authorization;
    if (!authorizationHeader || authorizationHeader.trim() === '') {
      throw new BadRequestException('Authorization header is required');
    }
    const jwt = authorizationHeader?.split(' ')[1];
    return this.thingsboardService.calculateAllDevicesStops(jwt, queryParams);
  }
}
