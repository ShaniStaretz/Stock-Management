import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';
import { UserDto } from 'src/dto/user.dto';
import { IUser } from 'src/Interfaces/IUser';
import { isEmail } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: UserDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException();
    const { token } = await this.authService.login(user as IUser);
    return { token };
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: UserDto) {
     if (!isEmail(body.email)) {
      throw new BadRequestException('Invalid email format');
    }
    
    const { token } = await this.authService.register(body);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return { user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
