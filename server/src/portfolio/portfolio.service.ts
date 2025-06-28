import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AddStockDto } from '../dto/add-stock.dto';
import { PortfolioEntry } from '../schemas/portfolio.schema';

@Injectable()
export class PortfolioService {
  
  constructor(
    @InjectModel(PortfolioEntry.name) private model: Model<PortfolioEntry>,
  ) {}

  async getAll() {
    return this.model.find().exec();
  }

  async getUserPortfolio(userId: string, pageNumber: number = 1, pageSize: number = 10) {
    const result = await this.model.find({ userId: { $eq: userId } })
       const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = Array.isArray(result) ? result.slice(start, end) : [];
    return {
      data: paginatedData,
      total: Array.isArray(result) ? result.length : 0,
      pageNumber,
      pageSize,
    };
  }

  async addStock(dto: AddStockDto& { userId: string }) {
    const { userId, symbol } = dto;
    const existing = await this.model.findOne({ userId, symbol });
    if (existing) {
      existing.quantity += dto.quantity;
      return existing.save();
    }
    return this.model.create(dto);
  }

  async updateStock(
    userId: string,
    symbol: string,
    name: string,
    quantity: number,
  ) {
    const stock = await this.model.findOne({ userId, symbol });
    if (!stock) {
      throw new NotFoundException(`Stock with symbol ${symbol} not found`);
    }
    stock.name = name;
    stock.quantity = quantity;
    return stock.save();
  }
  
  async removeStock(userId: string, symbol: string) {
    const result = await this.model.deleteOne({
      userId,
      symbol
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
