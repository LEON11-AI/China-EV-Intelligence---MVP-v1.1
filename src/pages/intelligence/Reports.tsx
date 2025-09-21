import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Users, 
  Car, 
  DollarSign, 
  Globe, 
  ChevronDown, 
  Star, 
  Share2, 
  Bookmark, 
  MoreHorizontal
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'market' | 'competitor' | 'trend' | 'vehicle' | 'custom';
  status: 'draft' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  downloadCount: number;
  viewCount: number;
  rating: number;
  isBookmarked: boolean;
  fileSize?: string;
  pageCount?: number;
  thumbnail?: string;
  metadata?: {
    vehicles?: string[];
    timeRange?: string;
    regions?: string[];
    [key: string]: any;
  };
}

interface ReportFilters {
  type: string;
  status: string;
  dateRange: string;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 12;

  const [filters, setFilters] = useState<ReportFilters>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    searchQuery: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        // 模拟加载报告数据
        const mockReports: Report[] = [
          {
            id: '1',
            title: '2024年Q1中国电动车市场分析报告',
            description: '深入分析2024年第一季度中国电动车市场的发展趋势、销量数据、品牌竞争格局及消费者偏好变化。',
            type: 'market',
            status: 'completed',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            author: '市场分析团队',
            tags: ['市场分析', '销量数据', '趋势预测'],
            downloadCount: 156,
            viewCount: 892,
            rating: 4.8,
            isBookmarked: true,
            fileSize: '2.3 MB',
            pageCount: 45,
            metadata: {
              timeRange: '2024 Q1',
              regions: ['中国'],
              vehicles: ['比亚迪', '特斯拉', '蔚来', '理想']
            }
          },
          {
            id: '2',
            title: '比亚迪 vs 特斯拉竞争分析',
            description: '对比分析比亚迪和特斯拉在中国市场的竞争策略、产品布局、技术优势和市场表现。',
            type: 'competitor',
            status: 'completed',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            author: '竞争分析师',
            tags: ['竞争分析', '品牌对比', '战略研究'],
            downloadCount: 89,
            viewCount: 445,
            rating: 4.6,
            isBookmarked: false,
            fileSize: '1.8 MB',
            pageCount: 32,
            metadata: {
              vehicles: ['比亚迪', '特斯拉'],
              regions: ['中国']
            }
          },
          {
            id: '3',
            title: '新能源汽车技术发展趋势报告',
            description: '分析电池技术、自动驾驶、智能网联等关键技术的发展现状和未来趋势。',
            type: 'trend',
            status: 'generating',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            author: '技术研究团队',
            tags: ['技术趋势', '创新分析', '未来预测'],
            downloadCount: 0,
            viewCount: 23,
            rating: 0,
            isBookmarked: true,
            metadata: {
              timeRange: '2024-2030',
              regions: ['全球']
            }
          },
          {
            id: '4',
            title: '理想L9深度评测报告',
            description: '全面评测理想L9的产品力、市场定位、用户反馈和竞争优势。',
            type: 'vehicle',
            status: 'completed',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            author: '产品评测师',
            tags: ['车型评测', '产品分析', '用户体验'],
            downloadCount: 67,
            viewCount: 234,
            rating: 4.4,
            isBookmarked: false,
            fileSize: '1.5 MB',
            pageCount: 28,
            metadata: {
              vehicles: ['理想L9'],
              regions: ['中国']
            }
          },
          {
            id: '5',
            title: '欧洲电动车市场进入策略分析',
            description: '为中国电动车企业进入欧洲市场提供策略建议和风险评估。',
            type: 'market',
            status: 'completed',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            author: '国际市场分析师',
            tags: ['国际市场', '进入策略', '风险评估'],
            downloadCount: 45,
            viewCount: 178,
            rating: 4.7,
            isBookmarked: true,
            fileSize: '2.1 MB',
            pageCount: 38,
            metadata: {
              regions: ['欧洲'],
              timeRange: '2024-2025'
            }
          },
          {
            id: '6',
            title: '自定义竞争对手分析',
            description: '根据用户需求定制的竞争对手分析报告。',
            type: 'custom',
            status: 'draft',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            author: '您',
            tags: ['自定义', '竞争分析'],
            downloadCount: 0,
            viewCount: 5,
            rating: 0,
            isBookmarked: false,
            metadata: {
              vehicles: ['蔚来ES6', '小鹏P7']
            }
          }
        ];

        // 添加更多模拟数据
        for (let i = 7; i <= 20; i++) {
          mockReports.push({
            id: i.toString(),
            title: `报告 ${i}`,
            description: `这是第 ${i} 个报告的描述`,
            type: ['market', 'competitor', 'trend', 'vehicle'][Math.floor(Math.random() * 4)] as any,
            status: ['completed', 'generating', 'draft'][Math.floor(Math.random() * 3)] as any,
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - (i - 1) * 24 * 60 * 60 * 1000).toISOString(),
            author: '分析师',
            tags: ['标签1', '标签2'],
            downloadCount: Math.floor(Math.random() * 100),
            viewCount: Math.floor(Math.random() * 500),
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            isBookmarked: Math.random() > 0.7
          });
        }

        setReports(mockReports);
        setFilteredReports(mockReports);
        setTotalPages(Math.ceil(mockReports.length / itemsPerPage));
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    // 应用过滤器和排序
    let filtered = reports;

    // 按类型过滤
    if (filters.type !== 'all') {
      filtered = filtered.filter(report => report.type === filters.type);
    }

    // 按状态过滤
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
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

      filtered = filtered.filter(report => new Date(report.updatedAt) >= startDate);
    }

    // 按搜索查询过滤
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'downloadCount':
          aValue = a.downloadCount;
          bValue = b.downloadCount;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReports(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [reports, filters]);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'market':
        return <BarChart3 className="h-5 w-5 text-blue-500" />;
      case 'competitor':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'vehicle':
        return <Car className="h-5 w-5 text-orange-500" />;
      case 'custom':
        return <PieChart className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'generating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: '已完成',
      generating: '生成中',
      draft: '草稿',
      failed: '失败'
    };
    return labels[status] || '未知';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      market: '市场分析',
      competitor: '竞争分析',
      trend: '趋势分析',
      vehicle: '车型分析',
      custom: '自定义'
    };
    return labels[type] || '其他';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  };

  const handleBookmark = async (reportId: string) => {
    try {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, isBookmarked: !report.isBookmarked }
          : report
      ));
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleDownload = async (reportId: string) => {
    try {
      // 模拟下载
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, downloadCount: report.downloadCount + 1 }
          : report
      ));
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const handleView = async (reportId: string) => {
    try {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, viewCount: report.viewCount + 1 }
          : report
      ));
    } catch (error) {
      console.error('Failed to view report:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载报告...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                智能报告
              </h1>
              <p className="text-gray-600 mt-1">查看和管理您的分析报告</p>
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
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建报告
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    报告类型
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部类型</option>
                    <option value="market">市场分析</option>
                    <option value="competitor">竞争分析</option>
                    <option value="trend">趋势分析</option>
                    <option value="vehicle">车型分析</option>
                    <option value="custom">自定义</option>
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
                    <option value="completed">已完成</option>
                    <option value="generating">生成中</option>
                    <option value="draft">草稿</option>
                    <option value="failed">失败</option>
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
                    排序方式
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="updatedAt-desc">最近更新</option>
                    <option value="createdAt-desc">最新创建</option>
                    <option value="downloadCount-desc">下载最多</option>
                    <option value="rating-desc">评分最高</option>
                    <option value="title-asc">标题 A-Z</option>
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
                      placeholder="搜索报告..."
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
                <div className="text-2xl font-bold text-gray-900">{filteredReports.length}</div>
                <div className="text-sm text-gray-600">总报告数</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredReports.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">已完成</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredReports.filter(r => r.status === 'generating').length}
                </div>
                <div className="text-sm text-gray-600">生成中</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredReports.filter(r => r.isBookmarked).length}
                </div>
                <div className="text-sm text-gray-600">已收藏</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid/List */}
        {getCurrentPageItems().length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无报告</h3>
                <p className="text-gray-600 mb-4">没有找到符合条件的报告</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  创建第一个报告
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {getCurrentPageItems().map((report) => (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getReportIcon(report.type)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            getStatusColor(report.status)
                          }`}>
                            {getStatusLabel(report.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(report.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Bookmark className={`h-4 w-4 ${
                              report.isBookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'
                            }`} />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>作者: {report.author}</span>
                          <span>{formatDate(report.updatedAt)}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {report.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                          {report.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{report.tags.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {report.viewCount}
                            </span>
                            <span className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              {report.downloadCount}
                            </span>
                          </div>
                          {report.rating > 0 && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span>{report.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleView(report.id)}
                            disabled={report.status !== 'completed'}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            查看
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(report.id)}
                            disabled={report.status !== 'completed'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {getCurrentPageItems().map((report) => (
                      <div key={report.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0">
                          {getReportIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {report.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                getStatusColor(report.status)
                              }`}>
                                {getStatusLabel(report.status)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(report.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {report.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>作者: {report.author}</span>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {report.viewCount}
                              </span>
                              <span className="flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                {report.downloadCount}
                              </span>
                              {report.rating > 0 && (
                                <span className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                  {report.rating}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookmark(report.id)}
                                className="h-6 px-2"
                              >
                                <Bookmark className={`h-3 w-3 ${
                                  report.isBookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'
                                }`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(report.id)}
                                disabled={report.status !== 'completed'}
                                className="h-6 px-2 text-xs"
                              >
                                查看
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(report.id)}
                                disabled={report.status !== 'completed'}
                                className="h-6 px-2"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredReports.length)} 条，共 {filteredReports.length} 条报告
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
                  <span className="text-sm text-gray-700">
                    第 {currentPage} 页，共 {totalPages} 页
                  </span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;