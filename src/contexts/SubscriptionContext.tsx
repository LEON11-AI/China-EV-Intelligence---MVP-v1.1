import React, { createContext, useContext, useEffect } from 'react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import type { SubscriptionPlan, SubscriptionStatus } from '../store/subscriptionStore';

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  upgradePlan: (planId: string) => Promise<void>;
  downgradePlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    subscription,
    plans,
    isLoading,
    fetchSubscription,
    fetchPlans,
    upgradePlan,
    downgradePlan,
    cancelSubscription,
    reactivateSubscription
  } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
  }, [fetchSubscription, fetchPlans]);

  const value: SubscriptionContextType = {
    subscription,
    plans,
    isLoading,
    fetchSubscription,
    fetchPlans,
    upgradePlan,
    downgradePlan,
    cancelSubscription,
    reactivateSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};