/**
 * API Client Layer
 * Centralized HTTP client with authentication headers and response handling.
 */

import { jwtService } from './jwt.service';
import { ApiError } from '@/types/auth';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getAuthHeaders = (): HeadersInit => {
  const token = jwtService.getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getPublicHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
});

export const handleResponse = async <T>(response: Response): Promise<T> => {
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
};

/**
 * Authenticated GET request
 */
export const apiGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<T>(response);
};

/**
 * Authenticated POST request
 */
export const apiPost = async <T>(path: string, body?: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  return handleResponse<T>(response);
};

/**
 * Authenticated PUT request
 */
export const apiPut = async <T>(path: string, body?: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  return handleResponse<T>(response);
};

/**
 * Authenticated PATCH request
 */
export const apiPatch = async <T>(path: string, body?: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  return handleResponse<T>(response);
};

/**
 * Authenticated DELETE request
 */
export const apiDelete = async (path: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.ok;
};

/**
 * Public POST request (no auth)
 */
export const publicPost = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
};

/**
 * Public GET request (no auth)
 */
export const publicGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getPublicHeaders(),
  });
  return handleResponse<T>(response);
};
