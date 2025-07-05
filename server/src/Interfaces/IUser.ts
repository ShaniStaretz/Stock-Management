import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId | string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
