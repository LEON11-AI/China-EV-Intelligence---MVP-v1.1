import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'enterprise';
  createdAt: string;
  lastLoginAt: string;
  isEmailVerified: boolean;
  preferences: {
    language: 'zh' | 'en';
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
    dashboard: {
      defaultView: 'grid' | 'list';
      itemsPerPage: number;
    };
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkAuth: () => void;
  isAuthenticated: boolean;
}

type AuthStore = AuthState & AuthActions;

// Mock API functions - replace with actual API calls
const mockApi = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'admin@example.com' && password === 'password') {
      return {
        user: {
          id: '1',
          email: 'admin@example.com',
          name: '管理员',
          role: 'admin' as const,
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isEmailVerified: true,
          preferences: {
            language: 'zh' as const,
            theme: 'light' as const,
            notifications: {
              email: true,
              push: true,
              marketing: false
            },
            dashboard: {
              defaultView: 'grid' as const,
              itemsPerPage: 20
            }
          }
        },
        token: 'mock-jwt-token-admin'
      };
    } else if (email === 'user@example.com' && password === 'password') {
      return {
        user: {
          id: '2',
          email: 'user@example.com',
          name: '普通用户',
          role: 'user' as const,
          createdAt: '2024-01-15T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isEmailVerified: true,
          preferences: {
            language: 'zh' as const,
            theme: 'light' as const,
            notifications: {
              email: true,
              push: false,
              marketing: true
            },
            dashboard: {
              defaultView: 'list' as const,
              itemsPerPage: 10
            }
          }
        },
        token: 'mock-jwt-token-user'
      };
    } else {
      throw new Error('邮箱或密码错误');
    }
  },

  register: async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock email validation
    if (email === 'admin@example.com' || email === 'user@example.com') {
      throw new Error('该邮箱已被注册');
    }
    
    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isEmailVerified: false,
        preferences: {
          language: 'zh' as const,
          theme: 'light' as const,
          notifications: {
            email: true,
            push: true,
            marketing: false
          },
          dashboard: {
            defaultView: 'grid' as const,
            itemsPerPage: 20
          }
        }
      },
      token: 'mock-jwt-token-new-user'
    };
  },

  refreshToken: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      token: 'refreshed-' + token,
      user: null // User data remains the same
    };
  },

  verifyEmail: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock verification success
    return { success: true };
  },

  resetPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock reset email sent
    return { success: true };
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock password change
    if (currentPassword === 'wrongpassword') {
      throw new Error('当前密码错误');
    }
    return { success: true };
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await mockApi.login(email, password);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '登录失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await mockApi.register(email, password, name);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '注册失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      updatePreferences: (preferences: Partial<User['preferences']>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              preferences: { ...user.preferences, ...preferences } 
            } 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          const { token: newToken } = await mockApi.refreshToken(token);
          set({ token: newToken });
        } catch (error) {
          // If refresh fails, logout user
          set({ user: null, token: null });
        }
      },

      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.verifyEmail(token);
          const { user } = get();
          if (user) {
            set({ 
              user: { ...user, isEmailVerified: true },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '邮箱验证失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.resetPassword(email);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '重置密码失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.changePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '修改密码失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      checkAuth: () => {
        const { token } = get();
        if (token) {
          // Token exists, user is authenticated
          // In a real app, you might want to validate the token here
        }
      },

      get isAuthenticated() {
        const { user, token } = get();
        return !!(user && token);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      })
    }
  )
);

// Auto refresh token every 30 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { token, refreshToken } = useAuthStore.getState();
    if (token) {
      refreshToken().catch(() => {
        // Silent fail - user will be logged out if refresh fails
      });
    }
  }, 30 * 60 * 1000); // 30 minutes
}