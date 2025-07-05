export interface IUser {
  _id: string;
  email: string;
  password?: string;
  [key: string]: any;
}
