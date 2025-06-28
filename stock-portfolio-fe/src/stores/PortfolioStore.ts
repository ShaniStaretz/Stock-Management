import { makeAutoObservable, runInAction } from "mobx";
import { notification } from "antd";
import apiClient from "../api/apiClient";
import { IUserStock } from "../types/IUserStock";



export class PortfolioStore {
  stocks: IUserStock[] = [];
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
      notification.error({
        message: "Failed to fetch portfolio",
        description:
          this.getErrorMessage(error, "An error occurred while fetching your portfolio."),
      });
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
      notification.warning({
        message: "Stock already exists",
        description: "This stock is already in your portfolio.",
      });
      return;
    }
    const newStock: Omit<IUserStock, "addedAt"> = {
      userId: this.userId,
      symbol: this.newSymbol,
      name: this.newName,
      quantity: this.newQuantity,
    };

    try {
      await apiClient.post("/portfolio", newStock);
      await this.fetchPortfolio();
      runInAction(() => {
        this.resetForm();
      });
    } catch (error) {
      console.error("Failed to add stock", error);
      notification.error({
        message: "Failed to add stock",
        description: this.getErrorMessage(error, "An error occurred while adding the stock."),
      });
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
      runInAction(() => {
        const idx = this.stocks.findIndex(
          (s) => s.symbol === this.editingSymbol
        );
        if (idx !== -1) {
          this.stocks[idx].name = this.newName;
          this.stocks[idx].quantity = this.newQuantity;
        }
        this.resetForm()
      });
    } catch (error) {
      console.error("Failed to update stock", error);
      notification.error({
        message: "Failed to update stock",
        description: this.getErrorMessage(
          error,
          "An error occurred while updating the stock."
        ),
      });
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
      notification.error({
        message: "Failed to remove stock",
        description: this.getErrorMessage(
          error,
          "An error occurred while removing the stock."
        ),
      });
    }
  }

  getErrorMessage(
    error: unknown,
    defaultMessage: string = "An error occurred"
  ) {
    return (
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      defaultMessage
    );
  }

  resetForm() {
  this.newSymbol = "";
  this.newName = "";
  this.newQuantity = 1;
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
