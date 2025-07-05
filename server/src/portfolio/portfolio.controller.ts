import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Request } from 'express';
import {
  AddStockDto,
  UpdateStockDto,
  RemoveStockDto,
} from '../dto/add-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { IPortfolioEntry } from '../common/interfaces/portfolio.interface';
import { PaginationResult } from '../common/utils/pagination.util';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get()
  async getUserPortfolio(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
  ): Promise<PaginationResult<IPortfolioEntry>> {
    const userId = this.extractUserId(req);
    return this.service.getUserPortfolio(
      userId,
      pagination.page,
      pagination.pageSize,
    );
  }

  @Post()
  async addStock(
    @Req() req: Request,
    @Body() newStock: AddStockDto,
  ): Promise<IPortfolioEntry> {
    const userId = this.extractUserId(req);
    return this.service.addStock({ ...newStock, userId });
  }

  @Put()
  async updateStock(
    @Req() req: Request,
    @Body() updateData: UpdateStockDto,
  ): Promise<IPortfolioEntry> {
    const userId = this.extractUserId(req);
    const { symbol, ...updateFields } = updateData;
    return this.service.updateStock(userId, symbol, updateFields);
  }

  @Delete()
  async removeStock(
    @Req() req: Request,
    @Body() removeData: RemoveStockDto,
  ): Promise<{ deletedCount: number }> {
    const userId = this.extractUserId(req);
    return this.service.removeStock(userId, removeData.symbol);
  }

  private extractUserId(req: Request): string {
    const userId = (req.user as any)?.userId || (req.user as any)?.id;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return userId;
  }
}
