import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class StocksService {
  private readonly apiKey = process.env.FMP_API_KEY;
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
}
