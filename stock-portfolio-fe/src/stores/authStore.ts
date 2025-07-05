import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/apiClient";
import { notification } from "antd";

interface User {
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

class AuthStore {
  token: string | null = localStorage.getItem("token");
  user: User | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(email: string, password: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      runInAction(() => {
        this.token = response.data.token;
        localStorage.setItem("token", this.token!);
      });
      await this.fetchUser();
    } catch (err) {
      runInAction(() => {
        this.error = "Login failed";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchUser() {
    this.loading = true;
    try {
      const response = await apiClient.get("/auth/me");
      runInAction(() => {
        this.user = {
          ...response.data.user,
          id: response.data.user.id,
        };
      });
    } catch {
      runInAction(() => {
        this.logout();
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async register(email: string, password: string) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });
    try {
      await apiClient.post("/auth/register", { email, password });
      notification.success({
        message: "Registration Successful",
        description: "You have registered successfully. Please log in.",
        duration: 2,
      });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      runInAction(() => {
        this.error =
          apiError?.response?.data?.message || apiError?.message || "Registration failed";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("token");
  }

  get isAuthenticated() {
    return !!this.token;
  }
}

const authStore = new AuthStore();
export default authStore;
