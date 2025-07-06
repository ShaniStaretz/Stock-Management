import { IsString, IsInt, Min, IsNotEmpty, Matches } from 'class-validator';

export class AddStockDto {
  @IsString()
  @IsNotEmpty({ message: 'Stock symbol is required' })
  @Matches(/^[A-Z0-9.\-^/]{1,15}$/, {
    message: 'Stock symbol must be 1-15 characters: A-Z, 0-9, dot, dash, caret, or slash.'
  })
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
