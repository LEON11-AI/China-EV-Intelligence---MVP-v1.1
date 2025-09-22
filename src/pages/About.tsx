import React from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Star
} from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: '专业专注',
      description: '专注于新能源汽车行业，提供最专业的数据分析和市场洞察',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      title: '创新驱动',
      description: '运用最新的AI技术和数据科学方法，持续创新分析工具和服务',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: '可靠安全',
      description: '确保数据的准确性和安全性，为客户提供可信赖的分析结果',
      color: 'text-green-600'
    },
    {
      icon: Heart,
      title: '客户至上',
      description: '以客户需求为中心，提供个性化的解决方案和优质服务',
      color: 'text-red-600'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: '公司成立',
      description: '在北京成立，专注新能源汽车市场分析'
    },
    {
      year: '2021',
      title: '产品上线',
      description: '推出第一版数据分析平台，服务首批客户'
    },
    {
      year: '2022',
      title: 'AI集成',
      description: '集成人工智能技术，提升分析能力和准确性'
    },
    {
      year: '2023',
      title: '规模扩张',
      description: '客户数量突破1000家，覆盖全国主要城市'
    },
    {
      year: '2024',
      title: '国际化',
      description: '开始拓展海外市场，服务全球客户'
    }
  ];

  const team = [
    {
      name: '张明',
      position: '创始人 & CEO',
      description: '15年汽车行业经验，曾任职于知名汽车制造商和咨询公司',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20chinese%20businessman%20ceo%20portrait%20in%20suit%20confident%20smile%20office%20background&image_size=square',
      education: '清华大学 MBA',
      experience: '15年行业经验'
    },
    {
      name: '李华',
      position: 'CTO & 联合创始人',
      description: '资深技术专家，专注于大数据和人工智能技术应用',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20chinese%20tech%20executive%20cto%20portrait%20glasses%20modern%20office&image_size=square',
      education: '北京大学 计算机博士',
      experience: '12年技术经验'
    },
    {
      name: '王芳',
      position: '数据科学总监',
      description: '数据科学专家，负责算法模型开发和数据分析方法论',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20chinese%20woman%20data%20scientist%20portrait%20confident%20tech%20background&image_size=square',
      education: '斯坦福大学 统计学博士',
      experience: '10年数据科学经验'
    },
    {
      name: '陈强',
      position: '市场总监',
      description: '市场营销专家，深度了解新能源汽车市场和客户需求',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20chinese%20marketing%20director%20portrait%20business%20suit%20modern%20office&image_size=square',
      education: '复旦大学 市场营销硕士',
      experience: '8年市场经验'
    }
  ];

  const achievements = [
    {
      icon: Users,
      number: '1000+',
      label: '服务客户',
      description: '覆盖制造商、经销商、投资机构等'
    },
    {
      icon: Globe,
      number: '50+',
      label: '覆盖城市',
      description: '服务网络遍布全国主要城市'
    },
    {
      icon: Award,
      number: '10+',
      label: '行业奖项',
      description: '获得多项技术创新和服务质量奖项'
    },
    {
      icon: TrendingUp,
      number: '99.9%',
      label: '数据准确率',
      description: '通过严格的数据验证和质量控制'
    }
  ];

  const partners = [
    '比亚迪', '蔚来汽车', '小鹏汽车', '理想汽车', '特斯拉中国',
    '上汽集团', '北汽新能源', '广汽埃安', '长城汽车', '吉利汽车'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              行业领先的数据分析平台
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              关于我们
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              我们是一家专注于中国新能源汽车市场的数据分析公司，致力于为行业参与者提供最准确、最及时、最有价值的市场洞察和商业智能服务。
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-blue-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">我们的使命</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  通过先进的数据分析技术和深度的行业洞察，帮助新能源汽车行业的每一个参与者做出更明智的商业决策，推动整个行业的健康发展和创新进步。
                </p>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">我们的愿景</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  成为中国新能源汽车行业最值得信赖的数据分析和商业智能服务提供商，为行业的数字化转型和智能化发展贡献力量。
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">核心优势</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>行业最全面的数据覆盖</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>AI驱动的智能分析算法</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>实时更新的市场数据</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>专业的行业分析团队</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>定制化的解决方案</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              核心价值观
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              这些价值观指导着我们的每一个决策和行动
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6`}>
                    <value.icon className={`h-8 w-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              发展历程
            </h2>
            <p className="text-xl text-gray-600">
              见证我们的成长足迹
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              核心团队
            </h2>
            <p className="text-xl text-gray-600">
              经验丰富的专业团队
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center text-gray-500">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {member.education}
                    </div>
                    <div className="flex items-center justify-center text-gray-500">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {member.experience}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              我们的成就
            </h2>
            <p className="text-xl text-gray-600">
              用数字说话的成果
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <achievement.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{achievement.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">{achievement.label}</div>
                <div className="text-gray-600">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              合作伙伴
            </h2>
            <p className="text-xl text-gray-600">
              与行业领先企业携手共进
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                <span className="text-lg font-semibold text-gray-700">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            加入我们的成功故事
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            让我们一起推动新能源汽车行业的发展，创造更美好的未来
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              了解更多
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              联系我们
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// 【修复】: 在文件的最底部，加上这一行关键的“默认导出”声明
export default About;