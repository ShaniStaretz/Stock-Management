import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { isEmail, isMongoId } from 'class-validator';
import {
  IUser,
  IUserWithoutPassword,
  IUserCreate,
  IUserLogin,
} from '../common/interfaces/user.interface';
import { EmailAlreadyExistsException } from '../common/exceptions/custom-exceptions';
import { compare } from 'bcrypt';

interface MongoError {
  code: number;
  keyPattern?: Record<string, any>;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<IUserWithoutPassword | null> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Extract user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _unused, ...result } = user;

    return result;
  }

  async login(loginData: IUserLogin): Promise<{ token: string }> {
    const user = await this.validateUser(loginData.email, loginData.password);

    if (!user || !user._id || !isMongoId(user._id.toString())) {
      throw new BadRequestException('Invalid user data');
    }

    const payload = { sub: user._id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerData: IUserCreate): Promise<{ token: string }> {
    const { email, password } = registerData;

    try {
      await this.usersService.create(email, password);
      return this.login({ email, password });
    } catch (error) {
      const mongoError = error as MongoError;
      if (
        mongoError.code === 11000 &&
        mongoError.keyPattern &&
        'email' in mongoError.keyPattern
      ) {
        throw new EmailAlreadyExistsException(email);
      }
      throw error;
    }
  }

  generateToken(user: IUser): { token: string } {
    if (!user || !user._id || !isMongoId(user._id.toString())) {
      throw new BadRequestException('Invalid user data');
    }

    const payload = { sub: user._id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
