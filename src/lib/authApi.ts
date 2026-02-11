import { AuthResponse, LoginRequest, RegisterRequest, UserDTO, UserRole, ApiError } from '@/types/auth';

// Configure your Spring Boot backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class AuthApiService {
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        timestamp: new Date().toISOString(),
        status: response.status,
        error: response.statusText,
        message: 'An error occurred',
      }));
      throw error;
    }
    return response.json();
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        headers: this.getAuthHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.clearTokens();
  }

  // User Management APIs
  async getAllUsers(): Promise<UserDTO[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserDTO[]>(response);
  }

  async getUserById(id: string): Promise<UserDTO> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserDTO>(response);
  }

  async updateUser(id: string, userData: Partial<UserDTO>): Promise<UserDTO> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse<UserDTO>(response);
  }

  async updateUserRole(id: string, role: UserRole): Promise<UserDTO> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return this.handleResponse<UserDTO>(response);
  }

  async deactivateUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/deactivate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  }

  async activateUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/activate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/reset-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  }

  async createAdminUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<UserDTO> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/create-admin`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    return this.handleResponse<UserDTO>(response);
  }

  getStoredUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getStoredUser();
  }
}

export const authApi = new AuthApiService();
