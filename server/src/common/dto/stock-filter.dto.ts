import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class StockFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  symbol?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  exchangeShortName?: string;
}
