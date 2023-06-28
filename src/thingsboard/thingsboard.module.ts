import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ThingsboardController } from './thingsboard.controller';
import { ThingsboardService } from './thingsboard.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ThingsboardController],
  providers: [ThingsboardService],
})
export class ThingsboardModule {}
