import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
  description?: string;
}

export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PlanFeature[];
  popular?: boolean;
  maxUsers?: number;
  maxReports?: number;
  maxApiCalls?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Usage {
  period: string;
  reports: {
    used: number;
    limit: number;
  };
  apiCalls: {
    used: number;
    limit: number;
  };
  dataExports: {
    used: number;
    limit: number;
  };
  users: {
    used: number;
    limit: number;
  };
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: string;
  paidAt?: string;
  invoiceUrl?: string;
  description: string;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  usage: Usage | null;
  invoices: Invoice[];
  availablePlans: PlanDetails[];
  isLoading: boolean;
  error: string | null;
}

export interface SubscriptionActions {
  fetchSubscription: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  upgradePlan: (plan: SubscriptionPlan, billingCycle: BillingCycle) => Promise<void>;
  downgradePlan: (plan: SubscriptionPlan) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  updateBillingCycle: (billingCycle: BillingCycle) => Promise<void>;
  clearError: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

// Mock data
const mockPlans: PlanDetails[] = [
  {
    id: 'basic',
    name: '基础版',
    description: '适合个人用户和小型团队',
    price: {
      monthly: 99,
      yearly: 990
    },
    features: [
      { name: '基础车型数据', included: true },
      { name: '市场趋势报告', included: true, limit: 10 },
      { name: 'API调用', included: true, limit: 1000 },
      { name: '数据导出', included: true, limit: 5 },
      { name: '邮件支持', included: true },
      { name: '高级分析', included: false },
      { name: '自定义报告', included: false },
      { name: '优先支持', included: false }
    ],
    maxUsers: 1,
    maxReports: 10,
    maxApiCalls: 1000
  },
  {
    id: 'pro',
    name: '专业版',
    description: '适合中型企业和专业分析师',
    price: {
      monthly: 299,
      yearly: 2990
    },
    features: [
      { name: '完整车型数据库', included: true },
      { name: '无限市场趋势报告', included: true },
      { name: 'API调用', included: true, limit: 10000 },
      { name: '无限数据导出', included: true },
      { name: '高级分析工具', included: true },
      { name: '自定义报告', included: true, limit: 50 },
      { name: '优先邮件支持', included: true },
      { name: '电话支持', included: true }
    ],
    popular: true,
    maxUsers: 5,
    maxReports: -1, // unlimited
    maxApiCalls: 10000
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: '适合大型企业和机构',
    price: {
      monthly: 999,
      yearly: 9990
    },
    features: [
      { name: '完整数据库访问', included: true },
      { name: '无限报告和分析', included: true },
      { name: '无限API调用', included: true },
      { name: '无限数据导出', included: true },
      { name: '高级分析和AI洞察', included: true },
      { name: '无限自定义报告', included: true },
      { name: '专属客户经理', included: true },
      { name: '24/7技术支持', included: true },
      { name: '私有部署选项', included: true },
      { name: 'SLA保障', included: true }
    ],
    maxUsers: -1, // unlimited
    maxReports: -1, // unlimited
    maxApiCalls: -1 // unlimited
  }
];

// Mock API functions
const mockApi = {
  fetchSubscription: async (): Promise<Subscription | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock subscription data
    return {
      id: 'sub_123456',
      userId: 'user_123',
      plan: 'pro',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: '2024-01-01T00:00:00Z',
      currentPeriodEnd: '2024-02-01T00:00:00Z',
      cancelAtPeriodEnd: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
  },

  fetchUsage: async (): Promise<Usage> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      period: '2024-01',
      reports: {
        used: 25,
        limit: -1 // unlimited for pro plan
      },
      apiCalls: {
        used: 3500,
        limit: 10000
      },
      dataExports: {
        used: 12,
        limit: -1 // unlimited for pro plan
      },
      users: {
        used: 3,
        limit: 5
      }
    };
  },

  fetchInvoices: async (): Promise<Invoice[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: 'inv_001',
        subscriptionId: 'sub_123456',
        amount: 299,
        currency: 'CNY',
        status: 'paid',
        dueDate: '2024-01-01T00:00:00Z',
        paidAt: '2024-01-01T10:30:00Z',
        invoiceUrl: 'https://example.com/invoice/inv_001.pdf',
        description: '专业版月度订阅 - 2024年1月'
      },
      {
        id: 'inv_002',
        subscriptionId: 'sub_123456',
        amount: 299,
        currency: 'CNY',
        status: 'pending',
        dueDate: '2024-02-01T00:00:00Z',
        description: '专业版月度订阅 - 2024年2月'
      }
    ];
  },

  upgradePlan: async (plan: SubscriptionPlan, billingCycle: BillingCycle) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Mock upgrade success
    return { success: true };
  },

  downgradePlan: async (plan: SubscriptionPlan) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    // Mock downgrade success
    return { success: true };
  },

  cancelSubscription: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  reactivateSubscription: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  updateBillingCycle: async (billingCycle: BillingCycle) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  }
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      subscription: null,
      usage: null,
      invoices: [],
      availablePlans: mockPlans,
      isLoading: false,
      error: null,

      // Actions
      fetchSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
          const subscription = await mockApi.fetchSubscription();
          set({ subscription, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '获取订阅信息失败', 
            isLoading: false 
          });
        }
      },

      fetchUsage: async () => {
        set({ isLoading: true, error: null });
        try {
          const usage = await mockApi.fetchUsage();
          set({ usage, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '获取使用情况失败', 
            isLoading: false 
          });
        }
      },

      fetchInvoices: async () => {
        set({ isLoading: true, error: null });
        try {
          const invoices = await mockApi.fetchInvoices();
          set({ invoices, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '获取账单信息失败', 
            isLoading: false 
          });
        }
      },

      upgradePlan: async (plan: SubscriptionPlan, billingCycle: BillingCycle) => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.upgradePlan(plan, billingCycle);
          const { subscription } = get();
          if (subscription) {
            set({ 
              subscription: { 
                ...subscription, 
                plan, 
                billingCycle,
                updatedAt: new Date().toISOString()
              },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '升级订阅失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      downgradePlan: async (plan: SubscriptionPlan) => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.downgradePlan(plan);
          const { subscription } = get();
          if (subscription) {
            set({ 
              subscription: { 
                ...subscription, 
                plan,
                updatedAt: new Date().toISOString()
              },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '降级订阅失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      cancelSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.cancelSubscription();
          const { subscription } = get();
          if (subscription) {
            set({ 
              subscription: { 
                ...subscription, 
                cancelAtPeriodEnd: true,
                updatedAt: new Date().toISOString()
              },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '取消订阅失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      reactivateSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.reactivateSubscription();
          const { subscription } = get();
          if (subscription) {
            set({ 
              subscription: { 
                ...subscription, 
                cancelAtPeriodEnd: false,
                status: 'active',
                updatedAt: new Date().toISOString()
              },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '重新激活订阅失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      updateBillingCycle: async (billingCycle: BillingCycle) => {
        set({ isLoading: true, error: null });
        try {
          await mockApi.updateBillingCycle(billingCycle);
          const { subscription } = get();
          if (subscription) {
            set({ 
              subscription: { 
                ...subscription, 
                billingCycle,
                updatedAt: new Date().toISOString()
              },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '更新计费周期失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({ 
        subscription: state.subscription,
        usage: state.usage,
        invoices: state.invoices
      })
    }
  )
);