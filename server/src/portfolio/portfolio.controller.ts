import {
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Put,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Response, Request } from 'express';
import { AddStockDto } from '../dto/add-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get()
  async getUserPortfolio(
    @Res() res: Response,
    @Req() req: Request,
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    try {
      const userId =
        (req.user && (req.user as any).userId) || (req.user as any).id;
      if (!userId) {
        throw { status: 400, message: 'User ID is required' };
      }
      const result = await this.service.getUserPortfolio(
        userId,
        pageNumber,
        pageSize,
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error adding stock:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Post()
  async add(@Req() req: Request, @Res() res: Response, @Body() newStock: AddStockDto) {
    try {
      const userId =
        (req.user && (req.user as any).userId) || (req.user as any).id;
      if (!userId) {
        throw { status: 400, message: 'User ID is required' };
      }
      const result = await this.service.addStock({ ...newStock, userId });
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error adding stock:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Put()
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    body: { symbol: string; name: string; quantity: number },
  ) {
    try {
      const userId =
        (req.user && (req.user as any).userId) || (req.user as any).id;
      const { symbol, name, quantity } = body;
      if (!userId || !symbol || !name || quantity == null) {
        throw {
          status: 400,
          message: 'User ID, symbol, name, and quantity are required',
        };
      }
      const result = await this.service.updateStock(
        userId,
        symbol,
        name,
        quantity,
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error updating stock:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Delete()
  async remove(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { symbol: string },
  ) {
    try {
      const userId =
        (req.user && (req.user as any).userId) || (req.user as any).id;
      const { symbol } = body;
      if (!userId || !symbol) {
        throw { status: 400, message: 'User ID and symbol are required' };
      }
      const result = await this.service.removeStock(userId, symbol);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error removing stock:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }
}
