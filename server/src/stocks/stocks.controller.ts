import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StockFilterDto } from '../common/dto/stock-filter.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  IStock,
  IStockProfile,
  IStockQuote,
} from '../common/interfaces/stock.interface';
import { PaginationResult } from '../common/utils/pagination.util';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getAllStocks(
    @Query() filter: StockFilterDto,
    @Query() pagination: PaginationDto,
  ): Promise<PaginationResult<IStock>> {
    return this.stocksService.getStockList(filter, pagination);
  }

  @Get(':symbol')
  async getStockBySymbol(
    @Param('symbol') symbol: string,
  ): Promise<IStockProfile & IStockQuote> {
    return this.stocksService.getStockDetails(symbol);
  }
}
