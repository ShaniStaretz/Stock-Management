import { HttpException, HttpStatus } from '@nestjs/common';

export class StockNotFoundException extends HttpException {
  constructor(symbol: string) {
    super(`Stock with symbol ${symbol} not found`, HttpStatus.NOT_FOUND);
  }
}

export class PortfolioEntryNotFoundException extends HttpException {
  constructor(symbol: string, userId: string) {
    super(
      `Stock with symbol ${symbol} not found for user ${userId}`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidStockFilterException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} not found`, HttpStatus.NOT_FOUND);
  }
}

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`Email ${email} already exists`, HttpStatus.CONFLICT);
  }
}
