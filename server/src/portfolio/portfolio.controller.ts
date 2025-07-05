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
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Request } from 'express';
import { AddStockDto, UpdateStockDto } from '../dto/add-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { IPortfolioEntry } from '../common/interfaces/portfolio.interface';
import { PaginationResult } from '../common/utils/pagination.util';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  /**
   * GET /portfolio
   * Get user's portfolio with pagination
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserPortfolio(
    @Req() req: AuthenticatedRequest,
    @Query() pagination: PaginationDto,
  ): Promise<PaginationResult<IPortfolioEntry>> {
    const userId = this.extractUserId(req);
    return this.service.getUserPortfolio(
      userId,
      pagination.page,
      pagination.pageSize,
    );
  }

  /**
   * GET /portfolio/:symbol
   * Get specific stock from user's portfolio
   */
  @Get(':symbol')
  @HttpCode(HttpStatus.OK)
  async getPortfolioStock(
    @Req() req: AuthenticatedRequest,
    @Param('symbol') symbol: string,
  ): Promise<IPortfolioEntry> {
    const userId = this.extractUserId(req);
    return this.service.getPortfolioStock(userId, symbol);
  }

  /**
   * POST /portfolio
   * Add a new stock to user's portfolio
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addStock(
    @Req() req: AuthenticatedRequest,
    @Body() newStock: AddStockDto,
  ): Promise<IPortfolioEntry> {
    const userId = this.extractUserId(req);
    return this.service.addStock({ ...newStock, userId });
  }

  /**
   * PUT /portfolio/:symbol
   * Update a specific stock in user's portfolio
   */
  @Put(':symbol')
  @HttpCode(HttpStatus.OK)
  async updateStock(
    @Req() req: AuthenticatedRequest,
    @Param('symbol') symbol: string,
    @Body() updateData: UpdateStockDto,
  ): Promise<IPortfolioEntry> {
    const userId = this.extractUserId(req);
    return this.service.updateStock(userId, symbol, updateData);
  }

  /**
   * DELETE /portfolio/:symbol
   * Remove a specific stock from user's portfolio
   */
  @Delete(':symbol')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeStock(
    @Req() req: AuthenticatedRequest,
    @Param('symbol') symbol: string,
  ): Promise<void> {
    const userId = this.extractUserId(req);
    await this.service.removeStock(userId, symbol);
  }

  /**
   * DELETE /portfolio
   * Clear entire user's portfolio
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearPortfolio(@Req() req: AuthenticatedRequest): Promise<void> {
    const userId = this.extractUserId(req);
    await this.service.clearPortfolio(userId);
  }

  private extractUserId(req: AuthenticatedRequest): string {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return userId;
  }
}
