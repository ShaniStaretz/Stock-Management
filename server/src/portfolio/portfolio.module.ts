import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioEntry, PortfolioEntrySchema } from '../schemas/portfolio.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PortfolioEntry.name, schema: PortfolioEntrySchema }])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
