import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target, 
  Award, 
  Star, 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  RefreshCw, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  ExternalLink, 
  Bookmark, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Globe, 
  Zap, 
  Car, 
  DollarSign, 
  ShoppingCart, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, ScatterChart, Scatter, Cell } from 'recharts';

interface Competitor {
  id: string;
  name: string;
  logo: string;
  type: 'traditional' | 'startup' | 'tech';
  founded: number;
  headquarters: string;
  marketCap: number;
  revenue: number;
  employees: number;
  marketShare: number;
  salesVolume: number;
  growthRate: number;
  models: number;
  avgPrice: number;
  rndInvestment: number;
  patentCount: number;
  chargingStations: number;
  globalPresence: number;
  customerSatisfaction: number;
  brandValue: number;
  sustainability: number;
  innovation: number;
  quality: number;
  service: number;
  pricing: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recentNews: string[];
  keyProducts: string[];
  partnerships: string[];
  color: string;
}

interface CompetitorComparison {
  metric: string;
  competitors: { [key: string]: number };
}

interface MarketPosition {
  competitor: string;
  marketShare: number;
  innovation: number;
  size: number;
  color: string;
}

const CompetitorAnalysis: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<CompetitorComparison[]>([]);
  const [marketPositions, setMarketPositions] = useState<MarketPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('marketShare');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'comparison'>('grid');

  const competitorTypes = [
    { value: 'all', label: '全部' },
    { value: 'traditional', label: '传统车企' },
    { value: 'startup', label: '造车新势力' },
    { value: 'tech', label: '科技公司' }
  ];

  const metrics = [
    { value: 'marketShare', label: '市场份额' },
    { value: 'salesVolume', label: '销量' },
    { value: 'growthRate', label: '增长率' },
    { value: 'innovation', label: '创新指数' },
    { value: 'customerSatisfaction', label: '客户满意度' },
    { value: 'brandValue', label: '品牌价值' }
  ];

  useEffect(() => {
    const loadCompetitorData = async () => {
      try {
        // 模拟竞争对手数据
        const mockCompetitors: Competitor[] = [
          {
            id: '1',
            name: '比亚迪',
            logo: '/logos/byd.png',
            type: 'traditional',
            founded: 1995,
            headquarters: '深圳',
            marketCap: 1200000000000,
            revenue: 500000000000,
            employees: 290000,
            marketShare: 28.5,
            salesVolume: 3200000,
            growthRate: 35.2,
            models: 15,
            avgPrice: 165000,
            rndInvestment: 15000000000,
            patentCount: 28000,
            chargingStations: 45000,
            globalPresence: 58,
            customerSatisfaction: 4.2,
            brandValue: 85,
            sustainability: 92,
            innovation: 88,
            quality: 85,
            service: 82,
            pricing: 95,
            strengths: ['垂直整合', '电池技术', '成本控制', '产品矩阵'],
            weaknesses: ['品牌溢价', '海外市场', '高端定位'],
            opportunities: ['海外扩张', '储能业务', '自动驾驶'],
            threats: ['政策变化', '竞争加剧', '原材料涨价'],
            recentNews: [
              '发布仰望品牌高端车型',
              '与特斯拉在储能领域展开合作',
              '海外工厂建设加速'
            ],
            keyProducts: ['汉EV', '唐DM', '海豚', '元PLUS'],
            partnerships: ['丰田', '戴姆勒', '福特'],
            color: '#FF6B6B'
          },
          {
            id: '2',
            name: '特斯拉',
            logo: '/logos/tesla.png',
            type: 'tech',
            founded: 2003,
            headquarters: '奥斯汀',
            marketCap: 800000000000,
            revenue: 96000000000,
            employees: 127855,
            marketShare: 16.1,
            salesVolume: 1800000,
            growthRate: 12.8,
            models: 4,
            avgPrice: 285000,
            rndInvestment: 3000000000,
            patentCount: 3500,
            chargingStations: 50000,
            globalPresence: 45,
            customerSatisfaction: 4.1,
            brandValue: 98,
            sustainability: 88,
            innovation: 98,
            quality: 78,
            service: 75,
            pricing: 65,
            strengths: ['品牌影响力', '自动驾驶', '充电网络', '软件能力'],
            weaknesses: ['产能爬坡', '质量控制', '服务体系'],
            opportunities: ['FSD商业化', '机器人业务', '储能扩张'],
            threats: ['中国竞争', '监管压力', 'CEO风险'],
            recentNews: [
              'FSD在中国获得测试许可',
              '上海工厂产能再次提升',
              'Cybertruck开始交付'
            ],
            keyProducts: ['Model 3', 'Model Y', 'Model S', 'Cybertruck'],
            partnerships: ['松下', '宁德时代', 'LG化学'],
            color: '#4ECDC4'
          },
          {
            id: '3',
            name: '蔚来',
            logo: '/logos/nio.png',
            type: 'startup',
            founded: 2014,
            headquarters: '合肥',
            marketCap: 15000000000,
            revenue: 55600000000,
            employees: 26763,
            marketShare: 7.6,
            salesVolume: 850000,
            growthRate: 45.3,
            models: 8,
            avgPrice: 420000,
            rndInvestment: 8000000000,
            patentCount: 5200,
            chargingStations: 2100,
            globalPresence: 8,
            customerSatisfaction: 4.5,
            brandValue: 72,
            sustainability: 85,
            innovation: 92,
            quality: 88,
            service: 95,
            pricing: 58,
            strengths: ['用户服务', '换电技术', '品牌定位', '用户社区'],
            weaknesses: ['成本控制', '规模效应', '盈利能力'],
            opportunities: ['换电标准化', '海外扩张', '自动驾驶'],
            threats: ['资金压力', '竞争加剧', '政策风险'],
            recentNews: [
              '与中石化合作建设换电站',
              'ET9旗舰轿车发布',
              '进入德国市场'
            ],
            keyProducts: ['ES8', 'ES6', 'EC6', 'ET7'],
            partnerships: ['中石化', '壳牌', '江淮汽车'],
            color: '#45B7D1'
          },
          {
            id: '4',
            name: '理想',
            logo: '/logos/li.png',
            type: 'startup',
            founded: 2015,
            headquarters: '北京',
            marketCap: 25000000000,
            revenue: 41300000000,
            employees: 21681,
            marketShare: 6.7,
            salesVolume: 750000,
            growthRate: 52.1,
            models: 5,
            avgPrice: 380000,
            rndInvestment: 6500000000,
            patentCount: 3800,
            chargingStations: 800,
            globalPresence: 2,
            customerSatisfaction: 4.3,
            brandValue: 68,
            sustainability: 78,
            innovation: 85,
            quality: 90,
            service: 88,
            pricing: 72,
            strengths: ['增程技术', '产品定义', '制造质量', '用户口碑'],
            weaknesses: ['技术路线', '产品线单一', '国际化'],
            opportunities: ['纯电转型', '智能驾驶', '产品扩张'],
            threats: ['技术转型', '竞争压力', '供应链'],
            recentNews: [
              'MEGA纯电MPV上市',
              '与宁德时代深化合作',
              '智能驾驶技术升级'
            ],
            keyProducts: ['理想ONE', '理想L9', '理想L8', '理想L7'],
            partnerships: ['宁德时代', '德赛西威', '地平线'],
            color: '#96CEB4'
          },
          {
            id: '5',
            name: '小鹏',
            logo: '/logos/xpeng.png',
            type: 'startup',
            founded: 2014,
            headquarters: '广州',
            marketCap: 8000000000,
            revenue: 30700000000,
            employees: 15115,
            marketShare: 6.1,
            salesVolume: 680000,
            growthRate: 28.9,
            models: 7,
            avgPrice: 245000,
            rndInvestment: 5200000000,
            patentCount: 4500,
            chargingStations: 1200,
            globalPresence: 12,
            customerSatisfaction: 4.0,
            brandValue: 65,
            sustainability: 82,
            innovation: 95,
            quality: 82,
            service: 85,
            pricing: 78,
            strengths: ['智能驾驶', '软件能力', '技术创新', '年轻化'],
            weaknesses: ['品牌认知', '销量规模', '盈利压力'],
            opportunities: ['飞行汽车', '机器人', '海外市场'],
            threats: ['技术竞争', '资金需求', '市场变化'],
            recentNews: [
              'G9智能SUV海外上市',
              '飞行汽车获得适航证',
              '与大众合作智能驾驶'
            ],
            keyProducts: ['P7', 'G9', 'P5', 'G6'],
            partnerships: ['大众', '滴滴', '高通'],
            color: '#FFEAA7'
          },
          {
            id: '6',
            name: '广汽埃安',
            logo: '/logos/aion.png',
            type: 'traditional',
            founded: 2017,
            headquarters: '广州',
            marketCap: 120000000000,
            revenue: 85000000000,
            employees: 8500,
            marketShare: 5.5,
            salesVolume: 620000,
            growthRate: 41.7,
            models: 9,
            avgPrice: 185000,
            rndInvestment: 4500000000,
            patentCount: 2800,
            chargingStations: 3500,
            globalPresence: 15,
            customerSatisfaction: 4.1,
            brandValue: 58,
            sustainability: 88,
            innovation: 82,
            quality: 85,
            service: 80,
            pricing: 88,
            strengths: ['传统制造', '渠道网络', '成本优势', '技术积累'],
            weaknesses: ['品牌独立性', '创新速度', '用户体验'],
            opportunities: ['品牌升级', '海外扩张', '智能化'],
            threats: ['内部竞争', '新势力冲击', '技术迭代'],
            recentNews: [
              'Hyper品牌发布',
              '与华为合作智能驾驶',
              '海外工厂规划公布'
            ],
            keyProducts: ['AION Y', 'AION S', 'AION V', 'Hyper GT'],
            partnerships: ['华为', '腾讯', '宁德时代'],
            color: '#DDA0DD'
          }
        ];

        // 生成对比数据
        const mockComparisonData: CompetitorComparison[] = [
          {
            metric: '市场份额',
            competitors: mockCompetitors.reduce((acc, comp) => {
              acc[comp.name] = comp.marketShare;
              return acc;
            }, {} as { [key: string]: number })
          },
          {
            metric: '创新指数',
            competitors: mockCompetitors.reduce((acc, comp) => {
              acc[comp.name] = comp.innovation;
              return acc;
            }, {} as { [key: string]: number })
          },
          {
            metric: '客户满意度',
            competitors: mockCompetitors.reduce((acc, comp) => {
              acc[comp.name] = comp.customerSatisfaction * 20;
              return acc;
            }, {} as { [key: string]: number })
          },
          {
            metric: '品牌价值',
            competitors: mockCompetitors.reduce((acc, comp) => {
              acc[comp.name] = comp.brandValue;
              return acc;
            }, {} as { [key: string]: number })
          },
          {
            metric: '可持续性',
            competitors: mockCompetitors.reduce((acc, comp) => {
              acc[comp.name] = comp.sustainability;
              return acc;
            }, {} as { [key: string]: number })
          },
          {
            metric: '服务质量',
            competitors: mockCompetitors.reduce((acc, comp) => {
              acc[comp.name] = comp.service;
              return acc;
            }, {} as { [key: string]: number })
          }
        ];

        // 生成市场定位数据
        const mockMarketPositions: MarketPosition[] = mockCompetitors.map(comp => ({
          competitor: comp.name,
          marketShare: comp.marketShare,
          innovation: comp.innovation,
          size: comp.salesVolume / 10000,
          color: comp.color
        }));

        setCompetitors(mockCompetitors);
        setComparisonData(mockComparisonData);
        setMarketPositions(mockMarketPositions);
        setSelectedCompetitors([mockCompetitors[0].id, mockCompetitors[1].id, mockCompetitors[2].id]);
      } catch (error) {
        console.error('Failed to load competitor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitorData();
  }, []);

  const filteredCompetitors = competitors.filter(competitor => {
    const matchesSearch = competitor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || competitor.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleCompetitorSelection = (competitorId: string) => {
    setSelectedCompetitors(prev => {
      if (prev.includes(competitorId)) {
        return prev.filter(id => id !== competitorId);
      } else if (prev.length < 6) {
        return [...prev, competitorId];
      }
      return prev;
    });
  };

  const getSelectedCompetitors = () => {
    return competitors.filter(comp => selectedCompetitors.includes(comp.id));
  };

  const formatNumber = (num: number) => {
    if (num >= 100000000000) {
      return `${(num / 100000000000).toFixed(1)}千亿`;
    } else if (num >= 10000000000) {
      return `${(num / 10000000000).toFixed(1)}百亿`;
    } else if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}亿`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'traditional':
        return <Building className="h-4 w-4" />;
      case 'startup':
        return <Zap className="h-4 w-4" />;
      case 'tech':
        return <Globe className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'traditional':
        return '传统车企';
      case 'startup':
        return '造车新势力';
      case 'tech':
        return '科技公司';
      default:
        return '其他';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载竞争对手数据...</p>
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
                <Users className="h-8 w-8 mr-3" />
                竞争对手分析
              </h1>
              <p className="text-gray-600 mt-1">深度分析竞争格局，洞察市场机会</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新数据
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出分析
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索竞争对手..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {competitorTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                网格
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'table' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                表格
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'comparison' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                对比
              </button>
            </div>
          </div>
        </div>

        {/* Market Position Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              市场定位分析
            </CardTitle>
            <CardDescription>基于市场份额和创新指数的竞争定位（气泡大小代表销量）</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="marketShare" 
                    name="市场份额" 
                    unit="%"
                    domain={[0, 35]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="innovation" 
                    name="创新指数" 
                    domain={[70, 100]}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium">{data.competitor}</p>
                            <p className="text-sm text-gray-600">市场份额: {data.marketShare}%</p>
                            <p className="text-sm text-gray-600">创新指数: {data.innovation}</p>
                            <p className="text-sm text-gray-600">销量: {formatNumber(data.size * 10000)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={marketPositions} fill="#8884d8">
                    {marketPositions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Content based on view mode */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitors.map((competitor) => (
              <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: competitor.color }}
                      >
                        {competitor.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          {getTypeIcon(competitor.type)}
                          <span>{getTypeLabel(competitor.type)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCompetitorSelection(competitor.id)}
                        className={selectedCompetitors.includes(competitor.id) ? 'bg-blue-50 border-blue-500' : ''}
                      >
                        {selectedCompetitors.includes(competitor.id) ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">市场份额</p>
                        <p className="text-lg font-semibold">{competitor.marketShare}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">销量</p>
                        <p className="text-lg font-semibold">{formatNumber(competitor.salesVolume)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">增长率</p>
                        <p className={`text-lg font-semibold flex items-center ${
                          competitor.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {competitor.growthRate > 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(competitor.growthRate)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">平均售价</p>
                        <p className="text-lg font-semibold">{formatCurrency(competitor.avgPrice)}</p>
                      </div>
                    </div>

                    {/* Performance Indicators */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>创新指数</span>
                        <span className="font-medium">{competitor.innovation}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${competitor.innovation}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>客户满意度</span>
                        <span className="font-medium">{competitor.customerSatisfaction}/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(competitor.customerSatisfaction / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Key Products */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">主要产品</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.keyProducts.slice(0, 3).map((product, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {product}
                          </span>
                        ))}
                        {competitor.keyProducts.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{competitor.keyProducts.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4 mr-1" />
                        详情
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <Card>
            <CardHeader>
              <CardTitle>竞争对手详细对比</CardTitle>
              <CardDescription>全面对比各竞争对手的关键指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">公司</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">市场份额</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">销量</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">增长率</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">平均售价</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">创新指数</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">客户满意度</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">品牌价值</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompetitors.map((competitor) => (
                      <tr key={competitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: competitor.color }}
                            >
                              {competitor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{competitor.name}</p>
                              <p className="text-sm text-gray-500">{getTypeLabel(competitor.type)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {competitor.marketShare}%
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatNumber(competitor.salesVolume)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`flex items-center justify-end ${
                            competitor.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {competitor.growthRate > 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(competitor.growthRate)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(competitor.avgPrice)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <span>{competitor.innovation}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${competitor.innovation}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{competitor.customerSatisfaction}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {competitor.brandValue}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCompetitorSelection(competitor.id)}
                            >
                              {selectedCompetitors.includes(competitor.id) ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === 'comparison' && (
          <div className="space-y-6">
            {/* Selected Competitors */}
            <Card>
              <CardHeader>
                <CardTitle>选中的竞争对手 ({selectedCompetitors.length}/6)</CardTitle>
                <CardDescription>选择最多6个竞争对手进行深度对比分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getSelectedCompetitors().map((competitor) => (
                    <div 
                      key={competitor.id}
                      className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2"
                    >
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: competitor.color }}
                      >
                        {competitor.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{competitor.name}</span>
                      <button
                        onClick={() => toggleCompetitorSelection(competitor.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>综合能力对比</CardTitle>
                <CardDescription>多维度能力雷达图对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={comparisonData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10 }}
                      />
                      {getSelectedCompetitors().map((competitor, index) => (
                        <Radar
                          key={competitor.id}
                          name={competitor.name}
                          dataKey={`competitors.${competitor.name}`}
                          stroke={competitor.color}
                          fill={competitor.color}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>详细指标对比</CardTitle>
                <CardDescription>选中竞争对手的关键指标详细对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">指标</th>
                        {getSelectedCompetitors().map((competitor) => (
                          <th key={competitor.id} className="text-center py-3 px-4 font-medium text-gray-900">
                            <div className="flex items-center justify-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: competitor.color }}
                              ></div>
                              <span>{competitor.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'marketShare', label: '市场份额', unit: '%' },
                        { key: 'salesVolume', label: '销量', unit: '', format: 'number' },
                        { key: 'growthRate', label: '增长率', unit: '%' },
                        { key: 'avgPrice', label: '平均售价', unit: '', format: 'currency' },
                        { key: 'innovation', label: '创新指数', unit: '/100' },
                        { key: 'customerSatisfaction', label: '客户满意度', unit: '/5.0' },
                        { key: 'brandValue', label: '品牌价值', unit: '/100' },
                        { key: 'sustainability', label: '可持续性', unit: '/100' },
                        { key: 'models', label: '车型数量', unit: '款' },
                        { key: 'employees', label: '员工数量', unit: '', format: 'number' },
                        { key: 'patentCount', label: '专利数量', unit: '', format: 'number' },
                        { key: 'chargingStations', label: '充电桩', unit: '', format: 'number' }
                      ].map((metric) => (
                        <tr key={metric.key} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {metric.label}
                          </td>
                          {getSelectedCompetitors().map((competitor) => {
                            const value = competitor[metric.key as keyof Competitor] as number;
                            let displayValue = value;
                            
                            if (metric.format === 'number') {
                              displayValue = formatNumber(value);
                            } else if (metric.format === 'currency') {
                              displayValue = formatCurrency(value);
                            } else {
                              displayValue = `${value}${metric.unit}`;
                            }
                            
                            return (
                              <td key={competitor.id} className="py-3 px-4 text-center">
                                {displayValue}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorAnalysis;