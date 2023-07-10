import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login.interface';
import { ConfigService } from '@nestjs/config';
import {
  CalculateDeviceStopsDto,
  TelemetryQueryParamsDto,
} from './dto/telemetry-query-params.dto';
import { CalculateAllDevicesStopsDto } from './dto/paginations.dto';
import { UserDevices } from './dto/devices-response.dto';

@Injectable()
export class ThingsboardService {
  private readonly logger = new Logger(ThingsboardService.name);
  private readonly thingsBoardApiUrl = this.configService.get(
    'API_THINGSBOARD_URL',
  );

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<LoginResponse>(this.thingsBoardApiUrl + '/auth/login', {
          username: loginDto.username,
          password: loginDto.password,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            if (error.response.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
    return data;
  }

  async getUserInfo(access_token: string): Promise<any> {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(this.thingsBoardApiUrl + '/auth/user', requestConfig)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            if (error.response.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
    return data;
  }

  async getDeviceTelemetryTimeSeries(
    access_token: string,
    deviceId: string,
    telemetryQueryParamsDto: TelemetryQueryParamsDto,
  ): Promise<any> {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      params: { ...telemetryQueryParamsDto },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(
          this.thingsBoardApiUrl +
            `/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
          requestConfig,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            this.logger.error(error.response.data);
            if (error.response.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
    return data;
  }

  async calculateDeviceStops(
    access_token: string,
    deviceId: string,
    telemetryQueryParamsDto: CalculateDeviceStopsDto,
  ): Promise<any> {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      params: {
        ...telemetryQueryParamsDto,
        limit: 50_000,
        keys: 'engine.ignition.status,position.speed,position.latitude,position.longitude',
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(
          this.thingsBoardApiUrl +
            `/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
          requestConfig,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            this.logger.error(error.response.data);
            if (error.response.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
    try {
      const ignitionStatus = data['engine.ignition.status'];
      const speed = data['position.speed'];
      const latitude = data['position.latitude'];
      const longitude = data['position.longitude'];
      let stops = 0;
      let count = 0;
      let stopt = false;
      const coordinates = [];
      const travel = [];
      if (ignitionStatus && speed) {
        for (let i = 1; i < ignitionStatus.length; i++) {
          const ignitionPrevStatus = ignitionStatus[i - 1]?.value;
          const speedPrevValue = speed[i - 1]?.value;
          if (
            ignitionPrevStatus == 'false' &&
            speedPrevValue == '0' &&
            ignitionStatus[i].value == 'false' &&
            speed[i].value == '0'
          ) {
            count += speed[i - 1].ts - speed[i].ts;
            if (!stopt) {
              if (count >= telemetryQueryParamsDto.stopInMinutes * 60 * 1000) {
                stops++;
                stopt = true;
                coordinates.push({
                  latitude: latitude[i]?.value || null,
                  longitude: longitude[i]?.value || null,
                  timestamp: speed[i].ts,
                  stopTime: count,
                });
              }
            } else {
              coordinates[coordinates.length - 1].stopTime = count;
            }
          } else {
            count = 0;
            stopt = false;
          }
        }
      }
      if (latitude && latitude.length > 0) {
        for (let j = 0; j < latitude.length; j++) {
          travel.push({
            ignitionStatus: ignitionStatus[j].value,
            speed: speed[j].value,
            latitude: latitude[j].value,
            longitude: longitude[j].value,
            timestamp: latitude[j].ts,
          });
        }
      }
      if (travel.length > 0) {
        travel.sort((a, b) => a.timestamp - b.timestamp);
      }
      return { stops, deviceId, coordinates, travel };
    } catch (error) {
      console.log(error);
    }
  }

  async calculateAllDevicesStops(
    access_token: string,
    telemetryQueryParamsDto: CalculateAllDevicesStopsDto,
  ) {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      params: {
        ...telemetryQueryParamsDto,
      },
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<UserDevices>(
          this.thingsBoardApiUrl + `/deviceInfos/all`,
          requestConfig,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            this.logger.error(error.response.data);
            if (error.response.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
    const promises = [];
    for (const device of data.data) {
      const paramsDto: CalculateDeviceStopsDto = {
        startTs: telemetryQueryParamsDto.startTs,
        endTs: telemetryQueryParamsDto.endTs,
        stopInMinutes: telemetryQueryParamsDto.stopInMinutes,
      };
      promises.push(
        this.calculateDeviceStops(access_token, device.id.id, paramsDto),
      );
    }
    const r = await Promise.all(promises);
    const response = [];
    for (let i = 0; i < data.data.length; i++) {
      const element = {
        name: data.data[i].name,
        ...r[i],
      };
      response.push(element);
    }
    return {
      data: response,
      currentPage: telemetryQueryParamsDto.page + 1,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      hasNext: data.hasNext,
    };
  }
}
