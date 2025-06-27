import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/apiClient";
import { Stock } from "../types/Istock";


export class StockStore {
  stocks: Stock[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchStocks(symbol: string) {
    if (!symbol) {
      runInAction(() => {
        this.stocks = [];
      });
      return;
    }
    this.loading = true;
    try {
      const res = await apiClient.get("/stocks", {
        params: { symbol },
      });
      runInAction(() => {
        this.stocks = res.data;
      });
    } catch (error) {
      console.error("Failed to fetch stocks", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}