import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Response } from 'express';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getAllStocks(
    @Res() res: Response,
    @Query('symbol') symbol?: string,
    @Query('exchangeShortName') exchangeShortName?: string,
  ) {
    try {
      let filter: any = {};
      if (symbol) filter.symbol = symbol;
      if (exchangeShortName) filter.exchangeShortName = exchangeShortName;
      const stocks = await this.stocksService.getStockList(filter);
      return res.status(200).json(stocks);
    } catch (error) {
      console.error('Error fetching stock list:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Get(':symbol')
  async getStockBySymbol(
    @Param('symbol') symbol: string,
    @Res() res: Response,
  ) {
    try {
      if (!symbol) {
        throw { status: 400, message: 'Stock symbol is required' };
      }
      const stockDetails = await this.stocksService.getStockDetails(symbol);
      return res.status(200).json(stockDetails);
    } catch (error) {
      console.error('Error fetching stock details:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }
}
