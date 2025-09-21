import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  ArrowRight,
  BarChart3,
  Car,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  Star,
  Play,
  Download,
  Eye,
  Target,
  Lightbulb,
  Database
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: '智能数据分析',
      description: '基于AI的深度数据分析，提供精准的市场洞察和趋势预测',
      color: 'text-blue-600'
    },
    {
      icon: Car,
      title: '全面车型数据',
      description: '覆盖全国新能源汽车品牌和车型的完整数据库',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: '市场趋势监控',
      description: '实时监控市场动态，把握行业发展趋势和机遇',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: '竞争对手分析',
      description: '深入分析竞争对手策略，制定有效的市场竞争方案',
      color: 'text-orange-600'
    },
    {
      icon: Shield,
      title: '数据安全保障',
      description: '企业级安全防护，确保您的数据安全和隐私保护',
      color: 'text-red-600'
    },
    {
      icon: Globe,
      title: 'API接口服务',
      description: '开放的API接口，轻松集成到您的业务系统中',
      color: 'text-indigo-600'
    }
  ];

  const stats = [
    { label: '车型数据', value: '10,000+', icon: Car },
    { label: '品牌覆盖', value: '200+', icon: Target },
    { label: '用户信赖', value: '50,000+', icon: Users },
    { label: '数据更新', value: '实时', icon: Clock }
  ];

  const testimonials = [
    {
      name: '张总',
      company: '某新能源汽车制造商',
      content: '这个平台帮助我们更好地了解市场动态，制定了更精准的产品策略。',
      rating: 5
    },
    {
      name: '李经理',
      company: '汽车行业分析机构',
      content: '数据准确性很高，分析报告非常专业，是我们工作中不可缺少的工具。',
      rating: 5
    },
    {
      name: '王研究员',
      company: '投资咨询公司',
      content: '平台提供的竞争分析功能帮助我们识别了很多投资机会。',
      rating: 5
    }
  ];

  const useCases = [
    {
      icon: Lightbulb,
      title: '产品规划',
      description: '基于市场数据制定产品开发策略'
    },
    {
      icon: Target,
      title: '市场定位',
      description: '精准定位目标市场和用户群体'
    },
    {
      icon: TrendingUp,
      title: '投资决策',
      description: '为投资决策提供数据支持'
    },
    {
      icon: Database,
      title: '业务分析',
      description: '深入分析业务表现和市场机会'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <Badge className="mb-4" variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                AI驱动的智能分析
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                中国新能源汽车
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  智能分析平台
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                专业的新能源汽车市场数据分析平台，为您提供精准的市场洞察、竞争分析和趋势预测，助力您在新能源汽车行业中抢占先机。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    免费开始体验
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5" />
                  观看演示
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">市场趋势分析</h3>
                  <Badge variant="success">实时数据</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">纯电动车型</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-green-600">+15.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">插电混动</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-blue-600">+8.7%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">燃料电池</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-6 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-purple-600">+3.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              强大的功能特性
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我们提供全面的新能源汽车市场分析工具，帮助您做出更明智的商业决策
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              应用场景
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              无论您是制造商、投资者还是分析师，我们都能为您提供专业的解决方案
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <useCase.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              客户评价
            </h2>
            <p className="text-xl text-gray-600">
              看看我们的客户怎么说
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            准备开始您的智能分析之旅？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            立即注册，免费体验我们的专业分析工具，获取您的第一份市场洞察报告
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                免费注册
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                联系销售
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;