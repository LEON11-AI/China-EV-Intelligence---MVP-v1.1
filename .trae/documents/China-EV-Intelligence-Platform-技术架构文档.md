# China EV Intelligence Platform - 技术架构文档

## 1. 架构设计

```mermaid
graph TD
    A[用户浏览器] --> B[Nginx负载均衡器]
    B --> C[React前端应用]
    B --> D[Node.js后端API服务]
    D --> E[MongoDB主数据库]
    D --> F[Redis缓存层]
    D --> G[Stripe支付服务]
    D --> H[SendGrid邮件服务]
    D --> I[文件存储服务]
    
    subgraph "前端层"
        C
    end
    
    subgraph "后端服务层"
        D
        F
    end
    
    subgraph "数据存储层"
        E
        I
    end
    
    subgraph "外部服务层"
        G
        H
    end
```

## 2. 技术描述

* **前端**: React\@18 + TypeScript\@5 + Tailwind CSS\@3 + Vite\@5 + React Router\@6

* **后端**: Node.js\@20 + Express\@4 + TypeScript\@5 + Mongoose\@8

* **数据库**: MongoDB\@7 + Redis\@7

* **认证**: JWT + bcrypt + express-rate-limit

* **支付**: Stripe API\@14

* **邮件**: SendGrid API\@7

* **部署**: Docker + PM2 + Nginx

## 3. 路由定义

### 3.1 前端路由

| 路由                          | 用途             |
| --------------------------- | -------------- |
| /                           | 首页，展示最新情报和平台特色 |
| /auth/register              | 用户注册页面         |
| /auth/login                 | 用户登录页面         |
| /auth/forgot-password       | 忘记密码页面         |
| /auth/reset-password/:token | 密码重置页面         |
| /auth/verify-email/:token   | 邮箱验证页面         |
| /dashboard                  | 用户中心主页         |
| /dashboard/profile          | 个人信息管理         |
| /dashboard/subscription     | 订阅管理页面         |
| /dashboard/billing          | 账单历史页面         |
| /pricing                    | 套餐选择页面         |
| /checkout/:planId           | 支付结账页面         |
| /intelligence               | 情报列表页面         |
| /intelligence/:id           | 情报详情页面         |
| /database                   | 车型数据库页面        |
| /database/:id               | 车型详情页面         |
| /admin                      | 管理后台入口         |
| /admin/content              | 内容管理页面         |
| /admin/users                | 用户管理页面         |
| /admin/analytics            | 数据分析页面         |

### 3.2 后端API路由

| 路由                          | 方法              | 用途        |
| --------------------------- | --------------- | --------- |
| /api/auth/register          | POST            | 用户注册      |
| /api/auth/login             | POST            | 用户登录      |
| /api/auth/logout            | POST            | 用户登出      |
| /api/auth/refresh           | POST            | 刷新访问令牌    |
| /api/auth/forgot-password   | POST            | 发送密码重置邮件  |
| /api/auth/reset-password    | POST            | 重置密码      |
| /api/auth/verify-email      | POST            | 验证邮箱      |
| /api/users/profile          | GET/PUT         | 获取/更新用户信息 |
| /api/users/change-password  | PUT             | 修改密码      |
| /api/subscriptions/plans    | GET             | 获取订阅套餐    |
| /api/subscriptions/current  | GET             | 获取当前订阅    |
| /api/subscriptions/create   | POST            | 创建订阅      |
| /api/subscriptions/cancel   | POST            | 取消订阅      |
| /api/subscriptions/invoices | GET             | 获取账单历史    |
| /api/intelligence           | GET             | 获取情报列表    |
| /api/intelligence/:id       | GET             | 获取情报详情    |
| /api/models                 | GET             | 获取车型列表    |
| /api/models/:id             | GET             | 获取车型详情    |
| /api/admin/intelligence     | POST/PUT/DELETE | 管理情报内容    |
| /api/admin/models           | POST/PUT/DELETE | 管理车型数据    |
| /api/admin/users            | GET/PUT         | 管理用户      |
| /api/admin/analytics        | GET             | 获取分析数据    |

## 4. API定义

### 4.1 认证API

**用户注册**

```
POST /api/auth/register
```

请求:

| 参数名          | 参数类型    | 是否必填 | 描述                 |
| ------------ | ------- | ---- | ------------------ |
| email        | string  | 是    | 用户邮箱地址             |
| password     | string  | 是    | 密码(8-128位，包含字母和数字) |
| firstName    | string  | 是    | 名字(2-50位)          |
| lastName     | string  | 是    | 姓氏(2-50位)          |
| company      | string  | 否    | 公司名称(最多100位)       |
| agreeToTerms | boolean | 是    | 同意服务条款             |

响应:

| 参数名     | 参数类型    | 描述     |
| ------- | ------- | ------ |
| success | boolean | 请求是否成功 |
| message | string  | 响应消息   |
| data    | object  | 用户数据   |

示例:

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Tesla Inc",
  "agreeToTerms": true
}
```

**用户登录**

```
POST /api/auth/login
```

请求:

| 参数名        | 参数类型    | 是否必填 | 描述       |
| ---------- | ------- | ---- | -------- |
| email      | string  | 是    | 用户邮箱地址   |
| password   | string  | 是    | 用户密码     |
| rememberMe | boolean | 否    | 是否记住登录状态 |

响应:

| 参数名     | 参数类型    | 描述          |
| ------- | ------- | ----------- |
| success | boolean | 登录是否成功      |
| data    | object  | 包含访问令牌和用户信息 |

示例:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "company": "Tesla Inc",
      "emailVerified": true,
      "subscription": {
        "plan": "pro",
        "status": "active",
        "endDate": "2024-12-31T23:59:59.999Z"
      }
    }
  }
}
```

### 4.2 订阅管理API

**获取订阅套餐**

```
GET /api/subscriptions/plans
```

响应:

| 参数名     | 参数类型    | 描述     |
| ------- | ------- | ------ |
| success | boolean | 请求是否成功 |
| data    | array   | 套餐列表   |

示例:

```json
{
  "success": true,
  "data": [
    {
      "id": "free",
      "name": "免费套餐",
      "price": 0,
      "currency": "USD",
      "interval": "month",
      "features": [
        "基础车型数据访问",
        "每月3篇情报摘要",
        "社区支持"
      ],
      "limits": {
        "intelligencePerMonth": 3,
        "modelDataAccess": "basic",
        "dataExport": false
      }
    },
    {
      "id": "pro",
      "name": "专业套餐",
      "price": 49,
      "currency": "USD",
      "interval": "month",
      "stripePriceId": "price_1234567890",
      "features": [
        "完整车型规格数据",
        "无限情报报告访问",
        "实时数据更新",
        "CEO洞察分析",
        "数据导出功能",
        "优先客服支持"
      ],
      "limits": {
        "intelligencePerMonth": -1,
        "modelDataAccess": "full",
        "dataExport": true
      }
    }
  ]
}
```

**创建订阅**

```
POST /api/subscriptions/create
```

请求:

| 参数名             | 参数类型   | 是否必填 | 描述           |
| --------------- | ------ | ---- | ------------ |
| planId          | string | 是    | 套餐ID         |
| paymentMethodId | string | 是    | Stripe支付方式ID |

响应:

| 参数名     | 参数类型    | 描述     |
| ------- | ------- | ------ |
| success | boolean | 创建是否成功 |
| data    | object  | 订阅信息   |

### 4.3 内容管理API

**获取情报列表**

```
GET /api/intelligence?page=1&limit=10&brand=BYD&isPro=false
```

查询参数:

| 参数名       | 参数类型    | 是否必填 | 描述                |
| --------- | ------- | ---- | ----------------- |
| page      | number  | 否    | 页码(默认1)           |
| limit     | number  | 否    | 每页数量(默认10，最大50)   |
| brand     | string  | 否    | 品牌筛选              |
| isPro     | boolean | 否    | 是否仅显示付费内容         |
| search    | string  | 否    | 搜索关键词             |
| sortBy    | string  | 否    | 排序字段(date, views) |
| sortOrder | string  | 否    | 排序方向(asc, desc)   |

响应:

| 参数名     | 参数类型    | 描述     |
| ------- | ------- | ------ |
| success | boolean | 请求是否成功 |
| data    | object  | 分页数据   |

示例:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "VC-IR-2025-001",
        "title": "The Age of Great Voyages: Why I Believe China's Electric Vehicle Global Expedition Has Just Begun",
        "summary": "A new Age of Great Voyages is unfolding...",
        "brand": "BYD",
        "model": "",
        "isPro": false,
        "publishDate": "2025-01-08T00:00:00.000Z",
        "author": {
          "name": "Leon",
          "title": "Chief Experience Officer"
        },
        "tags": ["market-analysis", "global-expansion"],
        "viewCount": 1250,
        "readTime": 15
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 5. 服务器架构图

```mermaid
graph TD
    A[客户端请求] --> B[Nginx反向代理]
    B --> C[负载均衡器]
    C --> D[Node.js应用实例1]
    C --> E[Node.js应用实例2]
    C --> F[Node.js应用实例N]
    
    D --> G[认证中间件]
    E --> G
    F --> G
    
    G --> H[业务逻辑层]
    H --> I[数据访问层]
    I --> J[(MongoDB集群)]
    I --> K[(Redis集群)]
    
    H --> L[外部服务层]
    L --> M[Stripe API]
    L --> N[SendGrid API]
    L --> O[文件存储服务]
    
    subgraph "应用服务器"
        D
        E
        F
    end
    
    subgraph "中间件层"
        G
        H
        I
    end
    
    subgraph "数据存储"
        J
        K
    end
    
    subgraph "外部服务"
        M
        N
        O
    end
```

## 6. 数据模型

### 6.1 数据模型定义

```mermaid
erDiagram
    USER ||--o{ SUBSCRIPTION : has
    USER ||--o{ INTELLIGENCE_VIEW : views
    USER ||--o{ MODEL_VIEW : views
    SUBSCRIPTION ||--|| PLAN : references
    INTELLIGENCE ||--o{ INTELLIGENCE_VIEW : viewed_by
    MODEL ||--o{ MODEL_VIEW : viewed_by
    BRAND ||--o{ MODEL : manufactures
    USER ||--o{ PAYMENT : makes
    SUBSCRIPTION ||--o{ PAYMENT : paid_by
    
    USER {
        ObjectId _id PK
        string email UK
        string passwordHash
        string firstName
        string lastName
        string company
        boolean emailVerified
        string emailVerificationToken
        string passwordResetToken
        Date passwordResetExpires
        string role
        object preferences
        Date lastLoginAt
        string lastLoginIP
        Date createdAt
        Date updatedAt
    }
    
    SUBSCRIPTION {
        ObjectId _id PK
        ObjectId userId FK
        string planId
        string status
        Date startDate
        Date endDate
        Date nextBillingDate
        string stripeSubscriptionId
        string stripeCustomerId
        object metadata
        Date createdAt
        Date updatedAt
    }
    
    PLAN {
        string _id PK
        string name
        string description
        number price
        string currency
        string interval
        array features
        object limits
        string stripePriceId
        boolean active
        number sortOrder
        Date createdAt
        Date updatedAt
    }
    
    INTELLIGENCE {
        string _id PK
        object title
        object summary
        string content
        string brand
        string model
        boolean isPro
        Date publishDate
        ObjectId authorId FK
        array tags
        string status
        object seo
        number viewCount
        number readTime
        array images
        Date createdAt
        Date updatedAt
    }
    
    MODEL {
        string _id PK
        string brand
        string modelName
        string subtitle
        string status
        object keySpecs
        object fullSpecs
        object marketPlan
        array images
        string youtubeId
        string ceoNote
        object seo
        number viewCount
        Date createdAt
        Date updatedAt
    }
    
    BRAND {
        string _id PK
        string name
        string chineseName
        string description
        string logo
        string website
        string country
        Date foundedYear
        boolean active
        number sortOrder
        Date createdAt
        Date updatedAt
    }
    
    INTELLIGENCE_VIEW {
        ObjectId _id PK
        ObjectId userId FK
        string intelligenceId FK
        Date viewedAt
        string userAgent
        string ipAddress
        number readDuration
        number scrollDepth
    }
    
    MODEL_VIEW {
        ObjectId _id PK
        ObjectId userId FK
        string modelId FK
        Date viewedAt
        string userAgent
        string ipAddress
        array sectionsViewed
    }
    
    PAYMENT {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId subscriptionId FK
        string stripePaymentIntentId
        number amount
        string currency
        string status
        string description
        object metadata
        Date createdAt
        Date updatedAt
    }
```

### 6.2 数据定义语言

**用户表 (users)**

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '请输入有效的邮箱地址'
    }
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 60 // bcrypt哈希长度
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    sparse: true
  },
  passwordResetToken: {
    type: String,
    sparse: true
  },
  passwordResetExpires: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'zh-Hant', 'zh-Hans'],
      default: 'en'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    }
  },
  lastLoginAt: {
    type: Date
  },
  lastLoginIP: {
    type: String
  }
}, {
  timestamps: true
});

// 索引
userSchema.index({ email: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLoginAt: -1 });

// 虚拟字段
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// 中间件
userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.emailVerified = false;
  }
  next();
});
```

**订阅表 (subscriptions)**

```javascript
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    required: true,
    ref: 'Plan'
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  nextBillingDate: {
    type: Date
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripeCustomerId: {
    type: String,
    required: function() {
      return this.planId !== 'free';
    }
  },
  metadata: {
    cancelReason: String,
    canceledAt: Date,
    trialEnd: Date,
    promoCode: String
  }
}, {
  timestamps: true
});

// 索引
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });

// 中间件
subscriptionSchema.pre('save', function(next) {
  if (this.isNew && this.planId === 'free') {
    // 免费套餐设置为永不过期
    this.endDate = new Date('2099-12-31');
  }
  next();
});
```

**情报表 (intelligence)**

```javascript
const intelligenceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^VC-IR-\d{4}-\d{3}$/.test(v);
      },
      message: 'ID格式应为: VC-IR-YYYY-XXX'
    }
  },
  title: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(v) {
        if (typeof v === 'string') return v.length > 0;
        if (typeof v === 'object') {
          return v.en && v.en.length > 0;
        }
        return false;
      },
      message: '标题不能为空'
    }
  },
  summary: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  content: {
    type: String,
    required: true,
    minlength: 100
  },
  brand: {
    type: String,
    trim: true,
    ref: 'Brand'
  },
  model: {
    type: String,
    trim: true
  },
  isPro: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  readTime: {
    type: Number, // 预估阅读时间(分钟)
    default: 5
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }]
}, {
  timestamps: true
});

// 索引
intelligenceSchema.index({ publishDate: -1 });
intelligenceSchema.index({ brand: 1 });
intelligenceSchema.index({ isPro: 1 });
intelligenceSchema.index({ status: 1 });
intelligenceSchema.index({ tags: 1 });
intelligenceSchema.index({ authorId: 1 });
intelligenceSchema.index({ viewCount: -1 });
intelligenceSchema.index({ 'seo.slug': 1 });

// 文本搜索索引
intelligenceSchema.index({
  '$**': 'text'
}, {
  weights: {
    'title.en': 10,
    'title.zh-Hant': 10,
    'summary.en': 5,
    'summary.zh-Hant': 5,
    'tags': 3,
    'brand': 2
  }
});

// 虚拟字段
intelligenceSchema.virtual('url').get(function() {
  return `/intelligence/${this._id}`;
});

// 中间件
intelligenceSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // 自动计算阅读时间(假设每分钟200字)
    const wordCount = this.content.replace(/<[^>]*>/g, '').length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  if (this.isModified('title') && !this.seo.slug) {
    // 自动生成SEO友好的slug
    const title = typeof this.title === 'string' ? this.title : this.title.en;
    this.seo.slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
  
  next();
});
```

**初始化数据**

```javascript
// 创建默认套餐
const defaultPlans = [
  {
    _id: 'free',
    name: '免费套餐',
    description: '适合个人用户了解基础信息',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '基础车型数据访问',
      '每月3篇情报摘要',
      '社区支持'
    ],
    limits: {
      intelligencePerMonth: 3,
      modelDataAccess: 'basic',
      dataExport: false,
      apiCalls: 100
    },
    active: true,
    sortOrder: 1
  },
  {
    _id: 'pro',
    name: '专业套餐',
    description: '适合行业专业人士和企业用户',
    price: 49,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_1234567890',
    features: [
      '完整车型规格数据',
      '无限情报报告访问',
      '实时数据更新',
      'CEO洞察分析',
      '数据导出功能',
      '优先客服支持',
      'API访问权限'
    ],
    limits: {
      intelligencePerMonth: -1, // 无限制
      modelDataAccess: 'full',
      dataExport: true,
      apiCalls: 10000
    },
    active: true,
    sortOrder: 2
  }
];

// 创建默认品牌
const defaultBrands = [
  {
    _id: 'BYD',
    name: 'BYD',
    chineseName: '比亚迪',
    description: '中国领先的新能源汽车制造商',
    logo: '/images/logo-byd.png',
    website: 'https://www.byd.com',
    country: 'China',
    foundedYear: new Date('1995-01-01'),
    active: true,
    sortOrder: 1
  },
  {
    _id: 'NIO',
    name: 'NIO',
    chineseName: '蔚来',
    description: '智能电动汽车品牌',
    logo: '/images/logo-nio.png',
    website: 'https://www.nio.com',
    country: 'China',
    foundedYear: new Date('2014-01-01'),
    active: true,
    sortOrder: 2
  },
  {
    _id: 'XPeng',
    name: 'XPeng',
    chineseName: '小鹏汽车',
    description: '智能汽车设计及制造商',
    logo: '/images/logo-xpeng.png',
    website: 'https://www.xiaopeng.com',
    country: 'China',
    foundedYear: new Date('2014-01-01'),
    active: true,
    sortOrder: 3
  }
];

// 数据库初始化脚本
db.plans.insertMany(defaultPlans);
db.brands.insertMany(defaultBrands);

// 创建管理员用户
db.users.insertOne({
  email: 'admin@voltchina.net',
  passwordHash: '$2b$12$...', // 需要预先哈希
  firstName: 'Admin',
  lastName: 'User',
  emailVerified: true,
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 7. 安全配置

### 7.1 环境变量配置

```bash
# .env.production
NODE_ENV=production
PORT=3000

# 数据库配置
MONGODB_URI=mongodb://username:password@localhost:27017/voltchina
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# 加密配置
ENCRYPTION_KEY=your-32-character-encryption-key
BCRYPT_ROUNDS=12

# 外部服务配置
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@voltchina.net

# 应用配置
APP_URL=https://voltchina.net
FRONTEND_URL=https://voltchina.net
ADMIN_EMAIL=admin@voltchina.net

# 安全配置
CORS_ORIGIN=https://voltchina.net
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 文件上传配置
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp
```

### 7.2 安全中间件配置

```javascript
// security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// 安全头设置
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// 速率限制
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    error: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// 特殊端点的严格限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 最多5次尝试
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// 数据清理
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
```

这个技术架构文档为China EV Intelligence Platform的升级提供了完整的技术实现方案，涵盖了后端服务、用户认证和订阅管理三个核心功能的详细设计。
