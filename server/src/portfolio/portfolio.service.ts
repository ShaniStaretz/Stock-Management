import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPortfolioEntry } from '../common/interfaces/portfolio.interface';
import { PortfolioEntryNotFoundException } from '../common/exceptions/custom-exceptions';
import { AddStockDto, UpdateStockDto } from '../dto/add-stock.dto';
import { PortfolioEntry } from '../schemas/portfolio.schema';
import {
  paginateArray,
  PaginationResult,
} from '../common/utils/pagination.util';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(PortfolioEntry.name) private model: Model<PortfolioEntry>,
  ) {}

  async getAll(): Promise<IPortfolioEntry[]> {
    const result = await this.model.find().exec();
    return result.map((doc) => doc.toObject() as IPortfolioEntry);
  }

  async getUserPortfolio(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResult<IPortfolioEntry>> {
    const result = await this.model.find({ userId: { $eq: userId } }).exec();
    const portfolioEntries = result.map((doc) => doc.toObject() as IPortfolioEntry);
    return paginateArray(portfolioEntries, { page: pageNumber, pageSize });
  }

  async getPortfolioStock(
    userId: string,
    symbol: string,
  ): Promise<IPortfolioEntry> {
    const result = await this.model.findOne({ userId, symbol }).exec();
    
    if (!result) {
      throw new PortfolioEntryNotFoundException(symbol, userId);
    }
    
    return result.toObject() as IPortfolioEntry;
  }

  async addStock(
    dto: AddStockDto & { userId: string },
  ): Promise<IPortfolioEntry> {
    const { userId, symbol } = dto;
    const existing = await this.model.findOne({ userId, symbol });

    if (existing) {
      existing.quantity += dto.quantity;
      const saved = await existing.save();
      return saved.toObject() as IPortfolioEntry;
    }

    const created = await this.model.create(dto);
    return created.toObject() as IPortfolioEntry;
  }

  async updateStock(
    userId: string,
    symbol: string,
    updateData: UpdateStockDto,
  ): Promise<IPortfolioEntry> {
    const stock = await this.model.findOne({ userId, symbol });

    if (!stock) {
      throw new PortfolioEntryNotFoundException(symbol, userId);
    }

    stock.name = updateData.name;
    stock.quantity = updateData.quantity;
    const saved = await stock.save();
    return saved.toObject() as IPortfolioEntry;
  }

  async removeStock(
    userId: string,
    symbol: string,
  ): Promise<void> {
    const result = await this.model.deleteOne({ userId, symbol });

    if (result.deletedCount === 0) {
      throw new PortfolioEntryNotFoundException(symbol, userId);
    }
  }

  async clearPortfolio(userId: string): Promise<void> {
    await this.model.deleteMany({ userId });
  }

  async getPortfolioEntry(
    userId: string,
    symbol: string,
  ): Promise<IPortfolioEntry | null> {
    const result = await this.model.findOne({ userId, symbol }).exec();
    return result ? (result.toObject() as IPortfolioEntry) : null;
  }
}
