import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { JwtAuthenticationResponse, SignInRequest, SignUpRequest, User, Item, Request, ApiResponse, ItemFormData } from '../types';

// Use relative URL since Vite proxy will handle routing to Spring Boot
const API_BASE_URL = '/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false, // Don't send cookies for CORS
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
        
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        console.log(`Response from ${response.config.url}:`, response.status, response.statusText);
        return response;
      },
      (error) => {
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods - Updated to match Spring Boot endpoints
  async signIn(credentials: SignInRequest): Promise<JwtAuthenticationResponse> {
    try {
      console.log('Attempting signin with:', { username: credentials.username });
      const response: AxiosResponse<JwtAuthenticationResponse> = await this.api.post('/auth/signin', credentials);
      console.log('Signin successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signin failed:', error);
      throw error;
    }
  }

  async signUp(userData: SignUpRequest): Promise<JwtAuthenticationResponse> {
    try {
      console.log('Attempting signup with:', { 
        username: userData.username, 
        email: userData.email,
        role: userData.role || 'USER' 
      });
      const response: AxiosResponse<JwtAuthenticationResponse> = await this.api.post('/auth/signup', userData);
      console.log('Signup successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  // User management methods
  async getAllUsers(): Promise<User[]> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get('/users');
    return response.data.data;
  }

  async updateUserRole(userId: number, role: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/users/${userId}/role`, { role });
    return response.data.data;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.api.delete(`/users/${userId}`);
  }

  // Item management methods
  async getAllItems(): Promise<Item[]> {
    const response: AxiosResponse<ApiResponse<Item[]>> = await this.api.get('/items');
    return response.data.data;
  }

  async getItemById(id: number): Promise<Item> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.get(`/items/${id}`);
    return response.data.data;
  }

  async createItem(itemData: ItemFormData): Promise<Item> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.post('/items', itemData);
    return response.data.data;
  }

  async updateItem(id: number, itemData: Partial<ItemFormData>): Promise<Item> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.put(`/items/${id}`, itemData);
    return response.data.data;
  }

  async deleteItem(id: number): Promise<void> {
    await this.api.delete(`/items/${id}`);
  }

  async updateItemStatus(id: number, status: string): Promise<Item> {
    const response: AxiosResponse<ApiResponse<Item>> = await this.api.put(`/items/${id}/status`, { status });
    return response.data.data;
  }

  async getMyItems(): Promise<Item[]> {
    const response: AxiosResponse<ApiResponse<Item[]>> = await this.api.get('/items/my-items');
    return response.data.data;
  }

  // Request management methods
  async getAllRequests(): Promise<Request[]> {
    const response: AxiosResponse<ApiResponse<Request[]>> = await this.api.get('/requests');
    return response.data.data;
  }

  async getMyRequests(): Promise<Request[]> {
    const response: AxiosResponse<ApiResponse<Request[]>> = await this.api.get('/requests/my-requests');
    return response.data.data;
  }

  async createRequest(itemId: number, notes?: string): Promise<Request> {
    const response: AxiosResponse<ApiResponse<Request>> = await this.api.post('/requests', { itemId, notes });
    return response.data.data;
  }

  async updateRequestStatus(requestId: number, status: string, notes?: string): Promise<Request> {
    const response: AxiosResponse<ApiResponse<Request>> = await this.api.put(`/requests/${requestId}/status`, { 
      status, 
      notes 
    });
    return response.data.data;
  }

  async deleteRequest(requestId: number): Promise<void> {
    await this.api.delete(`/requests/${requestId}`);
  }

  // Search methods
  async searchItems(query: string): Promise<Item[]> {
    const response: AxiosResponse<ApiResponse<Item[]>> = await this.api.get(`/items/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    const response: AxiosResponse<ApiResponse<Item[]>> = await this.api.get(`/items/category/${category}`);
    return response.data.data;
  }

  async getItemsByStatus(status: string): Promise<Item[]> {
    const response: AxiosResponse<ApiResponse<Item[]>> = await this.api.get(`/items/status/${status}`);
    return response.data.data;
  }
}

export const apiService = new ApiService();
export default apiService; 