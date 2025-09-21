import express from 'express';
import authRoutes from './auth';
import subscriptionRoutes from './subscription';
import paymentRoutes from './payment';

const router = express.Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/payments', paymentRoutes);

// API documentation endpoint
router.get('/docs', (_req, res) => {
  res.json({
    success: true,
    message: 'China EV Intelligence Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password',
        'POST /api/auth/verify-email': 'Verify email address',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/me': 'Get current user profile'
      },
      subscriptions: {
        'GET /api/subscriptions/current': 'Get current user subscription',
        'GET /api/subscriptions/plans': 'Get available subscription plans',
        'POST /api/subscriptions': 'Create new subscription',
        'PUT /api/subscriptions/:id': 'Update subscription',
        'DELETE /api/subscriptions/:id': 'Cancel subscription',
        'GET /api/subscriptions/:id/usage': 'Get subscription usage',
        'GET /api/subscriptions/admin/all': 'Get all subscriptions (admin only)'
      },
      payments: {
        'POST /api/payments/create-payment-intent': 'Create payment intent',
        'POST /api/payments/confirm-payment': 'Confirm payment and create subscription',
        'POST /api/payments/create-portal-session': 'Create customer portal session',
        'POST /api/payments/webhook': 'Stripe webhook endpoint',
        'GET /api/payments/payment-methods': 'Get user payment methods',
        'GET /api/payments/history': 'Get payment history'
      }
    }
  });
});

export default router;