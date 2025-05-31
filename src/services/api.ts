import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { JwtAuthenticationResponse, SignInRequest, SignUpRequest, User, Item, Request, ItemFormData, RequestCreateDto, RequestUpdateDto } from '../types';

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

  // ===============================
  // ITEM CRUD OPERATIONS - MATCHING BACKEND API EXACTLY
  // ===============================

  // GET /api/v1/items - Retrieves all items
  async getAllItems(): Promise<Item[]> {
    try {
      console.log('Fetching all items...');
      const response: AxiosResponse<Item[]> = await this.api.get('/items');
      console.log('Items fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch items:', error);
      throw error;
    }
  }

  // GET /api/v1/items/{id} - Retrieves specific item by ID
  async getItemById(id: number): Promise<Item> {
    try {
      console.log(`Fetching item with ID: ${id}`);
      const response: AxiosResponse<Item> = await this.api.get(`/items/${id}`);
      console.log('Item fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch item ${id}:`, error);
      throw error;
    }
  }

  // POST /api/v1/items - Creates a new item
  async createItem(itemData: ItemFormData): Promise<Item> {
    try {
      console.log('Creating new item:', itemData);
      const response: AxiosResponse<Item> = await this.api.post('/items', itemData);
      console.log('Item created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  }

  // PUT /api/v1/items/{id} - Updates an existing item
  async updateItem(id: number, itemData: Partial<ItemFormData>): Promise<Item> {
    try {
      console.log(`Updating item ${id}:`, itemData);
      const response: AxiosResponse<Item> = await this.api.put(`/items/${id}`, itemData);
      console.log('Item updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update item ${id}:`, error);
      throw error;
    }
  }

  // DELETE /api/v1/items/{id} - Deletes an item
  async deleteItem(id: number): Promise<void> {
    try {
      console.log(`Deleting item ${id}`);
      await this.api.delete(`/items/${id}`);
      console.log('Item deleted successfully');
    } catch (error) {
      console.error(`Failed to delete item ${id}:`, error);
      throw error;
    }
  }

  // PATCH /api/v1/items/{id}/status - Updates item status
  async updateItemStatus(id: number, status: string): Promise<Item> {
    try {
      console.log(`Updating item ${id} status to: ${status}`);
      const response: AxiosResponse<Item> = await this.api.patch(`/items/${id}/status`, { status });
      console.log('Item status updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update item ${id} status:`, error);
      throw error;
    }
  }

  // ===============================
  // USER MANAGEMENT (Admin only)
  // ===============================

  async getAllUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.api.delete(`/users/${userId}`);
  }

  // ===============================
  // REQUEST MANAGEMENT (Future implementation)
  // ===============================

  async getAllRequests(): Promise<Request[]> {
    const response: AxiosResponse<Request[]> = await this.api.get('/requests');
    return response.data;
  }

  async getRequestById(id: number): Promise<Request> {
    const response: AxiosResponse<Request> = await this.api.get(`/requests/${id}`);
    return response.data;
  }

  async createRequest(requestData: RequestCreateDto): Promise<Request> {
    const response: AxiosResponse<Request> = await this.api.post('/requests', requestData);
    return response.data;
  }

  async updateRequest(id: number, requestData: RequestUpdateDto): Promise<Request> {
    const response: AxiosResponse<Request> = await this.api.patch(`/requests/${id}`, requestData);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 