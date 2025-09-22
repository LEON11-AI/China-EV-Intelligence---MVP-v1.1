import { apiService } from './api';
import { User, ApiResponse } from '../types';

export class UserService {
  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get('/user/profile');
  }

  /**
   * 更新用户基本信息
   */
  static async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    bio?: string;
  }): Promise<ApiResponse<User>> {
    return apiService.put('/user/profile', data);
  }

  /**
   * 更新用户头像
   */
  static async updateAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiService.upload('/user/avatar', formData);
  }

  /**
   * 修改密码
   */
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.put('/user/password', data);
  }

  /**
   * 更新用户偏好设置
   */
  static async updatePreferences(preferences: {
    language?: 'zh-CN' | 'en-US';
    theme?: 'light' | 'dark' | 'auto';
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy?: {
      profileVisibility: 'public' | 'private';
      dataSharing: boolean;
    };
    dashboard?: {
      defaultView: 'overview' | 'reports' | 'vehicles';
      itemsPerPage: number;
    };
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.put('/user/preferences', preferences);
  }

  /**
   * 获取用户偏好设置
   */
  static async getPreferences(): Promise<ApiResponse<{
    language: 'zh-CN' | 'en-US';
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private';
      dataSharing: boolean;
    };
    dashboard: {
      defaultView: 'overview' | 'reports' | 'vehicles';
      itemsPerPage: number;
    };
  }>> {
    return apiService.get('/user/preferences');
  }

  /**
   * 获取用户活动日志
   */
  static async getActivityLog(params?: {
    page?: number;
    limit?: number;
    type?: 'login' | 'report' | 'vehicle_view' | 'subscription' | 'profile';
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<ApiResponse<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.dateRange) {
      queryParams.append('startDate', params.dateRange.start);
      queryParams.append('endDate', params.dateRange.end);
    }

    return apiService.get(`/user/activity?${queryParams.toString()}`);
  }

  /**
   * 获取用户统计数据
   */
  static async getUserStats(): Promise<ApiResponse<{
    totalReports: number;
    totalVehicleViews: number;
    favoriteVehicles: number;
    accountAge: number; // days
    lastLogin: string;
    subscriptionStatus: string;
    usageThisMonth: {
      reports: number;
      vehicleViews: number;
      timeSpent: number; // minutes
    };
  }>> {
    return apiService.get('/user/stats');
  }

  /**
   * 删除用户账户
   */
  static async deleteAccount(data: {
    password: string;
    reason?: string;
    feedback?: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete('/user/account', { data });
  }

  /**
   * 导出用户数据
   */
  static async exportUserData(format: 'json' | 'csv'): Promise<Blob> {
    const response = await fetch(`${apiService.getBaseURL()}/user/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  /**
   * 验证邮箱
   */
  static async verifyEmail(token: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post('/user/verify-email', { token });
  }

  /**
   * 重新发送邮箱验证
   */
  static async resendEmailVerification(): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post('/user/resend-verification');
  }

  /**
   * 绑定手机号
   */
  static async bindPhone(data: {
    phone: string;
    verificationCode: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post('/user/bind-phone', data);
  }

  /**
   * 发送手机验证码
   */
  static async sendPhoneVerification(phone: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post('/user/send-phone-code', { phone });
  }

  /**
   * 解绑手机号
   */
  static async unbindPhone(data: {
    verificationCode: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post('/user/unbind-phone', data);
  }

  /**
   * 获取用户收藏列表
   */
  static async getFavorites(type?: 'vehicles' | 'reports'): Promise<ApiResponse<Array<{
    id: string;
    type: 'vehicle' | 'report';
    itemId: string;
    title: string;
    description?: string;
    thumbnail?: string;
    createdAt: string;
  }>>> {
    const queryParams = type ? `?type=${type}` : '';
    return apiService.get(`/user/favorites${queryParams}`);
  }

  /**
   * 添加到收藏
   */
  static async addToFavorites(data: {
    type: 'vehicle' | 'report';
    itemId: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post('/user/favorites', data);
  }

  /**
   * 从收藏中移除
   */
  static async removeFromFavorites(favoriteId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete(`/user/favorites/${favoriteId}`);
  }

  /**
   * 获取通知列表
   */
  static async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    read: boolean;
    createdAt: string;
    actionUrl?: string;
  }>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');

    return apiService.get(`/user/notifications?${queryParams.toString()}`);
  }

  /**
   * 标记通知为已读
   */
  static async markNotificationAsRead(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.put(`/user/notifications/${notificationId}/read`);
  }

  /**
   * 标记所有通知为已读
   */
  static async markAllNotificationsAsRead(): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.put('/user/notifications/read-all');
  }

  /**
   * 删除通知
   */
  static async deleteNotification(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete(`/user/notifications/${notificationId}`);
  }

  /**
   * 获取未读通知数量
   */
  static async getUnreadNotificationCount(): Promise<ApiResponse<{ count: number }>> {
    return apiService.get('/user/notifications/unread-count');
  }
}

export default UserService;