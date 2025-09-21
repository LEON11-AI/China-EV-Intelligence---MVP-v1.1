// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  emailVerified: boolean;
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface Subscription {
  id?: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  startDate: string;
  endDate: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  stripePriceId: string;
}

// Intelligence types
export interface Intelligence {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  isPremium: boolean;
  imageUrl?: string;
  readTime: number;
}

// Vehicle Model types
export interface VehicleModel {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: 'BEV' | 'PHEV' | 'HEV';
  price: {
    min: number;
    max: number;
    currency: string;
  };
  specifications: {
    range: number;
    batteryCapacity: number;
    chargingTime: number;
    topSpeed: number;
    acceleration: number;
  };
  images: string[];
  description: string;
  features: string[];
  availability: {
    regions: string[];
    status: 'available' | 'coming_soon' | 'discontinued';
  };
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Payment types
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  downloadUrl: string;
  description: string;
}

// Form types
export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  [key: string]: boolean;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export interface SubscriptionContextType {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  createSubscription: (planId: string) => Promise<PaymentIntent>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (planId: string) => Promise<void>;
  getInvoices: () => Promise<Invoice[]>;
}