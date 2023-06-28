import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login.interface';
import { ConfigService } from '@nestjs/config';

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
}
