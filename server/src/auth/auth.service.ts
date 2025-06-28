import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { isEmail, isMongoId } from 'class-validator';
import { IUser } from 'src/Interfaces/IUser';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<IUser, 'password'> | null> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObj: IUser =
        typeof user.toObject === 'function' ? user.toObject() : user;
      const { password, ...result } = userObj;

      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: IUser): Promise<{ token: string }> {
    console.log('Login user:', user);
    if (!user || !user._id || !isMongoId(user._id.toString())) {
      throw new BadRequestException('Invalid userId');
    }
    const payload = { sub: user._id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(body: UserDto): Promise<{ token: string }> {
    const { email, password } = body;
    try {
      const createdUser = await this.usersService.create(email, password);
      const user = await this.validateUser(createdUser.email, password);

      return this.login(user as IUser);
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }
}
