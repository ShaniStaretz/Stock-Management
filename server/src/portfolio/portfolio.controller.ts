import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

import { AddStockDto } from '../shared/dto/add-stock.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post()
  add(@Body() dto: AddStockDto) {
    return this.service.addStock(dto);
  }
}
