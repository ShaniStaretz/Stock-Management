import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { Stock, StockSchema } from './portfolio.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
