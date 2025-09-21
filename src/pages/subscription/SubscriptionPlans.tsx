import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SubscriptionPlan } from '../../types';

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);

  const { user } = useAuth();
  const { subscription, loadSubscriptionPlans, createSubscription } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const subscriptionPlans = await loadSubscriptionPlans();
        setPlans(subscriptionPlans);
      } catch (error) {
        console.error('Failed to load subscription plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [loadSubscriptionPlans]);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }

    setSelectedPlan(planId);
    setIsCreatingSubscription(true);

    try {
      await createSubscription(planId);
      navigate('/subscription/success');
    } catch (error) {
      console.error('Failed to create subscription:', error);
    } finally {
      setIsCreatingSubscription(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'basic':
        return <Star className="h-6 w-6" />;
      case 'pro':
        return <Zap className="h-6 w-6" />;
      case 'enterprise':
        return <Crown className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'basic':
        return 'text-blue-600';
      case 'pro':
        return 'text-purple-600';
      case 'enterprise':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.planId === planId && subscription?.status === 'active';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载订阅计划...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            选择您的订阅计划
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            解锁中国新能源汽车市场的深度洞察和专业分析
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscription && subscription.status === 'active' && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                您当前的订阅计划：{plans.find(p => p.id === subscription.planId)?.name || '未知计划'}
              </span>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isPopular = plan.type.toLowerCase() === 'pro';
            const isCurrent = isCurrentPlan(plan.id);
            const isSelected = selectedPlan === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={cn(
                  'relative transition-all duration-200 hover:shadow-lg',
                  isPopular && 'ring-2 ring-purple-600 scale-105',
                  isCurrent && 'ring-2 ring-green-600'
                )}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      最受欢迎
                    </span>
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      当前计划
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={cn('mx-auto mb-4 p-3 rounded-full bg-gray-100', getPlanColor(plan.type))}>
                    {getPlanIcon(plan.type)}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ¥{plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent || isCreatingSubscription}
                    isLoading={isSelected && isCreatingSubscription}
                  >
                    {isCurrent ? (
                      '当前计划'
                    ) : isSelected && isCreatingSubscription ? (
                      '处理中...'
                    ) : (
                      <>
                        选择此计划
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            常见问题
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                我可以随时取消订阅吗？
              </h3>
              <p className="text-gray-600">
                是的，您可以随时取消订阅。取消后，您仍可以使用服务直到当前计费周期结束。
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                支持哪些支付方式？
              </h3>
              <p className="text-gray-600">
                我们支持信用卡、借记卡、支付宝和微信支付等多种支付方式。
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                可以升级或降级计划吗？
              </h3>
              <p className="text-gray-600">
                可以的，您可以随时在用户中心升级或降级您的订阅计划。费用将按比例调整。
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            还有疑问？{' '}
            <a href="mailto:support@china-ev-intelligence.com" className="text-blue-600 hover:text-blue-500">
              联系我们的客服团队
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;