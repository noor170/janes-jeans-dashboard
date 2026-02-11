/**
 * @deprecated Use imports from '@/services' instead.
 * This file re-exports for backward compatibility.
 */
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { jwtService } from '@/services/jwt.service';
import { AuthResponse, LoginRequest, RegisterRequest, UserDTO, UserRole } from '@/types/auth';

/**
 * Legacy API facade that delegates to the new service layer.
 */
class AuthApiService {
  async register(request: RegisterRequest): Promise<AuthResponse> {
    return authService.register(request);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return authService.login(credentials);
  }

  async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    return authService.adminLogin(credentials);
  }

  async refreshToken(): Promise<AuthResponse> {
    return authService.refreshToken();
  }

  async validateToken(): Promise<boolean> {
    return authService.validateToken();
  }

  logout(): void {
    authService.logout();
  }

  // User Management - delegates to userService
  async getAllUsers(): Promise<UserDTO[]> {
    return userService.getAllUsers();
  }

  async getUserById(id: string): Promise<UserDTO> {
    return userService.getUserById(id);
  }

  async updateUser(id: string, userData: Partial<UserDTO>): Promise<UserDTO> {
    return userService.updateUser(id, userData);
  }

  async updateUserRole(id: string, role: UserRole): Promise<UserDTO> {
    return userService.updateUserRole(id, role);
  }

  async deactivateUser(id: string): Promise<void> {
    return userService.deactivateUser(id);
  }

  async activateUser(id: string): Promise<void> {
    return userService.activateUser(id);
  }

  async deleteUser(id: string): Promise<void> {
    return userService.deleteUser(id);
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    return userService.resetPassword(id, newPassword);
  }

  async createAdminUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<UserDTO> {
    return userService.createAdminUser(email, password, firstName, lastName);
  }

  getStoredUser(): AuthResponse['user'] | null {
    return authService.getStoredUser();
  }

  isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }
}

export const authApi = new AuthApiService();
