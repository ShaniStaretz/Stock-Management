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
    // Log the request for debugging
    console.log('Stocks request headers:', req.headers);
    return this.stocksService.getStockList(filter);
  }

  @Get(':symbol')
  async getStockBySymbol(
    @Param('symbol') symbol: string,
    @Req() req: Request,
  ): Promise<IStockProfile & IStockQuote> {
    // Decode the URL-encoded symbol
    const decodedSymbol = decodeURIComponent(symbol);
    // Log the request for debugging
    console.log('Stock details request for symbol:', symbol);
    console.log('Decoded symbol:', decodedSymbol);
    console.log('Request headers:', req.headers);
    return this.stocksService.getStockDetails(decodedSymbol);
  }
}
