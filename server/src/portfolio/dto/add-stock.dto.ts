import { IsString, IsInt, Min } from 'class-validator';

export class AddStockDto {
  @IsString()
  symbol: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  userId: string;
}
