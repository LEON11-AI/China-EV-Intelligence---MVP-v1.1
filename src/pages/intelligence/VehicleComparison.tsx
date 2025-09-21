import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Car, 
  X, 
  Plus, 
  Search, 
  Star, 
  Zap, 
  Fuel, 
  Users, 
  Calendar, 
  Gauge, 
  Timer, 
  Weight, 
  Ruler, 
  Shield, 
  Smartphone, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Download, 
  Share2, 
  BarChart3, 
  Info, 
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: 'BEV' | 'PHEV' | 'HEV' | 'FCEV';
  price: {
    min: number;
    max: number;
    currency: string;
  };
  range: number;
  batteryCapacity?: number;
  chargingTime?: {
    fast: number;
    slow: number;
  };
  power: number;
  torque: number;
  acceleration: number;
  topSpeed: number;
  seatingCapacity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
  weight: number;
  driveType: 'FWD' | 'RWD' | 'AWD';
  suspension: {
    front: string;
    rear: string;
  };
  safety: {
    rating: number;
    features: string[];
  };
  technology: {
    infotainment: string;
    connectivity: string[];
    autonomy: string;
  };
  images: string[];
  thumbnail: string;
  description: string;
  highlights: string[];
  pros: string[];
  cons: string[];
  marketPosition: 'Entry' | 'Mid-range' | 'Premium' | 'Luxury';
  availability: {
    regions: string[];
    launchDate: string;
    status: 'Available' | 'Pre-order' | 'Coming Soon' | 'Discontinued';
  };
  salesData: {
    monthlyUnits: number;
    yearlyUnits: number;
    marketShare: number;
    trend: 'up' | 'down' | 'stable';
  };
  rating: {
    overall: number;
    performance: number;
    efficiency: number;
    comfort: number;
    technology: number;
    value: number;
    reviewCount: number;
  };
  isFavorite: boolean;
  isBookmarked: boolean;
  lastUpdated: string;
}

interface ComparisonCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  fields: ComparisonField[];
}

interface ComparisonField {
  key: string;
  label: string;
  unit?: string;
  format?: (value: any) => string;
  highlight?: 'higher' | 'lower' | 'none';
}

const VehicleComparison: React.FC = () => {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('basic');

  const comparisonCategories: ComparisonCategory[] = [
    {
      id: 'basic',
      name: '基本信息',
      icon: <Info className="h-4 w-4" />,
      fields: [
        { key: 'name', label: '车型名称' },
        { key: 'brand', label: '品牌' },
        { key: 'year', label: '年款', unit: '年' },
        { key: 'type', label: '动力类型', format: (value) => getVehicleTypeLabel(value) },
        { key: 'marketPosition', label: '市场定位', format: (value) => getMarketPositionLabel(value) },
        { key: 'price', label: '价格区间', format: (value) => formatPrice(value) }
      ]
    },
    {
      id: 'performance',
      name: '性能参数',
      icon: <Gauge className="h-4 w-4" />,
      fields: [
        { key: 'power', label: '最大功率', unit: 'kW', highlight: 'higher' },
        { key: 'torque', label: '最大扭矩', unit: 'Nm', highlight: 'higher' },
        { key: 'acceleration', label: '百公里加速', unit: 's', highlight: 'lower' },
        { key: 'topSpeed', label: '最高车速', unit: 'km/h', highlight: 'higher' },
        { key: 'driveType', label: '驱动方式', format: (value) => getDriveTypeLabel(value) }
      ]
    },
    {
      id: 'energy',
      name: '能耗续航',
      icon: <Zap className="h-4 w-4" />,
      fields: [
        { key: 'range', label: 'CLTC续航', unit: 'km', highlight: 'higher' },
        { key: 'batteryCapacity', label: '电池容量', unit: 'kWh', highlight: 'higher' },
        { key: 'chargingTime.fast', label: '快充时间', unit: 'min', highlight: 'lower', format: (value) => value || 'N/A' },
        { key: 'chargingTime.slow', label: '慢充时间', unit: 'h', highlight: 'lower', format: (value) => value || 'N/A' }
      ]
    },
    {
      id: 'dimensions',
      name: '尺寸重量',
      icon: <Ruler className="h-4 w-4" />,
      fields: [
        { key: 'dimensions.length', label: '长度', unit: 'mm', highlight: 'higher' },
        { key: 'dimensions.width', label: '宽度', unit: 'mm', highlight: 'higher' },
        { key: 'dimensions.height', label: '高度', unit: 'mm', highlight: 'higher' },
        { key: 'dimensions.wheelbase', label: '轴距', unit: 'mm', highlight: 'higher' },
        { key: 'weight', label: '整备质量', unit: 'kg', highlight: 'lower' },
        { key: 'seatingCapacity', label: '座位数', unit: '座', highlight: 'higher' }
      ]
    },
    {
      id: 'safety',
      name: '安全配置',
      icon: <Shield className="h-4 w-4" />,
      fields: [
        { key: 'safety.rating', label: '安全评级', unit: '星', highlight: 'higher' },
        { key: 'safety.features', label: '安全配置', format: (value) => value?.join(', ') || 'N/A' }
      ]
    },
    {
      id: 'technology',
      name: '科技配置',
      icon: <Smartphone className="h-4 w-4" />,
      fields: [
        { key: 'technology.infotainment', label: '车机系统' },
        { key: 'technology.autonomy', label: '自动驾驶等级' },
        { key: 'technology.connectivity', label: '互联功能', format: (value) => value?.join(', ') || 'N/A' }
      ]
    },
    {
      id: 'rating',
      name: '用户评价',
      icon: <Star className="h-4 w-4" />,
      fields: [
        { key: 'rating.overall', label: '综合评分', unit: '分', highlight: 'higher' },
        { key: 'rating.performance', label: '性能评分', unit: '分', highlight: 'higher' },
        { key: 'rating.efficiency', label: '能效评分', unit: '分', highlight: 'higher' },
        { key: 'rating.comfort', label: '舒适评分', unit: '分', highlight: 'higher' },
        { key: 'rating.technology', label: '科技评分', unit: '分', highlight: 'higher' },
        { key: 'rating.value', label: '性价比评分', unit: '分', highlight: 'higher' },
        { key: 'rating.reviewCount', label: '评价数量', unit: '条', highlight: 'higher' }
      ]
    },
    {
      id: 'market',
      name: '市场表现',
      icon: <BarChart3 className="h-4 w-4" />,
      fields: [
        { key: 'salesData.monthlyUnits', label: '月销量', unit: '台', highlight: 'higher' },
        { key: 'salesData.yearlyUnits', label: '年销量', unit: '台', highlight: 'higher' },
        { key: 'salesData.marketShare', label: '市场份额', unit: '%', highlight: 'higher' },
        { key: 'salesData.trend', label: '销量趋势', format: (value) => getTrendLabel(value) }
      ]
    }
  ];

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        // 模拟加载车型数据
        const mockVehicles: Vehicle[] = [
          {
            id: '1',
            name: '比亚迪海豹',
            brand: '比亚迪',
            model: '海豹',
            year: 2024,
            type: 'BEV',
            price: { min: 209800, max: 289800, currency: 'CNY' },
            range: 650,
            batteryCapacity: 82.5,
            chargingTime: { fast: 30, slow: 11 },
            power: 390,
            torque: 670,
            acceleration: 3.8,
            topSpeed: 180,
            seatingCapacity: 5,
            dimensions: { length: 4800, width: 1875, height: 1460, wheelbase: 2920 },
            weight: 1885,
            driveType: 'AWD',
            suspension: { front: '双叉臂式独立悬架', rear: '五连杆独立悬架' },
            safety: { rating: 5, features: ['AEB', 'LKA', 'ACC', 'BSD'] },
            technology: { 
              infotainment: '15.6英寸旋转屏', 
              connectivity: ['5G', 'WiFi', 'Bluetooth', 'OTA'], 
              autonomy: 'L2+' 
            },
            images: [],
            thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=BYD%20Seal%20electric%20sedan%20car%20modern%20sleek%20design%20blue%20color&image_size=landscape_4_3',
            description: '比亚迪海豹是一款中大型纯电动轿车，采用e平台3.0技术，具备出色的性能和续航表现。',
            highlights: ['CTB电池车身一体化', 'iTAC智能扭矩控制', '热泵空调系统'],
            pros: ['加速性能优秀', '续航里程长', '配置丰富'],
            cons: ['后排空间一般', '悬架偏硬'],
            marketPosition: 'Mid-range',
            availability: {
              regions: ['中国'],
              launchDate: '2022-05-20',
              status: 'Available'
            },
            salesData: {
              monthlyUnits: 8500,
              yearlyUnits: 95000,
              marketShare: 2.1,
              trend: 'up'
            },
            rating: {
              overall: 4.6,
              performance: 4.8,
              efficiency: 4.5,
              comfort: 4.3,
              technology: 4.7,
              value: 4.4,
              reviewCount: 1250
            },
            isFavorite: true,
            isBookmarked: false,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '2',
            name: '特斯拉Model Y',
            brand: '特斯拉',
            model: 'Model Y',
            year: 2024,
            type: 'BEV',
            price: { min: 263900, max: 363900, currency: 'CNY' },
            range: 688,
            batteryCapacity: 78.4,
            chargingTime: { fast: 27, slow: 10 },
            power: 331,
            torque: 420,
            acceleration: 5.0,
            topSpeed: 217,
            seatingCapacity: 5,
            dimensions: { length: 4750, width: 1921, height: 1624, wheelbase: 2890 },
            weight: 1997,
            driveType: 'RWD',
            suspension: { front: '双叉臂式独立悬架', rear: '多连杆独立悬架' },
            safety: { rating: 5, features: ['Autopilot', 'AEB', 'LKA', 'ACC'] },
            technology: { 
              infotainment: '15英寸中控屏', 
              connectivity: ['4G', 'WiFi', 'Bluetooth', 'OTA'], 
              autonomy: 'L2+' 
            },
            images: [],
            thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Tesla%20Model%20Y%20electric%20SUV%20white%20color%20modern%20minimalist%20design&image_size=landscape_4_3',
            description: '特斯拉Model Y是一款中型纯电动SUV，结合了轿车的操控性和SUV的实用性。',
            highlights: ['Autopilot自动驾驶', '超级充电网络', 'OTA升级'],
            pros: ['自动驾驶先进', '充电网络完善', '品牌影响力强'],
            cons: ['内饰简陋', '做工有待提升', '服务体验不佳'],
            marketPosition: 'Premium',
            availability: {
              regions: ['中国', '美国', '欧洲'],
              launchDate: '2021-01-01',
              status: 'Available'
            },
            salesData: {
              monthlyUnits: 12000,
              yearlyUnits: 135000,
              marketShare: 3.2,
              trend: 'stable'
            },
            rating: {
              overall: 4.3,
              performance: 4.5,
              efficiency: 4.6,
              comfort: 3.9,
              technology: 4.8,
              value: 3.8,
              reviewCount: 2100
            },
            isFavorite: false,
            isBookmarked: true,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '3',
            name: '蔚来ES6',
            brand: '蔚来',
            model: 'ES6',
            year: 2024,
            type: 'BEV',
            price: { min: 358000, max: 526000, currency: 'CNY' },
            range: 610,
            batteryCapacity: 100,
            chargingTime: { fast: 20, slow: 12 },
            power: 360,
            torque: 610,
            acceleration: 4.5,
            topSpeed: 200,
            seatingCapacity: 5,
            dimensions: { length: 4850, width: 1965, height: 1758, wheelbase: 2900 },
            weight: 2285,
            driveType: 'AWD',
            suspension: { front: '双叉臂式独立悬架', rear: '多连杆独立悬架' },
            safety: { rating: 5, features: ['NIO Pilot', 'AEB', 'LKA', 'ACC', 'APA'] },
            technology: { 
              infotainment: 'NOMI智能助手', 
              connectivity: ['5G', 'WiFi', 'Bluetooth', 'OTA'], 
              autonomy: 'L2+' 
            },
            images: [],
            thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=NIO%20ES6%20electric%20SUV%20luxury%20blue%20color%20premium%20design&image_size=landscape_4_3',
            description: '蔚来ES6是一款中大型纯电动SUV，提供换电服务和高端用户体验。',
            highlights: ['换电技术', 'NOMI智能助手', '女王副驾'],
            pros: ['服务体验优秀', '换电便利', '内饰豪华'],
            cons: ['价格较高', '能耗偏高', '可靠性有待验证'],
            marketPosition: 'Luxury',
            availability: {
              regions: ['中国'],
              launchDate: '2018-12-15',
              status: 'Available'
            },
            salesData: {
              monthlyUnits: 4200,
              yearlyUnits: 48000,
              marketShare: 1.1,
              trend: 'down'
            },
            rating: {
              overall: 4.4,
              performance: 4.3,
              efficiency: 3.9,
              comfort: 4.7,
              technology: 4.6,
              value: 3.6,
              reviewCount: 890
            },
            isFavorite: true,
            isBookmarked: true,
            lastUpdated: new Date().toISOString()
          }
        ];

        setAvailableVehicles(mockVehicles);
        // 默认选择前两个车型进行对比
        setSelectedVehicles(mockVehicles.slice(0, 2));
      } catch (error) {
        console.error('Failed to load vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const getVehicleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      BEV: '纯电动',
      PHEV: '插电混动',
      HEV: '混合动力',
      FCEV: '燃料电池'
    };
    return labels[type] || type;
  };

  const getMarketPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      Entry: '入门级',
      'Mid-range': '中端',
      Premium: '高端',
      Luxury: '豪华'
    };
    return labels[position] || position;
  };

  const getDriveTypeLabel = (driveType: string) => {
    const labels: Record<string, string> = {
      FWD: '前驱',
      RWD: '后驱',
      AWD: '四驱'
    };
    return labels[driveType] || driveType;
  };

  const getTrendLabel = (trend: string) => {
    const labels: Record<string, string> = {
      up: '上升',
      down: '下降',
      stable: '稳定'
    };
    return labels[trend] || trend;
  };

  const formatPrice = (price: { min: number; max: number; currency: string }) => {
    const formatter = new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    if (price.min === price.max) {
      return formatter.format(price.min);
    }
    return `${formatter.format(price.min)} - ${formatter.format(price.max)}`;
  };

  const getFieldValue = (vehicle: Vehicle, fieldKey: string) => {
    const keys = fieldKey.split('.');
    let value: any = vehicle;
    
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  };

  const getBestValue = (vehicles: Vehicle[], field: ComparisonField) => {
    if (!field.highlight || field.highlight === 'none') return null;
    
    const values = vehicles.map(v => getFieldValue(v, field.key)).filter(v => v !== undefined && v !== null);
    if (values.length === 0) return null;
    
    if (field.highlight === 'higher') {
      return Math.max(...values.map(v => typeof v === 'number' ? v : 0));
    } else {
      return Math.min(...values.map(v => typeof v === 'number' ? v : Infinity));
    }
  };

  const isHighlighted = (vehicle: Vehicle, field: ComparisonField, bestValue: any) => {
    if (!field.highlight || field.highlight === 'none' || bestValue === null) return false;
    
    const value = getFieldValue(vehicle, field.key);
    return value === bestValue;
  };

  const addVehicle = (vehicle: Vehicle) => {
    if (selectedVehicles.length < 4 && !selectedVehicles.find(v => v.id === vehicle.id)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
    setShowVehicleSelector(false);
  };

  const removeVehicle = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
  };

  const filteredVehicles = availableVehicles.filter(vehicle => 
    !selectedVehicles.find(v => v.id === vehicle.id) &&
    (vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载对比数据...</p>
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
                <BarChart3 className="h-8 w-8 mr-3" />
                车型对比
              </h1>
              <p className="text-gray-600 mt-1">详细对比车型参数和性能</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowVehicleSelector(true)}
                disabled={selectedVehicles.length >= 4}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加车型
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出对比
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>

        {/* Vehicle Selector Modal */}
        {showVehicleSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">选择车型</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVehicleSelector(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索车型..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => addVehicle(vehicle)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={vehicle.thumbnail}
                        alt={vehicle.name}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{vehicle.name}</div>
                        <div className="text-sm text-gray-600">{vehicle.brand} · {vehicle.year}年</div>
                      </div>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Vehicles */}
        {selectedVehicles.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">开始对比</h3>
                <p className="text-gray-600 mb-4">选择车型开始详细对比</p>
                <Button onClick={() => setShowVehicleSelector(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加车型
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Vehicle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {selectedVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicle(vehicle.id)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 z-10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="relative">
                    <img
                      src={vehicle.thumbnail}
                      alt={vehicle.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{vehicle.name}</CardTitle>
                    <CardDescription className="text-xs">{vehicle.brand} · {vehicle.year}年</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold text-blue-600">
                      {formatPrice(vehicle.price)}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        {vehicle.range}km
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                        {vehicle.rating.overall}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {selectedVehicles.length < 4 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Button
                        variant="ghost"
                        onClick={() => setShowVehicleSelector(true)}
                        className="h-full w-full"
                      >
                        <Plus className="h-8 w-8 text-gray-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Category Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {comparisonCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeCategory === category.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Comparison Table */}
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 bg-gray-50 rounded-tl-lg">
                          参数
                        </th>
                        {selectedVehicles.map((vehicle, index) => (
                          <th key={vehicle.id} className={`text-center py-3 px-4 font-medium text-gray-900 bg-gray-50 ${
                            index === selectedVehicles.length - 1 ? 'rounded-tr-lg' : ''
                          }`}>
                            {vehicle.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonCategories
                        .find(cat => cat.id === activeCategory)
                        ?.fields.map((field) => {
                          const bestValue = getBestValue(selectedVehicles, field);
                          
                          return (
                            <tr key={field.key} className="border-t border-gray-200">
                              <td className="py-3 px-4 font-medium text-gray-900 bg-gray-50">
                                {field.label}
                                {field.unit && (
                                  <span className="text-gray-500 text-sm ml-1">({field.unit})</span>
                                )}
                              </td>
                              {selectedVehicles.map((vehicle) => {
                                const value = getFieldValue(vehicle, field.key);
                                const isHighlight = isHighlighted(vehicle, field, bestValue);
                                const displayValue = field.format ? field.format(value) : value;
                                
                                return (
                                  <td key={vehicle.id} className={`py-3 px-4 text-center ${
                                    isHighlight ? 'bg-green-50 text-green-800 font-semibold' : ''
                                  }`}>
                                    <div className="flex items-center justify-center">
                                      {isHighlight && (
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                      )}
                                      <span>{displayValue || 'N/A'}</span>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {selectedVehicles.map((vehicle) => (
                <Card key={`pros-cons-${vehicle.id}`}>
                  <CardHeader>
                    <CardTitle className="text-sm">{vehicle.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          优点
                        </h4>
                        <ul className="space-y-1">
                          {vehicle.pros.map((pro, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start">
                              <span className="w-1 h-1 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                          <XCircle className="h-4 w-4 mr-1" />
                          缺点
                        </h4>
                        <ul className="space-y-1">
                          {vehicle.cons.map((con, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start">
                              <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleComparison;