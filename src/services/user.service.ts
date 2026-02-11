/**
 * User Management Service Layer
 * Handles admin user CRUD operations, role changes, and password resets.
 */

import { UserDTO, UserRole } from '@/types/auth';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, API_BASE_URL, getAuthHeaders } from './api.client';

class UserService {
  async getAllUsers(): Promise<UserDTO[]> {
    return apiGet<UserDTO[]>('/api/admin/users');
  }

  async getUserById(id: string): Promise<UserDTO> {
    return apiGet<UserDTO>(`/api/admin/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<UserDTO>): Promise<UserDTO> {
    return apiPut<UserDTO>(`/api/admin/users/${id}`, userData);
  }

  async updateUserRole(id: string, role: UserRole): Promise<UserDTO> {
    return apiPatch<UserDTO>(`/api/admin/users/${id}/role`, { role });
  }

  async deactivateUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/deactivate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  }

  async activateUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/activate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    const ok = await apiDelete(`/api/admin/users/${id}`);
    if (!ok) throw new Error('Failed to delete user');
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
    return apiPost<UserDTO>('/api/admin/users/create-admin', {
      email, password, firstName, lastName,
    });
  }
}

export const userService = new UserService();
