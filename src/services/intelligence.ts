import { apiService } from './api';
import { 
  IntelligenceReport, 
  VehicleModel, 
  MarketTrend, 
  CompetitorAnalysis,
  ApiResponse 
} from '../types';

export class IntelligenceService {
  /**
   * 获取智能分析报告列表
   */
  static async getReports(params?: {
    page?: number;
    limit?: number;
    category?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<ApiResponse<IntelligenceReport[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.dateRange) {
      queryParams.append('startDate', params.dateRange.start);
      queryParams.append('endDate', params.dateRange.end);
    }

    return apiService.get(`/intelligence/reports?${queryParams.toString()}`);
  }

  /**
   * 获取单个智能分析报告详情
   */
  static async getReportById(id: string): Promise<ApiResponse<IntelligenceReport>> {
    return apiService.get(`/intelligence/reports/${id}`);
  }

  /**
   * 生成新的智能分析报告
   */
  static async generateReport(data: {
    title: string;
    category: string;
    parameters: Record<string, any>;
    description?: string;
  }): Promise<ApiResponse<IntelligenceReport>> {
    return apiService.post('/intelligence/reports/generate', data);
  }

  /**
   * 获取车型数据列表
   */
  static async getVehicleModels(params?: {
    page?: number;
    limit?: number;
    brand?: string;
    category?: string;
    priceRange?: {
      min: number;
      max: number;
    };
    sortBy?: 'price' | 'sales' | 'rating' | 'releaseDate';
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<VehicleModel[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.brand) queryParams.append('brand', params.brand);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.priceRange) {
      queryParams.append('minPrice', params.priceRange.min.toString());
      queryParams.append('maxPrice', params.priceRange.max.toString());
    }
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return apiService.get(`/intelligence/vehicles?${queryParams.toString()}`);
  }

  /**
   * 获取单个车型详细信息
   */
  static async getVehicleModelById(id: string): Promise<ApiResponse<VehicleModel>> {
    return apiService.get(`/intelligence/vehicles/${id}`);
  }

  /**
   * 比较多个车型
   */
  static async compareVehicles(vehicleIds: string[]): Promise<ApiResponse<{
    vehicles: VehicleModel[];
    comparison: Record<string, any>;
  }>> {
    return apiService.post('/intelligence/vehicles/compare', { vehicleIds });
  }

  /**
   * 获取市场趋势数据
   */
  static async getMarketTrends(params?: {
    timeframe?: '1M' | '3M' | '6M' | '1Y' | '2Y';
    category?: string;
    region?: string;
  }): Promise<ApiResponse<MarketTrend[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.timeframe) queryParams.append('timeframe', params.timeframe);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.region) queryParams.append('region', params.region);

    return apiService.get(`/intelligence/market-trends?${queryParams.toString()}`);
  }

  /**
   * 获取竞争对手分析
   */
  static async getCompetitorAnalysis(params?: {
    targetBrand?: string;
    competitors?: string[];
    analysisType?: 'pricing' | 'features' | 'market-share' | 'comprehensive';
  }): Promise<ApiResponse<CompetitorAnalysis[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.targetBrand) queryParams.append('targetBrand', params.targetBrand);
    if (params?.competitors) {
      params.competitors.forEach(competitor => {
        queryParams.append('competitors', competitor);
      });
    }
    if (params?.analysisType) queryParams.append('analysisType', params.analysisType);

    return apiService.get(`/intelligence/competitor-analysis?${queryParams.toString()}`);
  }

  /**
   * 获取品牌列表
   */
  static async getBrands(): Promise<ApiResponse<string[]>> {
    return apiService.get('/intelligence/brands');
  }

  /**
   * 获取车型分类列表
   */
  static async getCategories(): Promise<ApiResponse<string[]>> {
    return apiService.get('/intelligence/categories');
  }

  /**
   * 搜索车型
   */
  static async searchVehicles(query: string, filters?: {
    brand?: string;
    category?: string;
    priceRange?: {
      min: number;
      max: number;
    };
  }): Promise<ApiResponse<VehicleModel[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    
    if (filters?.brand) queryParams.append('brand', filters.brand);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.priceRange) {
      queryParams.append('minPrice', filters.priceRange.min.toString());
      queryParams.append('maxPrice', filters.priceRange.max.toString());
    }

    return apiService.get(`/intelligence/vehicles/search?${queryParams.toString()}`);
  }

  /**
   * 获取用户收藏的车型
   */
  static async getFavoriteVehicles(): Promise<ApiResponse<VehicleModel[]>> {
    return apiService.get('/intelligence/vehicles/favorites');
  }

  /**
   * 添加车型到收藏
   */
  static async addToFavorites(vehicleId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post(`/intelligence/vehicles/${vehicleId}/favorite`);
  }

  /**
   * 从收藏中移除车型
   */
  static async removeFromFavorites(vehicleId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete(`/intelligence/vehicles/${vehicleId}/favorite`);
  }

  /**
   * 获取推荐车型
   */
  static async getRecommendedVehicles(params?: {
    budget?: number;
    preferences?: string[];
    usage?: 'daily' | 'business' | 'family' | 'luxury';
  }): Promise<ApiResponse<VehicleModel[]>> {
    return apiService.post('/intelligence/vehicles/recommendations', params || {});
  }

  /**
   * 获取数据统计概览
   */
  static async getStatistics(): Promise<ApiResponse<{
    totalVehicles: number;
    totalBrands: number;
    totalReports: number;
    lastUpdated: string;
    popularBrands: Array<{ name: string; count: number }>;
    popularCategories: Array<{ name: string; count: number }>;
  }>> {
    return apiService.get('/intelligence/statistics');
  }

  /**
   * 导出数据
   */
  static async exportData(type: 'vehicles' | 'reports' | 'trends', format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    const response = await fetch(`${apiService.getBaseURL()}/intelligence/export/${type}?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  /**
   * 获取用户使用统计
   */
  static async getUserUsageStats(): Promise<ApiResponse<{
    reportsGenerated: number;
    vehiclesViewed: number;
    favoritesCount: number;
    lastActivity: string;
    monthlyUsage: Array<{ month: string; reports: number; views: number }>;
  }>> {
    return apiService.get('/intelligence/user/stats');
  }
}

export default IntelligenceService;