import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setIsEmailSent(true);
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      setError(error.response?.data?.message || '发送重置邮件失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
    } catch (error: any) {
      console.error('Resend email failed:', error);
      setError(error.response?.data?.message || '重发邮件失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img
              className="mx-auto h-12 w-auto"
              src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20electric%20vehicle%20logo%20with%20blue%20and%20green%20colors%20minimalist%20design&image_size=square"
              alt="China EV Intelligence"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              邮件已发送
            </h2>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    重置邮件已发送
                  </h3>
                  <p className="text-sm text-gray-600">
                    我们已向 <span className="font-medium">{email}</span> 发送了密码重置链接。
                  </p>
                  <p className="text-sm text-gray-600">
                    请检查您的邮箱（包括垃圾邮件文件夹）并点击链接重置密码。
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {isLoading ? '重发中...' : '重新发送邮件'}
                  </Button>

                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      返回登录
                    </Button>
                  </Link>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              没有收到邮件？请检查垃圾邮件文件夹或{' '}
              <button
                onClick={handleResendEmail}
                className="font-medium text-blue-600 hover:text-blue-500"
                disabled={isLoading}
              >
                重新发送
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20electric%20vehicle%20logo%20with%20blue%20and%20green%20colors%20minimalist%20design&image_size=square"
            alt="China EV Intelligence"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            重置密码
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            记起密码了？{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              返回登录
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>找回密码</CardTitle>
            <CardDescription>
              输入您的邮箱地址，我们将发送重置密码的链接给您
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="邮箱地址"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  error={error}
                  placeholder="请输入您的邮箱地址"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading || !email}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {isLoading ? '发送中...' : '发送重置邮件'}
                </Button>

                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回登录
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            如果您的邮箱地址存在于我们的系统中，您将收到重置密码的邮件。
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;