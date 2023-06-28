import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
} from '@nestjs/common';
import { ThingsboardService } from './thingsboard.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login.interface';

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
}
