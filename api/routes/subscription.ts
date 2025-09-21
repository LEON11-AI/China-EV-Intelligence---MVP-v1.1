import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Subscription from '../models/Subscription';
import User from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../utils/AppError';

const router = express.Router();

// Get current user's subscription
router.get('/current', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!._id;

  const subscription = await Subscription.findOne({ 
    userId, 
    status: { $in: ['active', 'trialing'] } 
  }).populate('userId', 'email name');

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: 'No active subscription found'
    });
  }

  return res.json({
    success: true,
    data: subscription
  });
}));

// Get all subscription plans
router.get('/plans', asyncHandler(async (_req, res) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 99,
      currency: 'CNY',
      interval: 'month',
      features: {
        dataAccess: true,
        apiCalls: 1000,
        reports: 5,
        support: 'email'
      },
      description: 'Perfect for individual researchers and small teams'
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 299,
      currency: 'CNY',
      interval: 'month',
      features: {
        dataAccess: true,
        apiCalls: 5000,
        reports: 20,
        support: 'priority',
        customReports: true
      },
      description: 'Ideal for growing businesses and research institutions'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 999,
      currency: 'CNY',
      interval: 'month',
      features: {
        dataAccess: true,
        apiCalls: 50000,
        reports: 100,
        support: 'dedicated',
        customReports: true,
        whiteLabel: true,
        apiAccess: true
      },
      description: 'Complete solution for large enterprises'
    }
  ];

  res.json({
    success: true,
    data: plans
  });
}));

// Create subscription
router.post('/', [
  authenticate,
  body('planId').isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid plan ID'),
  body('paymentMethodId').notEmpty().withMessage('Payment method is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.validation('Validation failed', errors.array());
  }

  const { plan } = req.body;
  const userId = req.user!._id;

  // Check if user already has an active subscription
  const existingSubscription = await Subscription.findOne({ 
    userId, 
    status: { $in: ['active', 'trialing'] } 
  });

  if (existingSubscription) {
    throw new AppError('User already has an active subscription', 400);
  }

  // Create new subscription
  const subscription = new Subscription({
    userId,
    plan,
    status: 'active',
    stripeCustomerId: 'temp_customer_id', // This would come from Stripe
    stripePriceId: 'temp_price_id', // This would come from Stripe
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    billingCycle: 'monthly',
    amount: 0,
    currency: 'USD',
    features: {
      maxReportsPerMonth: 10,
      accessToHistoricalData: false,
      accessToPremiumReports: false,
      apiAccess: false,
      customAnalytics: false,
      prioritySupport: false,
      exportFormats: ['pdf']
    },
    paymentMethod: {
      type: 'card',
      last4: '****', // This would come from Stripe
      brand: 'visa' // This would come from Stripe
    }
  });

  await subscription.save();

  // Update user subscription reference
  await User.findByIdAndUpdate(userId, { 
    subscription: subscription._id
  });

  res.status(201).json({
    success: true,
    message: 'Subscription created successfully',
    data: subscription
  });
}));

// Update subscription
router.put('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid subscription ID'),
  body('plan').optional().isIn(['basic', 'premium', 'enterprise']).withMessage('Invalid plan')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.validation('Validation failed', errors.array());
  }

  const { id } = req.params;
  const { plan } = req.body;
  const userId = req.user!._id;

  const subscription = await Subscription.findOne({ _id: id, userId });
  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }

  if (plan && plan !== subscription.plan) {
    subscription.plan = plan;
    subscription.updatedAt = new Date();
    await subscription.save();
  }

  res.json({
    success: true,
    message: 'Subscription updated successfully',
    data: subscription
  });
}));

// Cancel subscription
router.delete('/:id', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid subscription ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.validation('Validation failed', errors.array());
  }

  const { id } = req.params;
  const userId = req.user!._id;

  const subscription = await Subscription.findOne({ _id: id, userId });
  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }

  subscription.status = 'cancelled';
  subscription.canceledAt = new Date();
  subscription.updatedAt = new Date();
  await subscription.save();

  // Note: User model update would be handled here if needed

  res.json({
    success: true,
    message: 'Subscription canceled successfully',
    data: subscription
  });
}));

// Get subscription usage
router.get('/:id/usage', [
  authenticate,
  param('id').isMongoId().withMessage('Invalid subscription ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.validation('Validation failed', errors.array());
  }

  const { id } = req.params;
  const userId = req.user!._id;

  const subscription = await Subscription.findOne({ _id: id, userId });
  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }

  const usage = {
    apiCalls: {
      used: subscription.usage.apiCallsUsed,
      limit: subscription.features.maxReportsPerMonth,
      percentage: Math.round((subscription.usage.apiCallsUsed / subscription.features.maxReportsPerMonth) * 100)
    },
    reports: {
      used: subscription.usage.reportsViewed,
      limit: subscription.features.maxReportsPerMonth,
      percentage: Math.round((subscription.usage.reportsViewed / subscription.features.maxReportsPerMonth) * 100)
    },
    period: {
      start: subscription.currentPeriodStart,
      end: subscription.currentPeriodEnd
    }
  };

  res.json({
    success: true,
    data: usage
  });
}));

// Admin: Get all subscriptions
router.get('/admin/all', [
  authenticate,
  authorize('admin'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'canceled', 'past_due', 'trialing']).withMessage('Invalid status')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.validation('Validation failed', errors.array());
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;

  const filter: any = {};
  if (status) {
    filter.status = status;
  }

  const subscriptions = await Subscription.find(filter)
    .populate('userId', 'email name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await Subscription.countDocuments(filter);

  res.json({
    success: true,
    data: {
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

export default router;