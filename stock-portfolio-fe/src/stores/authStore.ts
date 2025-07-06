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
    try {
      const response = await apiClient.get("/auth/me");
      runInAction(() => {
        this.user = {
          ...response.data.user,
          id: response.data.user._id || response.data.user.id,
        };
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      runInAction(() => {
        this.logout();
      });
    }
  }

  async register(email: string, password: string) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });
    
    // Clear any existing token to ensure clean state
    if (this.token) {
      localStorage.removeItem("token");
      this.token = null;
      this.user = null;
    }
    
    try {
      const response = await apiClient.post("/auth/register", { email, password });
      
      // Registration returns a token, so we can log the user in immediately
      runInAction(() => {
        this.token = response.data.token;
        localStorage.setItem("token", this.token!);
      });
      
      // Fetch user data
      await this.fetchUser();
      
      notification.success({
        message: "Registration Successful",
        description: "Welcome! You have been automatically logged in.",
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
