import { apiService } from './api';
import { SubscriptionPlan, Subscription, PaymentIntent, Invoice } from '../types';

export class SubscriptionService {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiService.get<SubscriptionPlan[]>('/subscriptions/plans');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get subscription plans');
  }

  async getCurrentSubscription(): Promise<Subscription> {
    const response = await apiService.get<Subscription>('/subscriptions/current');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get current subscription');
  }

  async createSubscription(planId: string): Promise<PaymentIntent> {
    const response = await apiService.post<PaymentIntent>('/subscriptions/create', {
      planId,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create subscription');
  }

  async updateSubscription(planId: string): Promise<Subscription> {
    const response = await apiService.put<Subscription>('/subscriptions/update', {
      planId,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update subscription');
  }

  async cancelSubscription(): Promise<{ message: string }> {
    const response = await apiService.post('/subscriptions/cancel');
    
    if (response.success) {
      return { message: response.message || 'Subscription cancelled successfully' };
    }
    
    throw new Error(response.message || 'Failed to cancel subscription');
  }

  async getInvoices(): Promise<Invoice[]> {
    const response = await apiService.get<Invoice[]>('/subscriptions/invoices');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get invoices');
  }

  async createPaymentIntent(planId: string): Promise<PaymentIntent> {
    const response = await apiService.post<PaymentIntent>('/payments/create-intent', {
      planId,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create payment intent');
  }

  async confirmPayment(paymentIntentId: string, planId: string): Promise<Subscription> {
    const response = await apiService.post<Subscription>('/payments/confirm', {
      paymentIntentId,
      planId,
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to confirm payment');
  }

  async createCustomerPortalSession(): Promise<{ url: string }> {
    const response = await apiService.post<{ url: string }>('/payments/customer-portal');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create customer portal session');
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;