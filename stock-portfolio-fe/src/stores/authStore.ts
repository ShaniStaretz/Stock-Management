// authStore.ts
import { makeAutoObservable,runInAction } from 'mobx';
import apiClient from '../api/apiClient';

 class AuthStore {
  token: string | null = localStorage.getItem('token');
  user: any = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(email: string, password: string) {
    this.loading = true;
    this.error = null;
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      runInAction(() => {
        this.token = response.data.token;
        localStorage.setItem('token', this.token!);
      });
     await this.fetchUser();
    } catch (err) {
       runInAction(() => {
        this.error = 'Login failed';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchUser() {
    this.loading = true;
    if (!this.token) return;
    
    try {
      const response = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${this.token}` },
      });
       runInAction(() => {
         this.user = { ...response.data, id: response.data.id || response.data._id };
      });
    } catch {
      runInAction(() => {
        this.logout();
      });
    }finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
  }

  get isAuthenticated() {
    return !!this.token;
  }
}
const authStore = new AuthStore();
export default authStore;
