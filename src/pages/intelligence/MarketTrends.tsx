import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Calendar, 
  Filter, 
  Download, 
  Share2, 
  RefreshCw, 
  Globe, 
  Zap, 
  Car, 
  Users, 
  DollarSign, 
  Target, 
  Award, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Eye,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area } from 'recharts';

interface MarketData {
  period: string;
  totalSales: number;
  bevSales: number;
  phevSales: number;
  marketShare: number;
  averagePrice: number;
  growthRate: number;
}

interface BrandData {
  brand: string;
  sales: number;
  marketShare: number;
  growthRate: number;
  models: number;
  avgPrice: number;
  color: string;
}

interface RegionData {
  region: string;
  sales: number;
  marketShare: number;
  growthRate: number;
  penetrationRate: number;
  chargingStations: number;
}

interface TrendInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  category: string;
  date: string;
  source: string;
  confidence: number;
}

interface Forecast {
  year: number;
  totalMarket: number;
  evMarket: number;
  penetrationRate: number;
  confidence: number;
}

const MarketTrends: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [brandData, setBrandData] = useState<BrandData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [insights, setInsights] = useState<TrendInsight[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('12m');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('china');

  const timeRanges = [
    { value: '3m', label: '近3个月' },
    { value: '6m', label: '近6个月' },
    { value: '12m', label: '近12个月' },
    { value: '24m', label: '近2年' },
    { value: '36m', label: '近3年' }
  ];

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'bev', label: '纯电动' },
    { value: 'phev', label: '插电混动' },
    { value: 'luxury', label: '豪华车' },
    { value: 'mass', label: '大众市场' }
  ];

  const regions = [
    { value: 'china', label: '中国' },
    { value: 'europe', label: '欧洲' },
    { value: 'usa', label: '美国' },
    { value: 'global', label: '全球' }
  ];

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        // 模拟市场数据
        const mockMarketData: MarketData[] = [
          { period: '2024-01', totalSales: 2800000, bevSales: 1680000, phevSales: 1120000, marketShare: 35.2, averagePrice: 185000, growthRate: 12.5 },
          { period: '2024-02', totalSales: 2650000, bevSales: 1590000, phevSales: 1060000, marketShare: 33.8, averagePrice: 188000, growthRate: 8.3 },
          { period: '2024-03', totalSales: 3200000, bevSales: 1920000, phevSales: 1280000, marketShare: 38.1, averagePrice: 182000, growthRate: 15.7 },
          { period: '2024-04', totalSales: 3100000, bevSales: 1860000, phevSales: 1240000, marketShare: 36.9, averagePrice: 186000, growthRate: 11.2 },
          { period: '2024-05', totalSales: 3350000, bevSales: 2010000, phevSales: 1340000, marketShare: 39.4, averagePrice: 184000, growthRate: 18.9 },
          { period: '2024-06', totalSales: 3450000, bevSales: 2070000, phevSales: 1380000, marketShare: 40.2, averagePrice: 183000, growthRate: 16.4 },
          { period: '2024-07', totalSales: 3280000, bevSales: 1968000, phevSales: 1312000, marketShare: 38.7, averagePrice: 187000, growthRate: 13.8 },
          { period: '2024-08', totalSales: 3520000, bevSales: 2112000, phevSales: 1408000, marketShare: 41.5, averagePrice: 181000, growthRate: 21.3 },
          { period: '2024-09', totalSales: 3680000, bevSales: 2208000, phevSales: 1472000, marketShare: 43.1, averagePrice: 179000, growthRate: 24.6 },
          { period: '2024-10', totalSales: 3750000, bevSales: 2250000, phevSales: 1500000, marketShare: 44.2, averagePrice: 178000, growthRate: 26.8 },
          { period: '2024-11', totalSales: 3820000, bevSales: 2292000, phevSales: 1528000, marketShare: 45.1, averagePrice: 177000, growthRate: 28.4 },
          { period: '2024-12', totalSales: 3900000, bevSales: 2340000, phevSales: 1560000, marketShare: 46.0, averagePrice: 176000, growthRate: 30.2 }
        ];

        const mockBrandData: BrandData[] = [
          { brand: '比亚迪', sales: 3200000, marketShare: 28.5, growthRate: 35.2, models: 15, avgPrice: 165000, color: '#FF6B6B' },
          { brand: '特斯拉', sales: 1800000, marketShare: 16.1, growthRate: 12.8, models: 4, avgPrice: 285000, color: '#4ECDC4' },
          { brand: '蔚来', sales: 850000, marketShare: 7.6, growthRate: 45.3, models: 8, avgPrice: 420000, color: '#45B7D1' },
          { brand: '理想', sales: 750000, marketShare: 6.7, growthRate: 52.1, models: 5, avgPrice: 380000, color: '#96CEB4' },
          { brand: '小鹏', sales: 680000, marketShare: 6.1, growthRate: 28.9, models: 7, avgPrice: 245000, color: '#FFEAA7' },
          { brand: '广汽埃安', sales: 620000, marketShare: 5.5, growthRate: 41.7, models: 9, avgPrice: 185000, color: '#DDA0DD' },
          { brand: '吉利', sales: 580000, marketShare: 5.2, growthRate: 22.4, models: 12, avgPrice: 155000, color: '#98D8C8' },
          { brand: '长城', sales: 520000, marketShare: 4.6, growthRate: 18.6, models: 8, avgPrice: 175000, color: '#F7DC6F' },
          { brand: '其他', sales: 2200000, marketShare: 19.7, growthRate: 15.3, models: 50, avgPrice: 195000, color: '#BDC3C7' }
        ];

        const mockRegionData: RegionData[] = [
          { region: '华东', sales: 4200000, marketShare: 35.2, growthRate: 28.5, penetrationRate: 52.3, chargingStations: 125000 },
          { region: '华南', sales: 2800000, marketShare: 23.4, growthRate: 32.1, penetrationRate: 48.7, chargingStations: 89000 },
          { region: '华北', sales: 2100000, marketShare: 17.6, growthRate: 25.8, penetrationRate: 45.2, chargingStations: 76000 },
          { region: '西南', sales: 1500000, marketShare: 12.5, growthRate: 35.4, penetrationRate: 38.9, chargingStations: 52000 },
          { region: '华中', sales: 950000, marketShare: 7.9, growthRate: 29.7, penetrationRate: 41.6, chargingStations: 43000 },
          { region: '东北', sales: 280000, marketShare: 2.3, growthRate: 18.2, penetrationRate: 28.5, chargingStations: 18000 },
          { region: '西北', sales: 170000, marketShare: 1.4, growthRate: 22.6, penetrationRate: 25.8, chargingStations: 12000 }
        ];

        const mockInsights: TrendInsight[] = [
          {
            id: '1',
            title: '新能源汽车渗透率突破45%',
            description: '2024年11月新能源汽车市场渗透率达到45.1%，创历史新高。纯电动车型占比持续提升，插电混动保持稳定增长。',
            type: 'positive',
            impact: 'high',
            category: '市场份额',
            date: '2024-12-01',
            source: '中汽协',
            confidence: 95
          },
          {
            id: '2',
            title: '豪华电动车市场竞争加剧',
            description: '蔚来、理想、小鹏等造车新势力在豪华市场份额持续扩大，对传统豪华品牌形成冲击。',
            type: 'neutral',
            impact: 'medium',
            category: '竞争格局',
            date: '2024-11-28',
            source: '乘联会',
            confidence: 88
          },
          {
            id: '3',
            title: '充电基础设施建设提速',
            description: '全国充电桩保有量突破800万台，公共充电桩与私人充电桩比例进一步优化，缓解充电焦虑。',
            type: 'positive',
            impact: 'high',
            category: '基础设施',
            date: '2024-11-25',
            source: '充电联盟',
            confidence: 92
          },
          {
            id: '4',
            title: '电池成本持续下降',
            description: '磷酸铁锂电池成本较去年同期下降15%，为新能源汽车价格下探提供空间。',
            type: 'positive',
            impact: 'medium',
            category: '技术成本',
            date: '2024-11-20',
            source: '电池联盟',
            confidence: 85
          },
          {
            id: '5',
            title: '出口市场面临挑战',
            description: '欧美市场对中国新能源汽车征收关税，出口增长放缓，企业需要调整海外战略。',
            type: 'negative',
            impact: 'medium',
            category: '国际贸易',
            date: '2024-11-15',
            source: '海关总署',
            confidence: 90
          }
        ];

        const mockForecasts: Forecast[] = [
          { year: 2025, totalMarket: 28500000, evMarket: 15200000, penetrationRate: 53.3, confidence: 85 },
          { year: 2026, totalMarket: 29800000, evMarket: 18500000, penetrationRate: 62.1, confidence: 78 },
          { year: 2027, totalMarket: 31200000, evMarket: 22100000, penetrationRate: 70.8, confidence: 72 },
          { year: 2028, totalMarket: 32100000, evMarket: 25600000, penetrationRate: 79.8, confidence: 65 },
          { year: 2029, totalMarket: 32800000, evMarket: 28200000, penetrationRate: 86.0, confidence: 58 },
          { year: 2030, totalMarket: 33500000, evMarket: 30100000, penetrationRate: 89.9, confidence: 52 }
        ];

        setMarketData(mockMarketData);
        setBrandData(mockBrandData);
        setRegionData(mockRegionData);
        setInsights(mockInsights);
        setForecasts(mockForecasts);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketData();
  }, [selectedTimeRange, selectedCategory, selectedRegion]);

  const formatNumber = (num: number) => {
    if (num >= 10000) {
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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载市场数据...</p>
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
                <TrendingUp className="h-8 w-8 mr-3" />
                市场趋势
              </h1>
              <p className="text-gray-600 mt-1">新能源汽车市场深度分析与趋势预测</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新数据
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总销量</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(3900000)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +30.2%
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">市场渗透率</p>
                  <p className="text-2xl font-bold text-gray-900">46.0%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2.8%
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均售价</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(176000)}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -5.1%
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">充电桩数量</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(8000000)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +45.3%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                销量趋势
              </CardTitle>
              <CardDescription>月度销量及增长趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        formatNumber(value),
                        name === 'totalSales' ? '总销量' : name === 'bevSales' ? '纯电动' : '插电混动'
                      ]}
                      labelFormatter={(label) => `${label}月`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="totalSales" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.6}
                      name="总销量"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bevSales" 
                      stackId="2" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="纯电动"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="phevSales" 
                      stackId="2" 
                      stroke="#F59E0B" 
                      fill="#F59E0B" 
                      fillOpacity={0.6}
                      name="插电混动"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Market Share Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                品牌市场份额
              </CardTitle>
              <CardDescription>主要品牌销量占比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={brandData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ brand, marketShare }) => `${brand} ${marketShare}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="marketShare"
                    >
                      {brandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, '市场份额']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              区域市场表现
            </CardTitle>
            <CardDescription>各地区销量及渗透率对比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'sales' ? formatNumber(value) : `${value}%`,
                      name === 'sales' ? '销量' : '渗透率'
                    ]}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="sales" 
                    fill="#3B82F6" 
                    name="销量"
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="penetrationRate" 
                    fill="#10B981" 
                    name="渗透率"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                市场洞察
              </CardTitle>
              <CardDescription>最新市场动态和趋势分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 5).map((insight) => (
                  <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getInsightIcon(insight.type)}
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact === 'high' ? '高影响' : insight.impact === 'medium' ? '中影响' : '低影响'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{insight.category}</span>
                        <span>{insight.source}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>置信度: {insight.confidence}%</span>
                        <span>{insight.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                市场预测
              </CardTitle>
              <CardDescription>未来6年市场发展预测</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={forecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'penetrationRate' ? `${value}%` : formatNumber(value),
                        name === 'totalMarket' ? '总市场' : name === 'evMarket' ? '新能源市场' : '渗透率'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="totalMarket" 
                      stroke="#6B7280" 
                      strokeWidth={2}
                      name="总市场"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="evMarket" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="新能源市场"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="penetrationRate" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="渗透率"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              品牌表现排行
            </CardTitle>
            <CardDescription>主要品牌销量、份额及增长对比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">排名</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">品牌</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">销量</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">市场份额</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">增长率</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">车型数</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">平均售价</th>
                  </tr>
                </thead>
                <tbody>
                  {brandData.map((brand, index) => (
                    <tr key={brand.brand} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: brand.color }}
                          ></div>
                          <span className="font-medium text-gray-900">{brand.brand}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatNumber(brand.sales)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {brand.marketShare}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`flex items-center justify-end ${
                          brand.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {brand.growthRate > 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(brand.growthRate)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {brand.models}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(brand.avgPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketTrends;