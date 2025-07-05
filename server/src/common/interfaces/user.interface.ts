export interface IUser {
  _id: any;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}

export interface IUserCreate {
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
