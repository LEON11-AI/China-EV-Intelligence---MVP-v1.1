import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import Subscription from '../models/Subscription';
import User from '../models/User';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../utils/AppError';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Create payment intent
router.post('/create-payment-intent', [
  authenticate,
  body('planId').isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid plan ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.validation('Validation failed', errors.array());
  }

  const { planId } = req.body;
  const userId = req.user!._id;

  // Plan pricing
  const planPrices: { [key: string]: number } = {
    basic: 9900, // 99 CNY in cents
    professional: 29900, // 299 CNY in cents
    enterprise: 99900 // 999 CNY in cents
  };

  const amount = planPrices[planId];
  if (!amount) {
    throw new AppError('Invalid plan selected', 400);
  }

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cny',
      metadata: {
        userId: userId.toString(),
        planId
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error: any) {
    throw new AppError(`Payment intent creation failed: ${error.message}`, 500);
  }
}));

// Confirm payment and create subscription
router.post('/confirm-payment', [
  authenticate,
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('planId').isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid plan ID')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.validation('Validation failed', errors.array());
  }

  const { paymentIntentId, planId } = req.body;
  const userId = req.user!._id;

  try {
    // Retrieve payment intent to verify payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment not completed', 400);
    }

    // Verify metadata matches
    if (paymentIntent.metadata.userId !== userId.toString() || 
        paymentIntent.metadata.planId !== planId) {
      throw new AppError('Payment verification failed', 400);
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({ 
      userId, 
      status: { $in: ['active', 'trialing'] } 
    });

    if (existingSubscription) {
      throw new AppError('User already has an active subscription', 400);
    }

    // Create subscription
    const subscription = new Subscription({
      userId,
      plan: planId,
      status: 'active',
      stripeCustomerId: 'temp_customer_id', // Would be actual Stripe customer ID
      stripePriceId: 'temp_price_id', // Would be actual Stripe price ID
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      billingCycle: 'monthly',
      amount: planId === 'basic' ? 9900 : planId === 'premium' ? 29900 : 99900, // in cents
      currency: 'CNY',
      features: {
        maxReportsPerMonth: planId === 'basic' ? 10 : planId === 'premium' ? 50 : 999,
        accessToHistoricalData: planId !== 'basic',
        accessToPremiumReports: planId === 'premium' || planId === 'enterprise',
        apiAccess: planId === 'enterprise',
        customAnalytics: planId === 'enterprise',
        prioritySupport: planId === 'premium' || planId === 'enterprise',
        exportFormats: planId === 'basic' ? ['pdf'] : planId === 'premium' ? ['pdf', 'excel'] : ['pdf', 'excel', 'csv', 'json']
      },
      usage: {
        reportsViewed: 0,
        lastResetDate: new Date(),
        apiCallsUsed: 0,
        downloadCount: 0
      },
      paymentMethod: {
        type: 'card',
        last4: '****', // Would be populated from Stripe payment method
        brand: 'unknown'
      }
    });

    await subscription.save();

    // Update user subscription reference
    await User.findByIdAndUpdate(userId, { 
      subscription: subscription._id
    });

    res.json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Payment confirmation failed: ${error.message}`, 500);
  }
}));

// Create customer portal session
router.post('/create-portal-session', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!._id;
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  try {
    // In a real implementation, you would store Stripe customer ID in user model
    // For now, we'll create a mock portal URL
    const portalUrl = `${process.env.FRONTEND_URL}/dashboard/subscription`;

    res.json({
      success: true,
      data: {
        url: portalUrl
      }
    });
  } catch (error: any) {
    throw new AppError(`Portal session creation failed: ${error.message}`, 500);
  }
}));

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      // Handle successful payment
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice payment succeeded:', invoice.id);
      // Handle successful subscription payment
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.log('Invoice payment failed:', failedInvoice.id);
      // Handle failed subscription payment
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      console.log('Subscription deleted:', deletedSubscription.id);
      // Handle subscription cancellation
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.json({ received: true });
}));

// Get payment methods
router.get('/payment-methods', authenticate, asyncHandler(async (_req, res) => {
  // In a real implementation, you would retrieve payment methods from Stripe
  // For now, return mock data
  const paymentMethods = [
    {
      id: 'pm_mock_card',
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      }
    }
  ];

  res.json({
    success: true,
    data: paymentMethods
  });
}));

// Get payment history
router.get('/history', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user!._id;
  
  // Get user's subscriptions with payment history
  const subscriptions = await Subscription.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);

  const paymentHistory = subscriptions.map(sub => ({
    id: sub._id,
    amount: sub.plan === 'basic' ? 99 : sub.plan === 'premium' ? 299 : 999,
    currency: 'CNY',
    status: 'succeeded',
    date: sub.createdAt,
    description: `${sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} Plan Subscription`,
    paymentMethod: sub.paymentMethod
  }));

  res.json({
    success: true,
    data: paymentHistory
  });
}));

export default router;