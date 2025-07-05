// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser, IUserCreate } from '../common/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User & Document>,
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    const result = await this.userModel.findOne({ email }).exec();
    return result ? result.toObject() : null;
  }

  async create(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword });
    const saved = await user.save();
    return saved.toObject();
  }

  async createUser(userData: IUserCreate): Promise<IUser> {
    return this.create(userData.email, userData.password);
  }

  async findById(id: string): Promise<IUser | null> {
    const result = await this.userModel.findById(id).exec();
    return result ? result.toObject() : null;
  }
}
