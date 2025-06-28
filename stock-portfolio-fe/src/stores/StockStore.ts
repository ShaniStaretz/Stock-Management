import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/apiClient";
import { IApiStock } from "../types/IApiStock";

export class StockStore {
  stocks: IApiStock[] = [];
  loading = false;
  total = 0;
  page = 1;
  pageSize = 10;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchStocks(
    filter: { searchSymbol: string; selectedExchange: string | undefined },
    pageSize: number = 10,
    pageNumber: number = 1
  ): Promise<void> {
    if (!filter.searchSymbol) {
      runInAction(() => {
        this.stocks = [];
        this.total = 0;
        this.page = 1;
        this.pageSize = pageSize;
      });
      return;
    }
    this.loading = true;
    try {
      const res = await apiClient.get("/stocks", {
        params: {
          symbol: filter.searchSymbol,
          exchangeShortName: filter.selectedExchange,
          pageSize,
          pageNumber,
        },
      });
      runInAction(() => {
        this.stocks = res.data.data;
        this.total = res.data.total;
        this.page = res.data.page;
        this.pageSize = res.data.pageSize;
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
