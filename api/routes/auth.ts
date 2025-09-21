import express from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Company name cannot exceed 100 characters'),
    body('position')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Position cannot exceed 100 characters'),
    body('phone')
      .optional()
      .matches(/^[+]?[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid phone number'),
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw AppError.validation('Validation failed', errors.mapped());
    }

    const { email, password, firstName, lastName, company, position, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw AppError.conflict('User with this email already exists');
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      company,
      position,
      phone,
      emailVerificationToken,
      emailVerificationExpires,
      subscription: {
        plan: 'free',
        status: 'active',
      },
    });

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Remove sensitive data from response
    const userResponse = user.toJSON() as any;
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email address.',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw AppError.validation('Validation failed', errors.mapped());
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw AppError.authentication('Invalid email or password');
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new AppError('Account is temporarily locked due to too many failed login attempts', 423);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      throw AppError.authentication('Invalid email or password');
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Remove sensitive data from response
    const userResponse = user.toJSON() as any;
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  })
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw AppError.validation('Validation failed', errors.mapped());
    }

    const { refreshToken } = req.body;

    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      
      // Find user
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        throw AppError.authentication('Invalid refresh token');
      }

      // Check if account is locked
      if (user.isLocked()) {
        throw new AppError('Account is temporarily locked', 423);
      }

      // Generate new access token
      const accessToken = generateToken(user);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      throw AppError.authentication('Invalid refresh token');
    }
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw AppError.validation('Validation failed', errors.mapped());
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists or not
      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save();

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    res.json({
      success: true,
      message: 'Password reset link has been sent to your email.',
      ...(process.env.NODE_ENV === 'development' && {
        resetToken, // Only for development
      }),
    });
  })
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post(
  '/reset-password',
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw AppError.validation('Validation failed', errors.mapped());
    }

    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw AppError.authentication('Invalid or expired reset token');
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = null as any;
    user.passwordResetExpires = null as any;
    user.loginAttempts = 0;
    user.lockUntil = null as any;
    
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  })
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post(
  '/verify-email',
  [
    body('token')
      .notEmpty()
      .withMessage('Verification token is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw AppError.validation('Validation failed', errors.mapped());
    }

    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      throw AppError.authentication('Invalid or expired verification token');
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = null as any;
    user.emailVerificationExpires = null as any;
    
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully.',
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (_req, res) => {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from storage
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!._id).populate('subscription');
    
    res.json({
      success: true,
      data: {
        user,
      },
    });
  })
);

export default router;