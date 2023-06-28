import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ThingsboardModule } from './thingsboard/thingsboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    HttpModule,
    ThingsboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
