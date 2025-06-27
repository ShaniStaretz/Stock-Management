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

  // Fetch stock list with optional filters for symbol and name
  async getStockList(
    filter: any = {},
    pageSize: number = 10,
    page: number = 1,
  ) {
    const { symbol, exchangeShortName } = filter;
    const apiKey = this.configService.get<string>('FMP_API_KEY');
    let url = '';
    if (exchangeShortName && !symbol) {
      throw new HttpException(
        'Symbol is required when filtering by exchangeShortName',
        400,
      );
    }
    if (!symbol && !exchangeShortName) {
      url = `${this.baseUrl}/stock/list?apikey=${apiKey}`;
    } else {
      url = `${this.baseUrl}/search?apikey=${apiKey}`;

      const queryParams: string[] = [];
      if (symbol) queryParams.push(`query=${encodeURIComponent(symbol)}`);
      if (exchangeShortName) queryParams.push(`exchange=${exchangeShortName}`);

      if (queryParams.length > 0) {
        url += '&' + queryParams.join('&');
      }
    }
    //convert Observable to promise
    console.log(`Fetching stock list with URL: ${url}`);
    const response = await firstValueFrom(this.httpService.get(url));
    let data = response.data;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = Array.isArray(data) ? data.slice(start, end) : [];
    return {
      data: paginatedData,
      total: Array.isArray(data) ? data.length : 0,
      page,
      pageSize,
    };
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
