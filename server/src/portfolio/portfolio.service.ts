import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AddStockDto } from './dto/add-stock.dto';
import { PortfolioEntry } from './portfolio.schema';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(PortfolioEntry.name) private model: Model<PortfolioEntry>,
  ) {}

  async getAll() {
    return this.model.find().exec();
  }

  async getUserPortfolio(userId: string) {
    const result = await this.model.find({ userId: { $eq: userId } });

    return result;
  }

  async addStock(dto: AddStockDto) {
    const { userId, symbol } = dto;
    const existing = await this.model.findOne({ userId, symbol });
    if (existing) {
      existing.quantity += dto.quantity;
      return existing.save();
    }
    return this.model.create(dto);
  }
  async removeStock(userId: string, symbol: string) {
    const result = await this.model.deleteOne({
      userId: '1234',
      symbol: 'AAPL',
    });
    if (result.deletedCount === 0) {
      throw {
        status: 404,
        message: `Stock with symbol ${symbol} not found for user ${userId}`,
      };
    }
    return result;
  }
}
