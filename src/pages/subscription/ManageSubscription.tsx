import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Download,
  Settings,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { SubscriptionPlan } from '../../types';
import { cn } from '../../utils/cn';

const ManageSubscription: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { user } = useAuth();
  const { 
    subscription, 
    loadSubscriptionPlans, 
    updateSubscription, 
    cancelSubscription,
    resumeSubscription 
  } = useSubscription();

  useEffect(() => {
    const loadData = async () => {
      try {
        const subscriptionPlans = await loadSubscriptionPlans();
        setPlans(subscriptionPlans);
        
        if (subscription) {
          const plan = subscriptionPlans.find(p => p.id === subscription.planId);
          setCurrentPlan(plan || null);
        }
      } catch (error) {
        console.error('Failed to load subscription data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [subscription, loadSubscriptionPlans]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-600';
      case 'past_due':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5" />;
      case 'canceled':
        return <XCircle className="h-5 w-5" />;
      case 'past_due':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <RefreshCw className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '已激活';
      case 'canceled':
        return '已取消';
      case 'past_due':
        return '逾期未付';
      case 'incomplete':
        return '未完成';
      default:
        return status;
    }
  };

  const handleUpgrade = async (planId: string) => {
    setActionLoading('upgrade');
    try {
      await updateSubscription(planId);
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDowngrade = async (planId: string) => {
    setActionLoading('downgrade');
    try {
      await updateSubscription(planId);
    } catch (error) {
      console.error('Failed to downgrade subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    setActionLoading('cancel');
    try {
      await cancelSubscription();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async () => {
    setActionLoading('resume');
    try {
      await resumeSubscription();
    } catch (error) {
      console.error('Failed to resume subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载订阅信息...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">订阅管理</h1>
            <p className="mt-4 text-gray-600">您当前没有活跃的订阅</p>
            <Button className="mt-6" onClick={() => window.location.href = '/subscription'}>
              查看订阅计划
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">订阅管理</h1>
          <p className="mt-2 text-gray-600">管理您的订阅计划和账单信息</p>
        </div>

        {/* Current Subscription */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              当前订阅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">订阅计划</label>
                <p className="text-lg font-semibold text-gray-900">
                  {currentPlan?.name || '未知计划'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">状态</label>
                <div className={cn('flex items-center mt-1', getStatusColor(subscription.status))}>
                  {getStatusIcon(subscription.status)}
                  <span className="ml-2 font-semibold">
                    {getStatusText(subscription.status)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">价格</label>
                <p className="text-lg font-semibold text-gray-900">
                  ¥{currentPlan?.price || 0}/{currentPlan?.interval || 'month'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">下次计费</label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : '未知'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Plan Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                计划管理
              </CardTitle>
              <CardDescription>
                升级或降级您的订阅计划
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plans.map((plan) => {
                const isCurrent = plan.id === subscription.planId;
                const isUpgrade = currentPlan && plan.price > currentPlan.price;
                const isDowngrade = currentPlan && plan.price < currentPlan.price;
                
                return (
                  <div key={plan.id} className={cn(
                    'p-4 border rounded-lg',
                    isCurrent ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  )}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-600">¥{plan.price}/{plan.interval}</p>
                      </div>
                      <div>
                        {isCurrent ? (
                          <span className="text-sm text-green-600 font-medium">当前计划</span>
                        ) : (
                          <Button
                            size="sm"
                            variant={isUpgrade ? 'default' : 'outline'}
                            onClick={() => isUpgrade ? handleUpgrade(plan.id) : handleDowngrade(plan.id)}
                            isLoading={actionLoading === (isUpgrade ? 'upgrade' : 'downgrade')}
                            disabled={actionLoading !== null}
                          >
                            {isUpgrade ? (
                              <>
                                <ArrowUpCircle className="h-4 w-4 mr-1" />
                                升级
                              </>
                            ) : (
                              <>
                                <ArrowDownCircle className="h-4 w-4 mr-1" />
                                降级
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Subscription Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                订阅控制
              </CardTitle>
              <CardDescription>
                暂停、恢复或取消您的订阅
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.status === 'active' ? (
                <>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">取消订阅</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          取消后，您可以继续使用服务直到当前计费周期结束。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {!showCancelConfirm ? (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      取消订阅
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        确定要取消订阅吗？此操作无法撤销。
                      </p>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCancelConfirm(false)}
                        >
                          取消
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleCancel}
                          isLoading={actionLoading === 'cancel'}
                          disabled={actionLoading !== null}
                        >
                          确认取消
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : subscription.status === 'canceled' ? (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <RefreshCw className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">恢复订阅</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          重新激活您的订阅以继续享受服务。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={handleResume}
                    isLoading={actionLoading === 'resume'}
                    disabled={actionLoading !== null}
                  >
                    恢复订阅
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    当前订阅状态不允许进行操作。如需帮助，请联系客服。
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              账单历史
            </CardTitle>
            <CardDescription>
              查看和下载您的账单记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无账单记录</p>
              <p className="text-sm text-gray-500 mt-2">
                账单记录将在首次付款后显示
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageSubscription;