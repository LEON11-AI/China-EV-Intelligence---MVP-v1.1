import { apiService } from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  async register(data: RegisterData): Promise<{ message: string }> {
    const response = await apiService.post('/auth/register', data);
    
    if (response.success) {
      return { message: response.message || 'Registration successful' };
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });

    if (response.success && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data;
    }

    throw new Error('Token refresh failed');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiService.post('/auth/forgot-password', { email });
    
    if (response.success) {
      return { message: response.message || 'Password reset email sent' };
    }
    
    throw new Error(response.message || 'Failed to send reset email');
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await apiService.post('/auth/reset-password', {
      token,
      password,
    });
    
    if (response.success) {
      return { message: response.message || 'Password reset successful' };
    }
    
    throw new Error(response.message || 'Password reset failed');
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiService.post('/auth/verify-email', { token });
    
    if (response.success) {
      return { message: response.message || 'Email verified successfully' };
    }
    
    throw new Error(response.message || 'Email verification failed');
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/users/profile');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get user profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiService.put<User>('/users/profile', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiService.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    
    if (response.success) {
      return { message: response.message || 'Password changed successfully' };
    }
    
    throw new Error(response.message || 'Failed to change password');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
export default authService;