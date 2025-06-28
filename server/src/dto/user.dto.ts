import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class UserDto {
  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Email format is invalid',
  })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
