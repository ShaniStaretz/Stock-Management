import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from './portfolio.schema';

import { AddStockDto } from '../shared/dto/add-stock.dto';

@Injectable()
export class PortfolioService {
  constructor(@InjectModel(Stock.name) private model: Model<Stock>) {}

  async getAll() {
    return this.model.find().exec();
  }

  async addStock(dto: AddStockDto) {
    return this.model.create({ symbol: dto.symbol.toUpperCase() });
  }
}
