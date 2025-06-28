import { Injectable, UnauthorizedException ,BadRequestException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { isEmail, isMongoId } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObj =
        typeof user.toObject === 'function' ? user.toObject() : user;
      const { password, ...result } = user.toObject();
      console.log('User validated:', result);
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    if (!user || !user._id || !isMongoId(user._id.toString())) {
      throw new BadRequestException('Invalid userId');
    }
    const payload = { sub: user._id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
    const createdUser = await this.usersService.create(email, password);
    const user = await this.validateUser(createdUser.email, password);

    return this.login(user);
  }
}
