import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Facebook,
  ArrowRight,
  Shield,
  FileText,
  HelpCircle
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: '产品服务',
      links: [
        { name: '智能分析', href: '/intelligence' },
        { name: '车型数据', href: '/intelligence/vehicles' },
        { name: '市场趋势', href: '/intelligence/trends' },
        { name: '竞争分析', href: '/intelligence/competitors' },
        { name: 'API服务', href: '/api-docs' }
      ]
    },
    {
      title: '解决方案',
      links: [
        { name: '企业版', href: '/enterprise' },
        { name: '开发者', href: '/developers' },
        { name: '数据服务', href: '/data-services' },
        { name: '定制化', href: '/custom-solutions' },
        { name: '合作伙伴', href: '/partners' }
      ]
    },
    {
      title: '支持中心',
      links: [
        { name: '帮助文档', href: '/help' },
        { name: '常见问题', href: '/faq' },
        { name: '联系我们', href: '/contact' },
        { name: '技术支持', href: '/support' },
        { name: '培训资源', href: '/training' }
      ]
    },
    {
      title: '公司信息',
      links: [
        { name: '关于我们', href: '/about' },
        { name: '新闻动态', href: '/news' },
        { name: '招聘信息', href: '/careers' },
        { name: '投资者关系', href: '/investors' },
        { name: '媒体中心', href: '/media' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: '邮箱',
      value: 'contact@china-ev-intelligence.com',
      href: 'mailto:contact@china-ev-intelligence.com'
    },
    {
      icon: Phone,
      label: '电话',
      value: '+86 400-123-4567',
      href: 'tel:+8640012345678'
    },
    {
      icon: MapPin,
      label: '地址',
      value: '北京市朝阳区建国门外大街1号',
      href: null
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h3 className="text-2xl font-bold text-white">
                订阅我们的资讯
              </h3>
              <p className="mt-2 text-gray-300">
                获取最新的新能源汽车行业分析报告和市场动态
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">
                  邮箱地址
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:max-w-xs"
                  placeholder="输入您的邮箱"
                />
                <div className="mt-3 sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    订阅
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                中国新能源汽车智能平台
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              专注于中国新能源汽车市场的智能数据分析平台，为行业提供专业的市场洞察、竞争分析和趋势预测服务。
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-gray-300 text-sm">{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex flex-wrap items-center space-x-6">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} 中国新能源汽车智能平台. 保留所有权利.
              </p>
              <div className="flex items-center space-x-4 mt-2 md:mt-0">
                <Link 
                  to="/privacy" 
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Shield className="h-3 w-3" />
                  <span>隐私政策</span>
                </Link>
                <Link 
                  to="/terms" 
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <FileText className="h-3 w-3" />
                  <span>服务条款</span>
                </Link>
                <Link 
                  to="/help" 
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <HelpCircle className="h-3 w-3" />
                  <span>帮助中心</span>
                </Link>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>ICP备案号: 京ICP备12345678号</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">京公网安备 11010502012345号</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;