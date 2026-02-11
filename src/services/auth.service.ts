/**
 * Auth Service Layer
 * Handles authentication: login, register, token refresh, validation.
 */

import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';
import { jwtService } from './jwt.service';
import { API_BASE_URL, handleResponse, getAuthHeaders } from './api.client';

class AuthService {
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = await handleResponse<AuthResponse>(response);
    jwtService.setTokens(data.accessToken, data.refreshToken);
    jwtService.setStoredUser(data.user);
    return data;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse<AuthResponse>(response);
    jwtService.setTokens(data.accessToken, data.refreshToken);
    jwtService.setStoredUser(data.user);
    return data;
  }

  async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse<AuthResponse>(response);
    jwtService.setTokens(data.accessToken, data.refreshToken);
    jwtService.setStoredUser(data.user);
    return data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = jwtService.getRefreshToken();
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

    const data = await handleResponse<AuthResponse>(response);
    jwtService.setTokens(data.accessToken, data.refreshToken);
    jwtService.setStoredUser(data.user);
    return data;
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  logout(): void {
    jwtService.clearTokens();
  }

  getStoredUser(): AuthResponse['user'] | null {
    return jwtService.getStoredUser<AuthResponse['user']>();
  }

  isAuthenticated(): boolean {
    return jwtService.isAuthenticated();
  }
}

export const authService = new AuthService();
