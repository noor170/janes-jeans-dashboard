import { describe, it, expect, vi, beforeEach } from 'vitest';

const API_BASE = 'http://localhost:8080';

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockJsonResponse(data: any, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
  } as Response);
}

const mockAuthResponse = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
  user: { id: 'u1', email: 'admin@janesjeans.com', firstName: 'Admin', lastName: 'User', role: 'ADMIN', isActive: true },
};

describe('AuthApi - Authentication', () => {
  beforeEach(async () => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.clear();
  });

  it('login sends POST to /api/auth/login and stores tokens', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockAuthResponse));

    const { authApi } = await import('@/lib/authApi');
    const result = await authApi.login({ email: 'admin@janesjeans.com', password: 'admin123' });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/auth/login`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.accessToken).toBe('access-token-123');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'access-token-123');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token-456');
  });

  it('adminLogin sends POST to /api/auth/admin/login', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockAuthResponse));

    const { authApi } = await import('@/lib/authApi');
    await authApi.adminLogin({ email: 'admin@janesjeans.com', password: 'admin123' });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/auth/admin/login`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('register sends POST to /api/auth/register', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockAuthResponse));

    const { authApi } = await import('@/lib/authApi');
    await authApi.register({
      email: 'new@test.com', password: 'pass123', firstName: 'New', lastName: 'User',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/auth/register`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('login throws on invalid credentials', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse(
      { timestamp: '2025-01-01', status: 401, error: 'Unauthorized', message: 'Invalid credentials' },
      401
    ));

    const { authApi } = await import('@/lib/authApi');
    await expect(authApi.login({ email: 'wrong@test.com', password: 'wrong' }))
      .rejects.toMatchObject({ status: 401 });
  });

  it('validateToken returns true on 200', async () => {
    localStorageMock.setItem('accessToken', 'valid-token');
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }));

    const { authApi } = await import('@/lib/authApi');
    const result = await authApi.validateToken();

    expect(result).toBe(true);
  });

  it('validateToken returns false on error', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: false, status: 401 }));

    const { authApi } = await import('@/lib/authApi');
    const result = await authApi.validateToken();

    expect(result).toBe(false);
  });

  it('refreshToken sends POST with refresh token header', async () => {
    localStorageMock.setItem('refreshToken', 'old-refresh-token');
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockAuthResponse));

    const { authApi } = await import('@/lib/authApi');
    await authApi.refreshToken();

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/auth/refresh`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer old-refresh-token' }),
      })
    );
  });

  it('refreshToken throws when no refresh token exists', async () => {
    const { authApi } = await import('@/lib/authApi');
    await expect(authApi.refreshToken()).rejects.toThrow('No refresh token available');
  });

  it('logout clears tokens', async () => {
    localStorageMock.setItem('accessToken', 'token');
    localStorageMock.setItem('refreshToken', 'refresh');
    localStorageMock.setItem('user', '{}');

    const { authApi } = await import('@/lib/authApi');
    authApi.logout();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });
});

describe('AuthApi - User Management', () => {
  beforeEach(async () => {
    vi.resetModules();
    mockFetch.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('accessToken', 'admin-token');
  });

  it('getAllUsers sends GET to /api/admin/users', async () => {
    const mockUsers = [
      { id: 'u1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'ADMIN', isActive: true },
    ];
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockUsers));

    const { authApi } = await import('@/lib/authApi');
    const result = await authApi.getAllUsers();

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/admin/users`, expect.any(Object));
    expect(result).toHaveLength(1);
  });

  it('createAdminUser sends POST', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({
      id: 'u2', email: 'new-admin@test.com', firstName: 'New', lastName: 'Admin', role: 'ADMIN', isActive: true,
    }));

    const { authApi } = await import('@/lib/authApi');
    const result = await authApi.createAdminUser('new-admin@test.com', 'password', 'New', 'Admin');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/admin/users/create-admin`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.email).toBe('new-admin@test.com');
  });

  it('updateUserRole sends PATCH', async () => {
    mockFetch.mockReturnValueOnce(mockJsonResponse({
      id: 'u1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'SUPER_ADMIN', isActive: true,
    }));

    const { authApi } = await import('@/lib/authApi');
    const result = await authApi.updateUserRole('u1', 'SUPER_ADMIN');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/admin/users/u1/role`,
      expect.objectContaining({ method: 'PATCH' })
    );
    expect(result.role).toBe('SUPER_ADMIN');
  });

  it('deactivateUser sends PATCH', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }));

    const { authApi } = await import('@/lib/authApi');
    await authApi.deactivateUser('u1');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/admin/users/u1/deactivate`,
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('activateUser sends PATCH', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }));

    const { authApi } = await import('@/lib/authApi');
    await authApi.activateUser('u1');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/admin/users/u1/activate`,
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('deleteUser sends DELETE', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }));

    const { authApi } = await import('@/lib/authApi');
    await authApi.deleteUser('u1');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/admin/users/u1`,
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('resetPassword sends POST with new password', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }));

    const { authApi } = await import('@/lib/authApi');
    await authApi.resetPassword('u1', 'newpass123');

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/admin/users/u1/reset-password`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ newPassword: 'newpass123' }),
      })
    );
  });

  it('getStoredUser returns parsed user from localStorage', async () => {
    const user = { id: 'u1', email: 'admin@test.com', firstName: 'A', lastName: 'B', role: 'ADMIN' };
    localStorageMock.setItem('user', JSON.stringify(user));

    const { authApi } = await import('@/lib/authApi');
    const result = authApi.getStoredUser();

    expect(result?.email).toBe('admin@test.com');
  });

  it('isAuthenticated returns true when token and user exist', async () => {
    localStorageMock.setItem('accessToken', 'some-token');
    localStorageMock.setItem('user', JSON.stringify({ id: 'u1' }));

    const { authApi } = await import('@/lib/authApi');
    expect(authApi.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated returns false when no token', async () => {
    const { authApi } = await import('@/lib/authApi');
    expect(authApi.isAuthenticated()).toBe(false);
  });
});
