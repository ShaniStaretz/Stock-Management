import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getAllStocks() {
    return this.stocksService.getStockList();
  }
  
   @Get(':symbol')
  async getStockBySymbol(@Param('symbol') symbol: string) {
    return this.stocksService.getStockDetails(symbol);
  }
}
