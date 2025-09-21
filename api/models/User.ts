import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  position?: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'premium';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
  preferences: {
    language: 'zh' | 'en';
    notifications: {
      email: boolean;
      newReports: boolean;
      marketUpdates: boolean;
      subscriptionUpdates: boolean;
    };
    dashboard: {
      favoriteModels: string[];
      watchedBrands: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incLoginAttempts(): Promise<IUser>;
  resetLoginAttempts(): Promise<IUser>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters'],
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user',
    index: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
    index: true,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  emailVerificationExpires: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    select: false,
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'active',
    },
    stripeCustomerId: {
      type: String,
      select: false,
    },
    stripeSubscriptionId: {
      type: String,
      select: false,
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  preferences: {
    language: {
      type: String,
      enum: ['zh', 'en'],
      default: 'zh',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      newReports: {
        type: Boolean,
        default: true,
      },
      marketUpdates: {
        type: Boolean,
        default: true,
      },
      subscriptionUpdates: {
        type: Boolean,
        default: true,
      },
    },
    dashboard: {
      favoriteModels: [{
        type: String,
        trim: true,
      }],
      watchedBrands: [{
        type: String,
        trim: true,
      }],
    },
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      const obj = ret as any;
      delete obj.password;
      delete obj.emailVerificationToken;
      delete obj.emailVerificationExpires;
      delete obj.passwordResetToken;
      delete obj.passwordResetExpires;
      delete obj.lockUntil;
      delete obj.__v;
      return obj;
    },
  },
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });

// Constants for account locking
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Note: isLocked is implemented as an instance method below

// Pre-save middleware to hash password
userSchema.pre('save', async function(this: IUser, next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to check if account is locked
userSchema.methods.isLocked = function(this: IUser): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function(this: IUser): Promise<IUser> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    }).exec();
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }
  
  return this.updateOne(updates).exec();
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function(this: IUser): Promise<IUser> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  }).exec();
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;