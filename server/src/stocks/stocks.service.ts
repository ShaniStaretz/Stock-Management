import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  IStock,
  IStockQuote,
  IStockProfile,
} from '../common/interfaces/stock.interface';
import {
  StockNotFoundException,
  InvalidStockFilterException,
} from '../common/exceptions/custom-exceptions';
import { StockFilterDto } from '../common/dto/stock-filter.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  paginateArray,
  PaginationResult,
} from '../common/utils/pagination.util';

@Injectable()
export class StocksService {
  private readonly baseUrl = 'https://financialmodelingprep.com/api/v3';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('FMP_API_KEY') || '';
    if (!this.apiKey) {
      throw new Error('FMP_API_KEY is not configured');
    }
  }

  async getStockList(
    filter: StockFilterDto,
    pagination: PaginationDto,
  ): Promise<PaginationResult<IStock>> {
    const { symbol, exchangeShortName } = filter;
    const { page = 1, pageSize = 10 } = pagination;

    this.validateStockFilter(filter);

    const url = this.buildStockListUrl(filter);
    const response = await this.makeApiRequest(url);

    return paginateArray(response.data, { page, pageSize });
  }

  async getStockDetails(symbol: string): Promise<IStockProfile & IStockQuote> {
    if (!symbol) {
      throw new InvalidStockFilterException('Stock symbol is required');
    }

    const [profile, quote] = await Promise.all([
      this.getStockProfile(symbol),
      this.getStockQuote(symbol),
    ]);

    return { ...profile, ...quote };
  }

  async getStockProfile(symbol: string): Promise<IStockProfile> {
    const url = `${this.baseUrl}/profile/${symbol}?apikey=${this.apiKey}`;
    const response = await this.makeApiRequest(url);

    if (!response.data || response.data.length === 0) {
      throw new StockNotFoundException(symbol);
    }

    return response.data[0];
  }

  async getStockQuote(symbol: string): Promise<IStockQuote> {
    const url = `${this.baseUrl}/quote/${symbol}?apikey=${this.apiKey}`;
    const response = await this.makeApiRequest(url);

    if (!response.data || response.data.length === 0) {
      throw new StockNotFoundException(symbol);
    }

    return response.data[0];
  }

  private validateStockFilter(filter: StockFilterDto): void {
    const { symbol, exchangeShortName } = filter;

    if (exchangeShortName && !symbol) {
      throw new InvalidStockFilterException(
        'Symbol is required when filtering by exchangeShortName',
      );
    }
  }

  private buildStockListUrl(filter: StockFilterDto): string {
    const { symbol, exchangeShortName } = filter;

    if (!symbol && !exchangeShortName) {
      return `${this.baseUrl}/stock/list?apikey=${this.apiKey}`;
    }

    const url = `${this.baseUrl}/search?apikey=${this.apiKey}`;
    const queryParams: string[] = [];

    if (symbol) {
      queryParams.push(`query=${encodeURIComponent(symbol)}`);
    }
    if (exchangeShortName) {
      queryParams.push(`exchange=${exchangeShortName}`);
    }

    return queryParams.length > 0 ? `${url}&${queryParams.join('&')}` : url;
  }

  private async makeApiRequest(url: string) {
    try {
      return await firstValueFrom(this.httpService.get(url));
    } catch (error) {
      if (error.response?.status === 404) {
        throw new StockNotFoundException('Stock not found');
      }
      throw new HttpException(
        'Failed to fetch stock data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
