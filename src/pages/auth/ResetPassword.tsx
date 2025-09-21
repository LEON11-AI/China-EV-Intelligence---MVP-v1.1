import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import { authService } from '../../services/auth';

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const passwordRequirements = [
    { test: (pwd: string) => pwd.length >= 8, text: '至少8个字符' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: '包含大写字母' },
    { test: (pwd: string) => /[a-z]/.test(pwd), text: '包含小写字母' },
    { test: (pwd: string) => /\d/.test(pwd), text: '包含数字' },
    { test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), text: '包含特殊字符' },
  ];

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        await authService.validateResetToken(token);
        setIsTokenValid(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = '请输入新密码';
    } else {
      const failedRequirements = passwordRequirements.filter(
        req => !req.test(formData.password)
      );
      if (failedRequirements.length > 0) {
        newErrors.password = '密码不符合安全要求';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认新密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !token) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      navigate('/login', { 
        state: { 
          message: '密码重置成功！请使用新密码登录。' 
        } 
      });
    } catch (error: any) {
      console.error('Password reset failed:', error);
      setErrors({ 
        general: error.response?.data?.message || '密码重置失败，请重试' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Loading state while validating token
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">验证重置链接...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (isTokenValid === false) {
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
              链接无效
            </h2>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    重置链接已失效
                  </h3>
                  <p className="text-sm text-gray-600">
                    此密码重置链接已过期或无效。请重新申请密码重置。
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <Link to="/forgot-password">
                    <Button className="w-full">
                      重新申请重置密码
                    </Button>
                  </Link>

                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      返回登录
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
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
            设置新密码
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            请输入您的新密码
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>重置密码</CardTitle>
            <CardDescription>
              请设置一个安全的新密码
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="relative">
                <Input
                  label="新密码"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="请输入新密码"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">密码要求：</p>
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.test(formData.password);
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          {isValid ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={cn(
                            'text-sm',
                            isValid ? 'text-green-600' : 'text-red-600'
                          )}>
                            {req.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="relative">
                <Input
                  label="确认新密码"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="请再次输入新密码"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? '重置中...' : '重置密码'}
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
      </div>
    </div>
  );
};

export default ResetPassword;