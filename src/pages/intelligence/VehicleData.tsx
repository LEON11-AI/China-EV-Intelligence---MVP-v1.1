import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Car, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  Share2, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Zap, 
  Fuel, 
  Users, 
  Calendar, 
  MapPin, 
  Award, 
  Info, 
  ExternalLink, 
  Download, 
  Compare, 
  Bookmark
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
  range: number; // km
  batteryCapacity?: number; // kWh
  chargingTime?: {
    fast: number; // minutes (10-80%)
    slow: number; // hours (0-100%)
  };
  power: number; // kW
  torque: number; // Nm
  acceleration: number; // 0-100km/h seconds
  topSpeed: number; // km/h
  seatingCapacity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
  weight: number; // kg
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

interface VehicleFilters {
  brand: string;
  type: string;
  priceRange: [number, number];
  rangeMin: number;
  marketPosition: string;
  availability: string;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const VehicleData: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compare'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState<VehicleFilters>({
    brand: 'all',
    type: 'all',
    priceRange: [0, 1000000],
    rangeMin: 0,
    marketPosition: 'all',
    availability: 'all',
    searchQuery: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

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
          },
          {
            id: '4',
            name: '理想L9',
            brand: '理想',
            model: 'L9',
            year: 2024,
            type: 'PHEV',
            price: { min: 459800, max: 509800, currency: 'CNY' },
            range: 1315,
            batteryCapacity: 44.5,
            chargingTime: { fast: 30, slow: 5.5 },
            power: 330,
            torque: 620,
            acceleration: 5.3,
            topSpeed: 180,
            seatingCapacity: 6,
            dimensions: { length: 5218, width: 1998, height: 1800, wheelbase: 3105 },
            weight: 2520,
            driveType: 'AWD',
            suspension: { front: '双叉臂式独立悬架', rear: '多连杆独立悬架' },
            safety: { rating: 5, features: ['理想AD Max', 'AEB', 'LKA', 'ACC'] },
            technology: { 
              infotainment: '理想同学', 
              connectivity: ['5G', 'WiFi', 'Bluetooth', 'OTA'], 
              autonomy: 'L2+' 
            },
            images: [],
            thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Li%20Auto%20L9%20PHEV%20SUV%20large%20family%20car%20silver%20color&image_size=landscape_4_3',
            description: '理想L9是一款大型增程式电动SUV，专为家庭用户设计，提供出色的空间和舒适性。',
            highlights: ['增程式动力', '6座布局', '冰箱彩电大沙发'],
            pros: ['空间宽敞', '续航无忧', '配置丰富'],
            cons: ['价格昂贵', '油耗偏高', '操控一般'],
            marketPosition: 'Luxury',
            availability: {
              regions: ['中国'],
              launchDate: '2022-08-30',
              status: 'Available'
            },
            salesData: {
              monthlyUnits: 6800,
              yearlyUnits: 78000,
              marketShare: 1.8,
              trend: 'up'
            },
            rating: {
              overall: 4.5,
              performance: 4.2,
              efficiency: 4.0,
              comfort: 4.8,
              technology: 4.6,
              value: 4.1,
              reviewCount: 1560
            },
            isFavorite: false,
            isBookmarked: false,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '5',
            name: '小鹏P7',
            brand: '小鹏',
            model: 'P7',
            year: 2024,
            type: 'BEV',
            price: { min: 239900, max: 339900, currency: 'CNY' },
            range: 706,
            batteryCapacity: 86.2,
            chargingTime: { fast: 31, slow: 12 },
            power: 316,
            torque: 485,
            acceleration: 4.3,
            topSpeed: 170,
            seatingCapacity: 5,
            dimensions: { length: 4888, width: 1896, height: 1450, wheelbase: 2998 },
            weight: 1980,
            driveType: 'RWD',
            suspension: { front: '双叉臂式独立悬架', rear: '多连杆独立悬架' },
            safety: { rating: 5, features: ['XPILOT', 'AEB', 'LKA', 'ACC'] },
            technology: { 
              infotainment: '小P智能助手', 
              connectivity: ['5G', 'WiFi', 'Bluetooth', 'OTA'], 
              autonomy: 'L2+' 
            },
            images: [],
            thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=XPeng%20P7%20electric%20sedan%20sleek%20coupe%20design%20red%20color&image_size=landscape_4_3',
            description: '小鹏P7是一款中大型纯电动轿跑，以智能化和长续航为主要卖点。',
            highlights: ['NGP高速自动导航', '706km超长续航', '智能座舱'],
            pros: ['续航里程长', '智能化程度高', '外观时尚'],
            cons: ['后排空间小', '悬架偏硬', '品牌认知度低'],
            marketPosition: 'Mid-range',
            availability: {
              regions: ['中国'],
              launchDate: '2020-04-27',
              status: 'Available'
            },
            salesData: {
              monthlyUnits: 3200,
              yearlyUnits: 38000,
              marketShare: 0.9,
              trend: 'down'
            },
            rating: {
              overall: 4.2,
              performance: 4.4,
              efficiency: 4.5,
              comfort: 3.8,
              technology: 4.7,
              value: 4.0,
              reviewCount: 720
            },
            isFavorite: false,
            isBookmarked: false,
            lastUpdated: new Date().toISOString()
          }
        ];

        setVehicles(mockVehicles);
        setFilteredVehicles(mockVehicles);
        setTotalPages(Math.ceil(mockVehicles.length / itemsPerPage));
      } catch (error) {
        console.error('Failed to load vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  useEffect(() => {
    // 应用过滤器和排序
    let filtered = vehicles;

    // 按品牌过滤
    if (filters.brand !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.brand === filters.brand);
    }

    // 按类型过滤
    if (filters.type !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === filters.type);
    }

    // 按价格范围过滤
    filtered = filtered.filter(vehicle => 
      vehicle.price.min >= filters.priceRange[0] && 
      vehicle.price.max <= filters.priceRange[1]
    );

    // 按续航里程过滤
    if (filters.rangeMin > 0) {
      filtered = filtered.filter(vehicle => vehicle.range >= filters.rangeMin);
    }

    // 按市场定位过滤
    if (filters.marketPosition !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.marketPosition === filters.marketPosition);
    }

    // 按可用性过滤
    if (filters.availability !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.availability.status === filters.availability);
    }

    // 按搜索查询过滤
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.description.toLowerCase().includes(query)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price.min;
          bValue = b.price.min;
          break;
        case 'range':
          aValue = a.range;
          bValue = b.range;
          break;
        case 'rating':
          aValue = a.rating.overall;
          bValue = b.rating.overall;
          break;
        case 'popularity':
          aValue = a.salesData.monthlyUnits;
          bValue = b.salesData.monthlyUnits;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        default:
          aValue = a.salesData.monthlyUnits;
          bValue = b.salesData.monthlyUnits;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredVehicles(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [vehicles, filters]);

  const getVehicleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      BEV: '纯电动',
      PHEV: '插电混动',
      HEV: '混合动力',
      FCEV: '燃料电池'
    };
    return labels[type] || type;
  };

  const getVehicleTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      BEV: 'bg-green-100 text-green-800 border-green-200',
      PHEV: 'bg-blue-100 text-blue-800 border-blue-200',
      HEV: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      FCEV: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
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

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVehicles.slice(startIndex, endIndex);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else if (prev.length < 3) {
        return [...prev, vehicleId];
      }
      return prev;
    });
  };

  const handleFavorite = async (vehicleId: string) => {
    try {
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, isFavorite: !vehicle.isFavorite }
          : vehicle
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleBookmark = async (vehicleId: string) => {
    try {
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, isBookmarked: !vehicle.isBookmarked }
          : vehicle
      ));
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载车型数据...</p>
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
                <Car className="h-8 w-8 mr-3" />
                车型数据
              </h1>
              <p className="text-gray-600 mt-1">探索和对比电动车型信息</p>
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
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'compare' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('compare')}
                  className="rounded-l-none"
                >
                  <Compare className="h-4 w-4" />
                </Button>
              </div>
              {selectedVehicles.length > 0 && (
                <Button>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  对比 ({selectedVehicles.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="搜索车型、品牌或型号..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    品牌
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部品牌</option>
                    <option value="比亚迪">比亚迪</option>
                    <option value="特斯拉">特斯拉</option>
                    <option value="蔚来">蔚来</option>
                    <option value="理想">理想</option>
                    <option value="小鹏">小鹏</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    动力类型
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部类型</option>
                    <option value="BEV">纯电动</option>
                    <option value="PHEV">插电混动</option>
                    <option value="HEV">混合动力</option>
                    <option value="FCEV">燃料电池</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    市场定位
                  </label>
                  <select
                    value={filters.marketPosition}
                    onChange={(e) => setFilters(prev => ({ ...prev, marketPosition: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部定位</option>
                    <option value="Entry">入门级</option>
                    <option value="Mid-range">中端</option>
                    <option value="Premium">高端</option>
                    <option value="Luxury">豪华</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    可用性
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部状态</option>
                    <option value="Available">现货</option>
                    <option value="Pre-order">预订</option>
                    <option value="Coming Soon">即将上市</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最低续航 (km)
                  </label>
                  <input
                    type="number"
                    value={filters.rangeMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, rangeMin: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    <option value="popularity-desc">热度最高</option>
                    <option value="price-asc">价格最低</option>
                    <option value="price-desc">价格最高</option>
                    <option value="range-desc">续航最长</option>
                    <option value="rating-desc">评分最高</option>
                    <option value="year-desc">最新款</option>
                    <option value="name-asc">名称 A-Z</option>
                  </select>
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
                <div className="text-2xl font-bold text-gray-900">{filteredVehicles.length}</div>
                <div className="text-sm text-gray-600">车型总数</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredVehicles.filter(v => v.type === 'BEV').length}
                </div>
                <div className="text-sm text-gray-600">纯电动</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredVehicles.filter(v => v.type === 'PHEV').length}
                </div>
                <div className="text-sm text-gray-600">插电混动</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredVehicles.filter(v => v.isFavorite).length}
                </div>
                <div className="text-sm text-gray-600">已收藏</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Grid/List */}
        {getCurrentPageItems().length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无车型</h3>
                <p className="text-gray-600 mb-4">没有找到符合条件的车型</p>
                <Button onClick={() => setFilters({
                  brand: 'all',
                  type: 'all',
                  priceRange: [0, 1000000],
                  rangeMin: 0,
                  marketPosition: 'all',
                  availability: 'all',
                  searchQuery: '',
                  sortBy: 'popularity',
                  sortOrder: 'desc'
                })}>
                  重置过滤器
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {getCurrentPageItems().map((vehicle) => (
                  <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={vehicle.thumbnail}
                        alt={vehicle.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          getVehicleTypeColor(vehicle.type)
                        }`}>
                          {getVehicleTypeLabel(vehicle.type)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFavorite(vehicle.id)}
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        >
                          <Heart className={`h-4 w-4 ${
                            vehicle.isFavorite ? 'fill-current text-red-500' : 'text-gray-600'
                          }`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(vehicle.id)}
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        >
                          <Bookmark className={`h-4 w-4 ${
                            vehicle.isBookmarked ? 'fill-current text-blue-500' : 'text-gray-600'
                          }`} />
                        </Button>
                      </div>
                      {viewMode === 'compare' && (
                        <div className="absolute bottom-3 left-3">
                          <Button
                            variant={selectedVehicles.includes(vehicle.id) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleVehicleSelect(vehicle.id)}
                            disabled={!selectedVehicles.includes(vehicle.id) && selectedVehicles.length >= 3}
                            className="bg-white/80 hover:bg-white"
                          >
                            {selectedVehicles.includes(vehicle.id) ? (
                              <Minus className="h-4 w-4 mr-1" />
                            ) : (
                              <Plus className="h-4 w-4 mr-1" />
                            )}
                            对比
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                          <CardDescription>{vehicle.brand} · {vehicle.year}年</CardDescription>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(vehicle.salesData.trend)}
                          <span className="text-sm text-gray-600">
                            {vehicle.salesData.monthlyUnits.toLocaleString()}/月
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-lg font-semibold text-blue-600">
                          {formatPrice(vehicle.price)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-green-500 mr-2" />
                            <span>{vehicle.range}km</span>
                          </div>
                          <div className="flex items-center">
                            <Fuel className="h-4 w-4 text-blue-500 mr-2" />
                            <span>{vehicle.power}kW</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-purple-500 mr-2" />
                            <span>{vehicle.seatingCapacity}座</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-orange-500 mr-2" />
                            <span>{vehicle.acceleration}s</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{vehicle.rating.overall}</span>
                            <span className="text-xs text-gray-500 ml-1">({vehicle.rating.reviewCount})</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {getMarketPositionLabel(vehicle.marketPosition)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {getCurrentPageItems().map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0">
                          <img
                            src={vehicle.thumbnail}
                            alt={vehicle.name}
                            className="w-20 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{vehicle.name}</h3>
                              <p className="text-sm text-gray-600">{vehicle.brand} · {vehicle.year}年</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-blue-600">
                                {formatPrice(vehicle.price)}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                {getTrendIcon(vehicle.salesData.trend)}
                                <span className="ml-1">{vehicle.salesData.monthlyUnits.toLocaleString()}/月</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                getVehicleTypeColor(vehicle.type)
                              }`}>
                                {getVehicleTypeLabel(vehicle.type)}
                              </span>
                              <span className="flex items-center">
                                <Zap className="h-3 w-3 text-green-500 mr-1" />
                                {vehicle.range}km
                              </span>
                              <span className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                {vehicle.rating.overall}
                              </span>
                              <span>{getMarketPositionLabel(vehicle.marketPosition)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFavorite(vehicle.id)}
                                className="h-8 px-2"
                              >
                                <Heart className={`h-4 w-4 ${
                                  vehicle.isFavorite ? 'fill-current text-red-500' : 'text-gray-400'
                                }`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookmark(vehicle.id)}
                                className="h-8 px-2"
                              >
                                <Bookmark className={`h-4 w-4 ${
                                  vehicle.isBookmarked ? 'fill-current text-blue-500' : 'text-gray-400'
                                }`} />
                              </Button>
                              {viewMode === 'compare' && (
                                <Button
                                  variant={selectedVehicles.includes(vehicle.id) ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleVehicleSelect(vehicle.id)}
                                  disabled={!selectedVehicles.includes(vehicle.id) && selectedVehicles.length >= 3}
                                  className="h-8 px-2 text-xs"
                                >
                                  {selectedVehicles.includes(vehicle.id) ? '已选' : '对比'}
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                                查看
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
                  显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} 条，共 {filteredVehicles.length} 条车型
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

export default VehicleData;