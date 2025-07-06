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
  ExternalApiAccessException,
} from '../common/exceptions/custom-exceptions';
import { StockFilterDto } from '../common/dto/stock-filter.dto';
import { paginateArray } from '../common/utils/pagination.util';
import { sortArray } from '../common/utils/sorting.util';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiError {
  response?: {
    status: number;
    data?: unknown;
  };
  message?: string;
}

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

  async getStockList(filter: StockFilterDto): Promise<{
    data: IStock[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    const { page = 1, pageSize = 10 } = filter;

    this.validateStockFilter(filter);

    const url = this.buildStockListUrl(filter);
    const response = await this.makeApiRequest<IStock[]>(url);

    // Sort the results by symbol alphabetically
    const sortedData = sortArray(response.data, 'symbol', 'asc');

    const paginatedResult = paginateArray(sortedData, { page, pageSize });
    return {
      data: paginatedResult.data,
      total: paginatedResult.pagination.total,
      totalPages: paginatedResult.pagination.totalPages,
      page: paginatedResult.pagination.page,
      pageSize: paginatedResult.pagination.pageSize,
    };
  }

  async getStockDetails(symbol: string): Promise<IStockProfile & IStockQuote> {
    console.log('Getting stock details for symbol:', symbol);
    if (!symbol) {
      throw new InvalidStockFilterException('Stock symbol is required');
    }

    try {
      const [profile, quote] = await Promise.all([
        this.getStockProfile(symbol),
        this.getStockQuote(symbol),
      ]);

      console.log('Successfully fetched stock details for:', symbol);
      return { ...profile, ...quote };
    } catch (error) {
      console.error('Error fetching stock details for symbol:', symbol, error);
      throw error;
    }
  }

  async getStockProfile(symbol: string): Promise<IStockProfile> {
    const encodedSymbol = encodeURIComponent(symbol);
    const url = `${this.baseUrl}/profile/${encodedSymbol}?apikey=${this.apiKey}`;
    const response = await this.makeApiRequest<IStockProfile[]>(url);

    if (!response.data || response.data.length === 0) {
      throw new StockNotFoundException(symbol);
    }

    return response.data[0];
  }

  async getStockQuote(symbol: string): Promise<IStockQuote> {
    const encodedSymbol = encodeURIComponent(symbol);
    const url = `${this.baseUrl}/quote/${encodedSymbol}?apikey=${this.apiKey}`;
    const response = await this.makeApiRequest<IStockQuote[]>(url);

    if (!response.data || response.data.length === 0) {
      throw new StockNotFoundException(symbol);
    }

    return response.data[0];
  }

  private validateStockFilter(filter: StockFilterDto): void {
    // Validation logic can be expanded here if needed
    // Currently just checking if the filter object exists
    if (!filter) {
      throw new InvalidStockFilterException('Filter is required');
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

  private async makeApiRequest<T>(url: string): Promise<ApiResponse<T>> {
    console.log('Making API request to:', url);
    try {
      const response = await firstValueFrom(this.httpService.get<T>(url));
      console.log('API request successful for:', url);
      return response;
    } catch (error) {
      console.error('API request failed for:', url, error);
      const apiError = error as ApiError;
      
      if (apiError.response?.status === 404) {
        throw new StockNotFoundException('Stock not found');
      }
      
      if (apiError.response?.status === 403) {
        throw new ExternalApiAccessException(
          'Access to stock data is currently restricted. This may be due to API rate limits or the stock symbol not being available. Please try again later or contact support if the issue persists.'
        );
      }
      
      throw new HttpException(
        'Failed to fetch stock data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
