import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class AddStockDto {
  @IsString()
  @IsNotEmpty({ message: 'Stock symbol is required' })
  symbol: string;

  @IsString()
  @IsNotEmpty({ message: 'Stock name is required' })
  name: string;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class UpdateStockDto {
  @IsString()
  @IsNotEmpty({ message: 'Stock name is required' })
  name: string;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
