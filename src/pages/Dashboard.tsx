import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { 
  BarChart3, 
  Car, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Plus,
  Eye,
  Heart,
  FileText,
  Calendar,
  Activity,
  Star,
  Download,
  Settings,
  Bell
} from 'lucide-react';

interface DashboardStats {
  reportsGenerated: number;
  vehiclesViewed: number;
  favoritesCount: number;
  lastActivity: string;
}

interface RecentActivity {
  id: string;
  type: 'report' | 'vehicle' | 'favorite';
  title: string;
  timestamp: string;
  description?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [stats, setStats] = useState<DashboardStats>({
    reportsGenerated: 0,
    vehiclesViewed: 0,
    favoritesCount: 0,
    lastActivity: ''
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 模拟加载用户统计数据
        setStats({
          reportsGenerated: 12,
          vehiclesViewed: 45,
          favoritesCount: 8,
          lastActivity: new Date().toISOString()
        });

        // 模拟加载最近活动
        setRecentActivities([
          {
            id: '1',
            type: 'report',
            title: '2024年Q1电动车市场分析报告',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            description: '生成了新的市场分析报告'
          },
          {
            id: '2',
            type: 'vehicle',
            title: '比亚迪海豹',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            description: '查看了车型详细信息'
          },
          {
            id: '3',
            type: 'favorite',
            title: '特斯拉Model Y',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            description: '添加到收藏夹'
          },
          {
            id: '4',
            type: 'report',
            title: '竞争对手分析：蔚来 vs 理想',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            description: '生成了竞争分析报告'
          }
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: '生成分析报告',
      description: '创建新的智能分析报告',
      icon: <FileText className="h-6 w-6" />,
      link: '/intelligence/reports/new',
      color: 'bg-blue-500'
    },
    {
      title: '浏览车型数据',
      description: '查看最新的车型信息',
      icon: <Car className="h-6 w-6" />,
      link: '/intelligence/vehicles',
      color: 'bg-green-500'
    },
    {
      title: '市场趋势分析',
      description: '了解最新市场动态',
      icon: <TrendingUp className="h-6 w-6" />,
      link: '/intelligence/trends',
      color: 'bg-purple-500'
    },
    {
      title: '竞争对手分析',
      description: '分析竞争对手情况',
      icon: <Users className="h-6 w-6" />,
      link: '/intelligence/competitors',
      color: 'bg-orange-500'
    }
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'vehicle':
        return <Car className="h-4 w-4 text-green-500" />;
      case 'favorite':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载仪表板...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                欢迎回来，{user?.name || '用户'}
              </h1>
              <p className="text-gray-600 mt-1">
                这是您的智能分析工作台
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                通知
              </Button>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  设置
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <Card className="mb-8 border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    当前订阅：{subscription.planId === 'basic' ? '基础版' : subscription.planId === 'pro' ? '专业版' : '企业版'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    状态：<span className="text-green-600 font-medium">已激活</span>
                    {subscription.currentPeriodEnd && (
                      <span className="ml-4">
                        到期时间：{new Date(subscription.currentPeriodEnd).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </p>
                </div>
                <Link to="/subscription/manage">
                  <Button variant="outline" size="sm">
                    管理订阅
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">生成报告</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reportsGenerated}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">浏览车型</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.vehiclesViewed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">收藏数量</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.favoritesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">最后活动</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatTimeAgo(stats.lastActivity)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  快速操作
                </CardTitle>
                <CardDescription>
                  选择您想要执行的操作
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link} className="block">
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="flex items-center mb-3">
                          <div className={`p-2 ${action.color} rounded-lg text-white`}>
                            {action.icon}
                          </div>
                          <h3 className="ml-3 font-semibold text-gray-900">
                            {action.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {action.description}
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          开始使用
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  最近活动
                </CardTitle>
                <CardDescription>
                  您最近的操作记录
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-xs text-gray-500">
                            {activity.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/profile/activity">
                    <Button variant="outline" size="sm" className="w-full">
                      查看全部活动
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Content */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                推荐内容
              </CardTitle>
              <CardDescription>
                基于您的使用习惯为您推荐
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    2024年电动车市场趋势报告
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    深入分析2024年中国电动车市场的发展趋势和机遇
                  </p>
                  <Button size="sm" variant="outline">
                    立即查看
                  </Button>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    热门车型对比分析
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    比较当前市场上最受欢迎的电动车型
                  </p>
                  <Button size="sm" variant="outline">
                    开始对比
                  </Button>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    竞争对手分析工具
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    使用我们的智能工具分析竞争对手策略
                  </p>
                  <Button size="sm" variant="outline">
                    开始分析
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;