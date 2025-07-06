import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StockFilterDto } from '../common/dto/stock-filter.dto';
import {
  IStock,
  IStockProfile,
  IStockQuote,
} from '../common/interfaces/stock.interface';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getAllStocks(@Query() filter: StockFilterDto): Promise<{
    data: IStock[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    return this.stocksService.getStockList(filter);
  }

  @Get(':symbol')
  async getStockBySymbol(
    @Param('symbol') symbol: string,
  ): Promise<IStockProfile & IStockQuote> {
    return this.stocksService.getStockDetails(symbol);
  }
}
