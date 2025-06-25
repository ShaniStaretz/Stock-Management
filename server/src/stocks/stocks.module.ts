import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { StocksController } from './stocks.controller'
import { StocksService } from './stocks.service'


@Module({
  imports: [HttpModule,ConfigModule],
  controllers: [StocksController],
  providers: [StocksService]
})
export class StocksModule {}