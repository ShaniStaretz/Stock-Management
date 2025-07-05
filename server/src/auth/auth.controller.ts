import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { UserLoginDto, UserRegisterDto } from '../dto/user.dto';
import { IUserWithoutPassword } from '../common/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginData: UserLoginDto): Promise<{ token: string }> {
    return this.authService.login(loginData);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(
    @Body() registerData: UserRegisterDto,
  ): Promise<{ token: string }> {
    return this.authService.register(registerData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request): { user: IUserWithoutPassword } {
    return { user: req.user as IUserWithoutPassword };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(): { message: string } {
    return { message: 'Logged out successfully' };
  }
}
