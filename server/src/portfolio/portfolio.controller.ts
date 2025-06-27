import {
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Response } from 'express';
import { AddStockDto } from './dto/add-stock.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get()
  async getUserPortfolio(@Query('userId') userId: string, @Res() res: Response) {
    try {
      if (!userId) {
        throw { status: 400, message: 'User ID is required' };
      }
      const result = this.service.getUserPortfolio(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error adding stock:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Post()
  async add(@Body() newStock: AddStockDto, @Res() res: Response) {
    try {
      const result = await this.service.addStock(newStock);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error adding stock:', error.message);
      return res
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  @Delete()
  async remove(
    @Body() body: { userId: string; symbol: string },
    @Res() res: Response,
  ) {
    try {
      const { userId, symbol } = body;
      console.log('Removing stock:', userId, symbol);
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
