import { Types } from 'mongoose';

export interface IPortfolioEntry {
  _id: Types.ObjectId | string;
  userId: string;
  symbol: string;
  name: string;
  quantity: number;
  addedAt: Date;
}

export interface IPortfolioEntryCreate {
  userId: string;
  symbol: string;
  name: string;
  quantity: number;
}

export interface IPortfolioEntryUpdate {
  name: string;
  quantity: number;
}

export interface IPortfolioWithStock extends IPortfolioEntry {
  stock?: {
    price?: number;
    change?: number;
    changePercent?: number;
  };
}
