import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObj =
        typeof user.toObject === 'function' ? user.toObject() : user;
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const createdUser = await this.usersService.create(email, password);
    const user = await this.validateUser(createdUser.email, password);
    return this.login(user);
  }
}
