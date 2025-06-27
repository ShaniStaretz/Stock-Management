import { makeAutoObservable, runInAction } from "mobx";
import { message } from "antd"; 
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
  fetching = false;
  total = 0;
  page = 1;
  pageSize = 10;

  newSymbol = "";
  newName = "";
  newQuantity = 1;

  userId = "1234"; // Hardcoded for now, replace with real user ID!

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPortfolio(pageNumber: number = 1, pageSize: number = 10) {
    if (this.fetching) return;
    this.loading = true;
    this.fetching = true;
    try {
      const res = await apiClient.get("/portfolio", {
        params: { userId: this.userId, pageSize, pageNumber },
      });
      runInAction(() => {
        this.stocks = res.data.data;
        this.total = res.data.total;
        this.page = res.data.page;
        this.pageSize = res.data.pageSize;
      });
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
      message.error("Failed to fetch portfolio: " + ((error as any)?.message || "An error occurred."));
    } finally {
      runInAction(() => {
        this.loading = false;
        this.fetching = false;
      });
    }
  }

  async addStock() {
    if (!this.newSymbol || !this.newName || this.newQuantity < 1) return;
     if (this.stocks.some((s) => s.symbol === this.newSymbol)) {
      console.warn("Stock already exists in portfolio");
      message.warning("Stock already exists in your portfolio.");
      return;
    }
    const newStock: Omit<Stock, "addedAt"> = {
      userId: this.userId,
      symbol: this.newSymbol,
      name: this.newName,
      quantity: this.newQuantity,
    };

    try {
      await apiClient.post("/portfolio", newStock);
      await this.fetchPortfolio();
      message.success("Stock added successfully!");
      runInAction(() => {
        this.stocks.push(newStock);
        this.newSymbol = "";
        this.newName = "";
        this.newQuantity = 1;
      });
    } catch (error) {
      console.error("Failed to add stock", error);
      message.error("Failed to add stock" + ((error as any)?.message || "An error occurred."));
       
    }
  }
  async updateStock() {
    if (!this.editingSymbol || !this.newName || this.newQuantity < 1) return;

    try {
      await apiClient.put("/portfolio", {
        userId: this.userId,
        symbol: this.editingSymbol,
        name: this.newName,
        quantity: this.newQuantity,
      });
      await this.fetchPortfolio();
      message.success("Stock updated successfully!");
      runInAction(() => {
        const idx = this.stocks.findIndex(
          (s) => s.symbol === this.editingSymbol
        );
        if (idx !== -1) {
          this.stocks[idx].name = this.newName;
          this.stocks[idx].quantity = this.newQuantity;
        }
        this.newSymbol = "";
        this.newName = "";
        this.newQuantity = 1;
      });
    } catch (error) {
      console.error("Failed to update stock", error);
       message.error("Failed to update stock: " + ((error as any)?.message || "An error occurred while updating the stock."));
    }
  }

  async removeStock(symbol: string) {
    try {
      await apiClient.delete("/portfolio", {
        data: { userId: this.userId, symbol },
      });
      message.success("Stock removed successfully!");
      runInAction(() => {
        this.stocks = this.stocks.filter((s) => s.symbol !== symbol);
      });
    } catch (error) {
      console.error("Failed to remove stock", error);
      message.error("Failed to remove stock: " + ((error as any)?.message || "An error occurred while removing the stock."));
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

  isEditing = false;
  editingSymbol: string | null = null;

  setEditing(symbol: string | null) {
    this.isEditing = !!symbol;
    this.editingSymbol = symbol;
  }

  resetEditing() {
    this.isEditing = false;
    this.editingSymbol = null;
  }
}
