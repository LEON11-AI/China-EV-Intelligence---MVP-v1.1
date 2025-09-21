import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  billingCycle: 'monthly' | 'yearly';
  amount: number; // in cents
  currency: string;
  paymentMethod?: {
    type: 'card' | 'alipay' | 'wechat';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  features: {
    maxReportsPerMonth: number;
    accessToHistoricalData: boolean;
    accessToPremiumReports: boolean;
    apiAccess: boolean;
    customAnalytics: boolean;
    prioritySupport: boolean;
    exportFormats: string[];
  };
  usage: {
    reportsViewed: number;
    lastResetDate: Date;
    apiCallsUsed: number;
    downloadCount: number;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    required: [true, 'Plan is required'],
    index: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due', 'trialing'],
    required: [true, 'Status is required'],
    default: 'active',
    index: true,
  },
  stripeCustomerId: {
    type: String,
    required: [true, 'Stripe customer ID is required'],
    index: true,
  },
  stripeSubscriptionId: {
    type: String,
    index: true,
  },
  stripePriceId: {
    type: String,
    required: [true, 'Stripe price ID is required'],
  },
  currentPeriodStart: {
    type: Date,
    required: [true, 'Current period start is required'],
  },
  currentPeriodEnd: {
    type: Date,
    required: [true, 'Current period end is required'],
    index: true,
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
  canceledAt: {
    type: Date,
    default: null,
  },
  trialStart: {
    type: Date,
    default: null,
  },
  trialEnd: {
    type: Date,
    default: null,
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: [true, 'Billing cycle is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'usd',
    uppercase: true,
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'alipay', 'wechat'],
    },
    last4: String,
    brand: String,
    expiryMonth: {
      type: Number,
      min: 1,
      max: 12,
    },
    expiryYear: {
      type: Number,
      min: new Date().getFullYear(),
    },
  },
  features: {
    maxReportsPerMonth: {
      type: Number,
      required: true,
      min: 0,
    },
    accessToHistoricalData: {
      type: Boolean,
      default: false,
    },
    accessToPremiumReports: {
      type: Boolean,
      default: false,
    },
    apiAccess: {
      type: Boolean,
      default: false,
    },
    customAnalytics: {
      type: Boolean,
      default: false,
    },
    prioritySupport: {
      type: Boolean,
      default: false,
    },
    exportFormats: [{
      type: String,
      enum: ['pdf', 'excel', 'csv', 'json'],
    }],
  },
  usage: {
    reportsViewed: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastResetDate: {
      type: Date,
      default: Date.now,
    },
    apiCallsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      delete (ret as any).__v;
      return ret;
    },
  },
});

// Indexes for performance
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ stripeCustomerId: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });
subscriptionSchema.index({ createdAt: -1 });

// Compound indexes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ plan: 1, status: 1 });

// Static method to get plan features
subscriptionSchema.statics.getPlanFeatures = function(plan: string) {
  const planFeatures = {
    free: {
      maxReportsPerMonth: 3,
      accessToHistoricalData: false,
      accessToPremiumReports: false,
      apiAccess: false,
      customAnalytics: false,
      prioritySupport: false,
      exportFormats: ['pdf'],
    },
    basic: {
      maxReportsPerMonth: 20,
      accessToHistoricalData: true,
      accessToPremiumReports: false,
      apiAccess: false,
      customAnalytics: false,
      prioritySupport: false,
      exportFormats: ['pdf', 'excel'],
    },
    premium: {
      maxReportsPerMonth: 100,
      accessToHistoricalData: true,
      accessToPremiumReports: true,
      apiAccess: true,
      customAnalytics: true,
      prioritySupport: true,
      exportFormats: ['pdf', 'excel', 'csv', 'json'],
    },
    enterprise: {
      maxReportsPerMonth: -1, // unlimited
      accessToHistoricalData: true,
      accessToPremiumReports: true,
      apiAccess: true,
      customAnalytics: true,
      prioritySupport: true,
      exportFormats: ['pdf', 'excel', 'csv', 'json'],
    },
  };
  
  return planFeatures[plan as keyof typeof planFeatures] || planFeatures.free;
};

// Instance method to check if subscription is active
subscriptionSchema.methods.isActive = function(this: ISubscription): boolean {
  return this.status === 'active' && new Date() < this.currentPeriodEnd;
};

// Instance method to check if subscription is in trial
subscriptionSchema.methods.isInTrial = function(this: ISubscription): boolean {
  return this.status === 'trialing' && 
         !!this.trialEnd && 
         new Date() < this.trialEnd;
};

// Instance method to check usage limits
subscriptionSchema.methods.canAccessReport = function(this: ISubscription): boolean {
  if (this.features.maxReportsPerMonth === -1) return true; // unlimited
  return this.usage.reportsViewed < this.features.maxReportsPerMonth;
};

// Instance method to increment usage
subscriptionSchema.methods.incrementUsage = function(this: ISubscription, type: 'report' | 'api' | 'download'): Promise<ISubscription> {
  const updates: any = {};
  
  switch (type) {
    case 'report':
      updates['usage.reportsViewed'] = this.usage.reportsViewed + 1;
      break;
    case 'api':
      updates['usage.apiCallsUsed'] = this.usage.apiCallsUsed + 1;
      break;
    case 'download':
      updates['usage.downloadCount'] = this.usage.downloadCount + 1;
      break;
  }
  
  return this.updateOne({ $set: updates }).exec();
};

// Instance method to reset monthly usage
subscriptionSchema.methods.resetMonthlyUsage = function(this: ISubscription): Promise<ISubscription> {
  return this.updateOne({
    $set: {
      'usage.reportsViewed': 0,
      'usage.apiCallsUsed': 0,
      'usage.downloadCount': 0,
      'usage.lastResetDate': new Date(),
    },
  }).exec();
};

// Pre-save middleware to set features based on plan
subscriptionSchema.pre('save', function(this: ISubscription, next) {
  if (this.isModified('plan')) {
    const planFeatures = (this.constructor as any).getPlanFeatures(this.plan);
    this.features = { ...this.features, ...planFeatures };
  }
  next();
});

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;