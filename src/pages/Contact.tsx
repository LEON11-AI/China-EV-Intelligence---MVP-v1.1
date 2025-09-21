import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Headphones,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  contactType: 'sales' | 'support' | 'partnership' | 'other';
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    contactType: 'sales'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: '邮箱联系',
      content: 'contact@china-ev-intelligence.com',
      description: '我们会在24小时内回复您的邮件',
      color: 'text-blue-600'
    },
    {
      icon: Phone,
      title: '电话咨询',
      content: '+86 400-123-4567',
      description: '工作日 9:00-18:00 专业客服为您服务',
      color: 'text-green-600'
    },
    {
      icon: MapPin,
      title: '公司地址',
      content: '北京市朝阳区建国门外大街1号',
      description: '欢迎预约到访，深入了解我们的服务',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: '服务时间',
      content: '周一至周五 9:00-18:00',
      description: '节假日我们也会及时回复在线咨询',
      color: 'text-orange-600'
    }
  ];

  const contactTypes = [
    { value: 'sales', label: '销售咨询', icon: Users, description: '了解产品功能和价格' },
    { value: 'support', label: '技术支持', icon: Headphones, description: '获取技术帮助和指导' },
    { value: 'partnership', label: '合作洽谈', icon: Globe, description: '探讨业务合作机会' },
    { value: 'other', label: '其他咨询', icon: MessageSquare, description: '其他问题和建议' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟API调用
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        contactType: 'sales'
      });
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = form.name && form.email && form.subject && form.message;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">提交成功！</h2>
              <p className="text-gray-600 mb-6">
                感谢您的咨询，我们已收到您的信息。我们的团队会在24小时内与您取得联系。
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="w-full"
              >
                继续浏览
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            联系我们
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            我们随时准备为您提供专业的服务和支持，让我们一起探讨如何助力您的业务发展
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">联系方式</h2>
              <p className="text-gray-600">
                选择最适合您的联系方式，我们的专业团队随时为您服务。
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                    <info.icon className={`h-6 w-6 ${info.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h3>
                    <p className="text-gray-900 font-medium mb-1">{info.content}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 p-6 bg-white rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  预约电话咨询
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  发送邮件
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  在线客服
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">发送消息</CardTitle>
                <CardDescription>
                  请填写以下信息，我们会尽快与您取得联系
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      咨询类型
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contactTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            form.contactType === type.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="contactType"
                            value={type.value}
                            checked={form.contactType === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <type.icon className={`h-5 w-5 mr-3 ${
                            form.contactType === type.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className={`text-sm font-medium ${
                              form.contactType === type.value ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {type.label}
                            </div>
                            <div className={`text-xs ${
                              form.contactType === type.value ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {type.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        姓名 *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="请输入您的姓名"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱 *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="请输入您的邮箱"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        公司名称
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={handleInputChange}
                        placeholder="请输入您的公司名称"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        联系电话
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleInputChange}
                        placeholder="请输入您的联系电话"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      主题 *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={handleInputChange}
                      placeholder="请简要描述您的咨询主题"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      详细信息 *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={form.message}
                      onChange={handleInputChange}
                      placeholder="请详细描述您的需求或问题，我们会根据您的具体情况提供最适合的解决方案"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-500">
                      * 为必填项
                    </p>
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          发送中...
                        </>
                      ) : (
                        <>
                          发送消息
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">常见问题</h2>
            <p className="text-xl text-gray-600">
              以下是客户经常询问的问题，或许能帮助您快速找到答案
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  如何开始使用平台？
                </h3>
                <p className="text-gray-600">
                  您可以先注册免费账户体验基础功能，然后根据需要选择合适的订阅计划。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  数据更新频率如何？
                </h3>
                <p className="text-gray-600">
                  我们的数据每日更新，重要市场事件会实时更新，确保您获得最新的市场信息。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  是否提供API接口？
                </h3>
                <p className="text-gray-600">
                  是的，我们提供完整的API接口，方便您将数据集成到自己的系统中。
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  支持哪些付款方式？
                </h3>
                <p className="text-gray-600">
                  我们支持银行转账、支付宝、微信支付等多种付款方式，企业客户可申请发票。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  如何获得技术支持？
                </h3>
                <p className="text-gray-600">
                  您可以通过在线客服、邮件或电话联系我们的技术支持团队，我们提供7×24小时服务。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  数据安全如何保障？
                </h3>
                <p className="text-gray-600">
                  我们采用企业级安全措施，包括数据加密、访问控制和定期安全审计。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;