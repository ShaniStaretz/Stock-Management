import { makeAutoObservable, runInAction } from "mobx";

import apiClient from "../api/apiClient";

interface Stock {
  userId: string;
  symbol: string;
  name: string;
  quantity: number;
  addedAt?: string;
}

export class PortfolioStore {
  stocks: Stock[] = [];
  loading = false;

  newSymbol = "";
  newName = "";
  newQuantity = 1;

  userId = "1234"; // Hardcoded for now, replace with real user ID!

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPortfolio() {
    this.loading = true;
    try {
      const res = await apiClient.get("/portfolio", {
        params: { userId: this.userId },
      });
      runInAction(() => {
        this.stocks = res.data;
      });
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addStock() {
    if (!this.newSymbol || !this.newName || this.newQuantity < 1) return;

    const newStock: Omit<Stock, "addedAt"> = {
      userId: this.userId,
      symbol: this.newSymbol,
      name: this.newName,
      quantity: this.newQuantity,
    };

    try {
      await apiClient.post("/portfolio", newStock);
      runInAction(() => {
        this.stocks.push({ ...newStock, addedAt: new Date().toISOString() });
        this.newSymbol = "";
        this.newName = "";
        this.newQuantity = 1;
      });
    } catch (error) {
      console.error("Failed to add stock", error);
    }
  }

  async removeStock(symbol: string) {
    try {
      await apiClient.delete("/portfolio", {
        data: { userId: this.userId, symbol },
      });
      runInAction(() => {
        this.stocks = this.stocks.filter((s) => s.symbol !== symbol);
      });
    } catch (error) {
      console.error("Failed to remove stock", error);
    }
  }

  setNewSymbol(value: string) {
    this.newSymbol = value;
  }
  setNewName(value: string) {
    this.newName = value;
  }
  setNewQuantity(value: number) {
    this.newQuantity = value;
  }
}
