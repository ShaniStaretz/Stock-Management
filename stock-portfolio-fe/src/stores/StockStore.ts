import { makeAutoObservable, runInAction } from "mobx";
import { notification } from "antd";
import apiClient from "../api/apiClient";
import { IApiStock } from "../types/IApiStock";
import authStore from "./authStore";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export class StockStore {
  authStore: typeof authStore;
  stocks: IApiStock[] = [];
  loading = false;
  total = 0;
  page = 1;
  pageSize = 10;

  constructor(authStoreInstance: typeof authStore) {
    this.authStore = authStoreInstance;
    makeAutoObservable(this);
  }

  get userId() {
    return this.authStore.user?.id;
  }

  async fetchStocks(
    filter: { searchSymbol: string; selectedExchange: string | undefined },
    pageSize: number = 10,
    pageNumber: number = 1
  ): Promise<void> {
    
    if (!this.userId) {
      notification.error({
        message: "Authentication Error",
        description: "You must be logged in to fetch stocks.",
        duration: 2,
      });
      return Promise.resolve();
    }

    if (!filter.searchSymbol) {
      runInAction(() => {
        this.stocks = [];
        this.total = 0;
        this.page = 1;
        this.pageSize = pageSize;
      });
      return Promise.resolve();
    }

    this.loading = true;
    try {
      const response = await apiClient.get("/stocks", {
        params: {
          symbol: filter.searchSymbol,
          exchangeShortName: filter.selectedExchange,
          pageSize,
          page: pageNumber,
        }
      });

      runInAction(() => {
        this.stocks = response.data.data;
        this.total = response.data.total;
        this.page = response.data.page;
        this.pageSize = response.data.pageSize;
      });
    } catch (error) {
      console.error("Failed to fetch stocks", error);
      notification.error({
        message: "Fetch Error",
        description: this.getErrorMessage(
          error,
          "An error occurred while fetching stock data."
        ),
        duration: 2
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  getErrorMessage(
    error: unknown,
    defaultMessage: string = "An error occurred"
  ) {
    const apiError = error as ApiError;
    return (
      apiError?.response?.data?.message ||
      apiError?.message ||
      defaultMessage
    );
  }
}
