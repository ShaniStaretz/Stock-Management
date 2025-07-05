import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId | string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserWithoutPassword = Omit<IUser, 'password'>;

export interface IUserCreate {
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
