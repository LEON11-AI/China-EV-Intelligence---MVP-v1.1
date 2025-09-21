import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Activity, 
  FileText, 
  Car, 
  Heart, 
  User, 
  Settings, 
  Download, 
  Eye, 
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'report' | 'vehicle' | 'favorite' | 'profile' | 'settings' | 'download' | 'view' | 'search';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    reportId?: string;
    vehicleId?: string;
    searchQuery?: string;
    downloadType?: string;
    [key: string]: any;
  };
}

interface ActivityFilters {
  type: string;
  dateRange: string;
  searchQuery: string;
}

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<ActivityFilters>({
    type: 'all',
    dateRange: 'all',
    searchQuery: ''
  });

  useEffect(() => {
    const loadActivities = async () => {
      try {
        // 模拟加载活动数据
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'report',
            title: '生成市场分析报告',
            description: '生成了"2024年Q1电动车市场分析报告"',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            metadata: { reportId: 'report_001' }
          },
          {
            id: '2',
            type: 'vehicle',
            title: '查看车型详情',
            description: '查看了比亚迪海豹的详细信息',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            metadata: { vehicleId: 'vehicle_001' }
          },
          {
            id: '3',
            type: 'favorite',
            title: '添加收藏',
            description: '将特斯拉Model Y添加到收藏夹',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            metadata: { vehicleId: 'vehicle_002' }
          },
          {
            id: '4',
            type: 'search',
            title: '搜索车型',
            description: '搜索了"新能源SUV"',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            metadata: { searchQuery: '新能源SUV' }
          },
          {
            id: '5',
            type: 'download',
            title: '下载报告',
            description: '下载了PDF格式的市场分析报告',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            metadata: { downloadType: 'PDF', reportId: 'report_001' }
          },
          {
            id: '6',
            type: 'profile',
            title: '更新个人信息',
            description: '修改了个人资料中的公司信息',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '7',
            type: 'settings',
            title: '修改偏好设置',
            description: '更新了通知偏好设置',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '8',
            type: 'report',
            title: '生成竞争分析报告',
            description: '生成了"蔚来 vs 理想汽车竞争分析"报告',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            metadata: { reportId: 'report_002' }
          },
          {
            id: '9',
            type: 'view',
            title: '浏览市场趋势',
            description: '查看了2024年电动车市场趋势分析',
            timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '10',
            type: 'vehicle',
            title: '对比车型',
            description: '对比了理想L9和蔚来ES8',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            metadata: { vehicleIds: ['vehicle_003', 'vehicle_004'] }
          }
        ];

        // 添加更多历史数据
        for (let i = 11; i <= 50; i++) {
          mockActivities.push({
            id: i.toString(),
            type: ['report', 'vehicle', 'favorite', 'search', 'view'][Math.floor(Math.random() * 5)] as any,
            title: `活动 ${i}`,
            description: `这是第 ${i} 个活动的描述`,
            timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
          });
        }

        setActivities(mockActivities);
        setFilteredActivities(mockActivities);
        setTotalPages(Math.ceil(mockActivities.length / itemsPerPage));
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, []);

  useEffect(() => {
    // 应用过滤器
    let filtered = activities;

    // 按类型过滤
    if (filters.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    // 按日期范围过滤
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(activity => new Date(activity.timestamp) >= startDate);
    }

    // 按搜索查询过滤
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query)
      );
    }

    setFilteredActivities(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [activities, filters]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'vehicle':
        return <Car className="h-5 w-5 text-green-500" />;
      case 'favorite':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'profile':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'settings':
        return <Settings className="h-5 w-5 text-gray-500" />;
      case 'download':
        return <Download className="h-5 w-5 text-orange-500" />;
      case 'view':
        return <Eye className="h-5 w-5 text-indigo-500" />;
      case 'search':
        return <Search className="h-5 w-5 text-yellow-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      report: '报告',
      vehicle: '车型',
      favorite: '收藏',
      profile: '个人资料',
      settings: '设置',
      download: '下载',
      view: '浏览',
      search: '搜索'
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

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredActivities.slice(startIndex, endIndex);
  };

  const handleExport = async () => {
    try {
      // 模拟导出功能
      const csvContent = [
        ['时间', '类型', '标题', '描述'].join(','),
        ...filteredActivities.map(activity => [
          formatDateTime(activity.timestamp),
          getActivityTypeLabel(activity.type),
          activity.title,
          activity.description
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `activity_log_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Failed to export activities:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载活动记录...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">活动日志</h1>
              <p className="text-gray-600 mt-1">查看您的操作历史记录</p>
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
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    活动类型
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部类型</option>
                    <option value="report">报告</option>
                    <option value="vehicle">车型</option>
                    <option value="favorite">收藏</option>
                    <option value="search">搜索</option>
                    <option value="view">浏览</option>
                    <option value="download">下载</option>
                    <option value="profile">个人资料</option>
                    <option value="settings">设置</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    时间范围
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部时间</option>
                    <option value="today">今天</option>
                    <option value="week">最近一周</option>
                    <option value="month">最近一个月</option>
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
                      placeholder="搜索活动..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{filteredActivities.length}</div>
                <div className="text-sm text-gray-600">总活动数</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredActivities.filter(a => a.type === 'report').length}
                </div>
                <div className="text-sm text-gray-600">报告生成</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredActivities.filter(a => a.type === 'vehicle').length}
                </div>
                <div className="text-sm text-gray-600">车型查看</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredActivities.filter(a => a.type === 'favorite').length}
                </div>
                <div className="text-sm text-gray-600">收藏操作</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              活动记录
            </CardTitle>
            <CardDescription>
              显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredActivities.length)} 条，共 {filteredActivities.length} 条记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getCurrentPageItems().length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动记录</h3>
                <p className="text-gray-600">没有找到符合条件的活动记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getCurrentPageItems().map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getActivityTypeLabel(activity.type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDateTime(activity.timestamp)}
                        </div>
                        {activity.metadata && (
                          <div className="flex items-center space-x-2">
                            {activity.metadata.reportId && (
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                查看报告
                              </Button>
                            )}
                            {activity.metadata.vehicleId && (
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                查看车型
                              </Button>
                            )}
                          </div>
                        )}
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

export default ActivityLog;