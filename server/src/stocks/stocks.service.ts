import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StocksService {
  private readonly baseUrl = 'https://financialmodelingprep.com/api/v3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getStockList() {
    const apiKey = this.configService.get<string>('FMP_API_KEY');
    const url = `${this.baseUrl}/stock/list?apikey=${apiKey}`;
    //convert Observable to promise
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getStockDetails(symbol: string) {
    console.log(`Fetching details for stock symbol: ${symbol}`);
    let stockDetail = await this.getStockBySymbol(symbol);
    const quote = await this.getQuote(symbol);
    stockDetail = {
      ...stockDetail,
      ...quote,
    };
    return stockDetail;
  }

  async getStockBySymbol(symbol: string) {
    const apiKey = this.configService.get<string>('FMP_API_KEY');
    const url = `${this.baseUrl}/profile/${symbol}?apikey=${apiKey}`;
    const response = await firstValueFrom(this.httpService.get(url));
    if (!response.data || response.data.length === 0) {
      throw new NotFoundException(`Stock with symbol ${symbol} not found`);
    }
    return response.data[0];
  }

  async getQuote(symbol: string) {
    const apiKey = this.configService.get<string>('FMP_API_KEY');
    const url = `${this.baseUrl}/quote/${symbol}?apikey=${apiKey}`;

    const response = await firstValueFrom(this.httpService.get(url));
    return response.data[0]; // return single stock quote
  }
}
