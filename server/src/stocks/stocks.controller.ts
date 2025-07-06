import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StockFilterDto } from '../common/dto/stock-filter.dto';
import {
  IStock,
  IStockProfile,
  IStockQuote,
} from '../common/interfaces/stock.interface';
import { Request } from 'express';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getAllStocks(
    @Query() filter: StockFilterDto,
    @Req() req: Request,
  ): Promise<{
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
    @Req() req: Request,
  ): Promise<IStockProfile & IStockQuote> {
    // Decode the URL-encoded symbol
    const decodedSymbol = decodeURIComponent(symbol);
    
    return this.stocksService.getStockDetails(decodedSymbol);
  }
}
