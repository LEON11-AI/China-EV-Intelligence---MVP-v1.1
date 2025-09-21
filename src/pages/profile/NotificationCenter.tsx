import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Bell, 
  BellOff, 
  Mail, 
  MailOpen, 
  Trash2, 
  Settings, 
  Filter, 
  Search,
  Check,
  CheckCheck,
  AlertCircle,
  Info,
  TrendingUp,
  Car,
  FileText,
  CreditCard,
  User,
  Calendar,
  Clock,
  ChevronDown,
  X
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'system' | 'report' | 'vehicle' | 'subscription' | 'security' | 'marketing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    reportId?: string;
    vehicleId?: string;
    subscriptionId?: string;
    [key: string]: any;
  };
}

interface NotificationFilters {
  type: string;
  priority: string;
  status: string;
  searchQuery: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  reportUpdates: boolean;
  vehicleAlerts: boolean;
  subscriptionReminders: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const [filters, setFilters] = useState<NotificationFilters>({
    type: 'all',
    priority: 'all',
    status: 'all',
    searchQuery: ''
  });

  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    reportUpdates: true,
    vehicleAlerts: true,
    subscriptionReminders: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // 模拟加载通知数据
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'report',
            priority: 'high',
            title: '新报告已生成',
            message: '您请求的"2024年Q1电动车市场分析报告"已生成完成，点击查看详情。',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            isRead: false,
            actionUrl: '/reports/report_001',
            actionText: '查看报告',
            metadata: { reportId: 'report_001' }
          },
          {
            id: '2',
            type: 'vehicle',
            priority: 'medium',
            title: '车型价格更新',
            message: '您收藏的比亚迪海豹价格有所调整，建议查看最新信息。',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            actionUrl: '/vehicles/vehicle_001',
            actionText: '查看详情',
            metadata: { vehicleId: 'vehicle_001' }
          },
          {
            id: '3',
            type: 'subscription',
            priority: 'urgent',
            title: '订阅即将到期',
            message: '您的专业版订阅将在3天后到期，请及时续费以继续享受服务。',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            actionUrl: '/subscription/renew',
            actionText: '立即续费',
            metadata: { subscriptionId: 'sub_001' }
          },
          {
            id: '4',
            type: 'security',
            priority: 'high',
            title: '新设备登录',
            message: '检测到您的账户在新设备上登录，如非本人操作请立即修改密码。',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            actionUrl: '/profile/security',
            actionText: '查看详情'
          },
          {
            id: '5',
            type: 'system',
            priority: 'low',
            title: '系统维护通知',
            message: '系统将于今晚23:00-01:00进行例行维护，期间可能影响部分功能使用。',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: '6',
            type: 'marketing',
            priority: 'low',
            title: '新功能上线',
            message: '我们推出了全新的车型对比功能，快来体验吧！',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            actionUrl: '/features/compare',
            actionText: '立即体验'
          },
          {
            id: '7',
            type: 'report',
            priority: 'medium',
            title: '周报已更新',
            message: '本周电动车行业周报已发布，包含最新市场动态和趋势分析。',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            actionUrl: '/reports/weekly',
            actionText: '查看周报'
          },
          {
            id: '8',
            type: 'vehicle',
            priority: 'medium',
            title: '新车型上市',
            message: '特斯拉Model Y改款车型已上市，查看详细配置和价格信息。',
            timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            actionUrl: '/vehicles/tesla-model-y-2024',
            actionText: '查看新车'
          },
          {
            id: '9',
            type: 'system',
            priority: 'medium',
            title: '数据更新完成',
            message: '最新一期的车型数据和市场数据已更新完成。',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: '10',
            type: 'subscription',
            priority: 'low',
            title: '使用统计报告',
            message: '您本月已生成15份报告，查看详细使用统计。',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            actionUrl: '/profile/usage',
            actionText: '查看统计'
          }
        ];

        // 添加更多历史通知
        for (let i = 11; i <= 30; i++) {
          mockNotifications.push({
            id: i.toString(),
            type: ['system', 'report', 'vehicle', 'subscription'][Math.floor(Math.random() * 4)] as any,
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
            title: `通知 ${i}`,
            message: `这是第 ${i} 个通知的内容描述`,
            timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            isRead: Math.random() > 0.3
          });
        }

        setNotifications(mockNotifications);
        setFilteredNotifications(mockNotifications);
        setTotalPages(Math.ceil(mockNotifications.length / itemsPerPage));
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    // 应用过滤器
    let filtered = notifications;

    // 按类型过滤
    if (filters.type !== 'all') {
      filtered = filtered.filter(notification => notification.type === filters.type);
    }

    // 按优先级过滤
    if (filters.priority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === filters.priority);
    }

    // 按状态过滤
    if (filters.status !== 'all') {
      if (filters.status === 'unread') {
        filtered = filtered.filter(notification => !notification.isRead);
      } else if (filters.status === 'read') {
        filtered = filtered.filter(notification => notification.isRead);
      }
    }

    // 按搜索查询过滤
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [notifications, filters]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'vehicle':
        return <Car className="h-5 w-5 text-green-500" />;
      case 'subscription':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'security':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'marketing':
        return <TrendingUp className="h-5 w-5 text-orange-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      urgent: '紧急',
      high: '高',
      medium: '中',
      low: '低'
    };
    return labels[priority] || '普通';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      system: '系统',
      report: '报告',
      vehicle: '车型',
      subscription: '订阅',
      security: '安全',
      marketing: '推广'
    };
    return labels[type] || '其他';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '刚刚';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}小时前`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days}天前`;
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNotifications.slice(startIndex, endIndex);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      setSelectedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setNotifications(prev => prev.filter(notification => !selectedNotifications.has(notification.id)));
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notification => 
        selectedNotifications.has(notification.id)
          ? { ...notification, isRead: true }
          : notification
      ));
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const currentPageIds = getCurrentPageItems().map(n => n.id);
    setSelectedNotifications(new Set(currentPageIds));
  };

  const handleDeselectAll = () => {
    setSelectedNotifications(new Set());
  };

  const handleUpdateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      // 这里应该调用API保存设置
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载通知...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="h-8 w-8 mr-3" />
                通知中心
                {unreadCount > 0 && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {unreadCount} 条未读
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">管理您的系统通知和消息</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                过滤器
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-2" />
                设置
              </Button>
              {unreadCount > 0 && (
                <Button size="sm" onClick={handleMarkAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  全部已读
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    通知类型
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部类型</option>
                    <option value="system">系统</option>
                    <option value="report">报告</option>
                    <option value="vehicle">车型</option>
                    <option value="subscription">订阅</option>
                    <option value="security">安全</option>
                    <option value="marketing">推广</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    优先级
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部优先级</option>
                    <option value="urgent">紧急</option>
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部状态</option>
                    <option value="unread">未读</option>
                    <option value="read">已读</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    搜索
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                      placeholder="搜索通知..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        {showSettings && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                通知设置
              </CardTitle>
              <CardDescription>
                配置您希望接收的通知类型
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">通知方式</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleUpdateSettings({ emailNotifications: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">邮件通知</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleUpdateSettings({ pushNotifications: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">推送通知</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.weeklyDigest}
                        onChange={(e) => handleUpdateSettings({ weeklyDigest: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">周报摘要</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">通知内容</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.reportUpdates}
                        onChange={(e) => handleUpdateSettings({ reportUpdates: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">报告更新</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.vehicleAlerts}
                        onChange={(e) => handleUpdateSettings({ vehicleAlerts: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">车型提醒</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.subscriptionReminders}
                        onChange={(e) => handleUpdateSettings({ subscriptionReminders: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">订阅提醒</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.securityAlerts}
                        onChange={(e) => handleUpdateSettings({ securityAlerts: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">安全警报</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.marketingEmails}
                        onChange={(e) => handleUpdateSettings({ marketingEmails: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">营销邮件</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions */}
        {selectedNotifications.size > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-700">
                  已选择 {selectedNotifications.size} 条通知
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkMarkAsRead}>
                    <Check className="h-4 w-4 mr-2" />
                    标记为已读
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                    <X className="h-4 w-4 mr-2" />
                    取消选择
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  通知列表
                </CardTitle>
                <CardDescription>
                  显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} 条，共 {filteredNotifications.length} 条通知
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  全选
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                  取消全选
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {getCurrentPageItems().length === 0 ? (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
                <p className="text-gray-600">没有找到符合条件的通知</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getCurrentPageItems().map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 border rounded-lg transition-colors ${
                      notification.isRead 
                        ? 'border-gray-200 bg-white hover:bg-gray-50' 
                        : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                    } ${
                      selectedNotifications.has(notification.id) 
                        ? 'ring-2 ring-blue-500 border-blue-500' 
                        : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${
                          notification.isRead ? 'text-gray-900' : 'text-blue-900'
                        }`}>
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            getPriorityColor(notification.priority)
                          }`}>
                            {getPriorityLabel(notification.priority)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${
                        notification.isRead ? 'text-gray-600' : 'text-blue-800'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {getTypeLabel(notification.type)}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(notification.timestamp).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {notification.actionUrl && (
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              {notification.actionText || '查看详情'}
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <MailOpen className="h-3 w-3 mr-1" />
                              标记已读
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  第 {currentPage} 页，共 {totalPages} 页
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationCenter;