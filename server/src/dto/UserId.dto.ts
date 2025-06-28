import { IsMongoId } from 'class-validator';

export class UserIdDto {
  @IsMongoId({ message: 'userId must be a valid MongoDB ObjectId' })
  userId: string;
}