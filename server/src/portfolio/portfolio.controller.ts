import {
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

import { AddStockDto } from './dto/add-stock.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get()
  get(@Query('userId') userId: string) {
    return this.service.getUserPortfolio(userId);
  }

  @Post()
  add(@Body() dto: AddStockDto) {
    return this.service.addStock(dto);
  }

  @Delete()
  remove(@Body() body: { userId: string; symbol: string }) {
    const { userId, symbol } = body;
    console.log('Removing stock:', userId, symbol);
    return this.service.removeStock(userId, symbol);
  }
}
