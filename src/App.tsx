import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import SubscriptionPlans from './pages/subscription/SubscriptionPlans';
import SubscriptionSuccess from './pages/subscription/SubscriptionSuccess';
import ManageSubscription from './pages/subscription/ManageSubscription';
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';
import Subscription from './pages/profile/Subscription';
import NotificationCenter from './pages/profile/NotificationCenter';
import Reports from './pages/intelligence/Reports';
import VehicleData from './pages/intelligence/VehicleData';
import VehicleComparison from './pages/intelligence/VehicleComparison';
import MarketTrends from './pages/intelligence/MarketTrends';
import CompetitorAnalysis from './pages/intelligence/CompetitorAnalysis';

// Placeholder for Pricing component
const Pricing: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">定价方案</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

// Placeholder components for missing profile routes


// Placeholder components for missing intelligence routes
const VehiclesList: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">车型列表</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);



function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/subscription/plans" element={<SubscriptionPlans />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Subscription Routes */}
                <Route
                  path="/subscription/success"
                  element={
                    <ProtectedRoute>
                      <SubscriptionSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription/manage"
                  element={
                    <ProtectedRoute requiresSubscription>
                      <ManageSubscription />
                    </ProtectedRoute>
                  }
                />
                
                {/* Intelligence Routes - All require subscription */}
                <Route
                  path="/intelligence/*"
                  element={
                    <ProtectedRoute requiresSubscription>
                      <IntelligenceRoutes />
                    </ProtectedRoute>
                  }
                />
                
                {/* Profile Routes */}
                <Route
                  path="/profile/*"
                  element={
                    <ProtectedRoute>
                      <ProfileRoutes />
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: '#374151',
                border: '1px solid #e5e7eb',
              },
            }}
          />
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

// Intelligence sub-routes component
const IntelligenceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/intelligence/dashboard" replace />} />
      <Route path="/dashboard" element={<IntelligenceDashboard />} />
      <Route path="/reports" element={<ReportsList />} />
      <Route path="/reports/new" element={<CreateReport />} />
      <Route path="/reports/:id" element={<ReportDetail />} />
      <Route path="/vehicles" element={<VehiclesList />} />
      <Route path="/vehicles/:id" element={<VehicleDetail />} />
      <Route path="/compare" element={<VehicleCompare />} />
      <Route path="/trends" element={<MarketTrends />} />
      <Route path="/competitors" element={<CompetitorAnalysis />} />
      <Route path="*" element={<Navigate to="/intelligence/dashboard" replace />} />
    </Routes>
  );
};

// Profile sub-routes component
const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile/settings" replace />} />
      <Route path="/settings" element={<ProfileSettings />} />
      <Route path="/activity" element={<ActivityLog />} />
      <Route path="/favorites" element={<FavoritesList />} />
      <Route path="/notifications" element={<NotificationsList />} />
      <Route path="*" element={<Navigate to="/profile/settings" replace />} />
    </Routes>
  );
};

// Placeholder components for routes that will be implemented later
const IntelligenceDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">智能分析仪表板</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const ReportsList: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">分析报告</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const CreateReport: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">创建报告</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const ReportDetail: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">报告详情</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);



const VehicleDetail: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">车型详情</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const VehicleCompare: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">车型对比</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const MarketTrends: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">市场趋势</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const CompetitorAnalysis: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">竞争对手分析</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const ProfileSettings: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">个人设置</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const ActivityLog: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">活动日志</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const FavoritesList: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">我的收藏</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

const NotificationsList: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">通知中心</h1>
        <p className="text-gray-600">此页面正在开发中...</p>
      </div>
    </div>
  </div>
);

export default App;