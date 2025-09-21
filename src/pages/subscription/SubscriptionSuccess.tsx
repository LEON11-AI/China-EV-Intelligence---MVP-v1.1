import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { CheckCircle, ArrowRight, Download, Calendar, CreditCard } from 'lucide-react';
import { SubscriptionPlan } from '../../types';

const SubscriptionSuccess: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { subscription, loadSubscriptionPlans } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlanDetails = async () => {
      if (!subscription) {
        navigate('/subscription');
        return;
      }

      try {
        const plans = await loadSubscriptionPlans();
        const plan = plans.find(p => p.id === subscription.planId);
        setCurrentPlan(plan || null);
      } catch (error) {
        console.error('Failed to load plan details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanDetails();
  }, [subscription, loadSubscriptionPlans, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载订阅信息...</p>
        </div>
      </div>
    );
  }

  if (!subscription || !currentPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">未找到订阅信息</p>
          <Link to="/subscription">
            <Button className="mt-4">查看订阅计划</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            订阅成功！
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            欢迎加入中国新能源汽车智能分析平台
          </p>
        </div>

        {/* Subscription Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              订阅详情
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">订阅计划</label>
                <p className="text-lg font-semibold text-gray-900">{currentPlan.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">价格</label>
                <p className="text-lg font-semibold text-gray-900">
                  ¥{currentPlan.price}/{currentPlan.interval}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">订阅状态</label>
                <p className="text-lg font-semibold text-green-600">
                  {subscription.status === 'active' ? '已激活' : subscription.status}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">下次计费日期</label>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : '未知'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-500">订阅用户</label>
              <p className="text-lg font-semibold text-gray-900">
                {user?.name} ({user?.email})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>您现在可以享受以下功能</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              接下来您可以
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/dashboard">
                <Button className="w-full h-auto p-4 flex flex-col items-start">
                  <div className="flex items-center mb-2">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    <span className="font-semibold">开始使用平台</span>
                  </div>
                  <span className="text-sm text-left opacity-90">
                    访问您的个人仪表板，开始探索新能源汽车市场数据
                  </span>
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start">
                  <div className="flex items-center mb-2">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <span className="font-semibold">管理订阅</span>
                  </div>
                  <span className="text-sm text-left">
                    在用户中心查看和管理您的订阅设置
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Receipt and Support */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">需要帮助？</h3>
              <p className="text-gray-600">
                我们的客服团队随时为您提供支持
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                下载收据
              </Button>
              <Button variant="outline">
                联系客服
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            感谢您选择中国新能源汽车智能分析平台！
          </p>
          <p className="text-sm text-gray-500 mt-2">
            订阅确认邮件已发送至 {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;