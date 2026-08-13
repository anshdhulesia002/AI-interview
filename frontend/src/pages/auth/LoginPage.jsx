import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/apiService';
import { ROUTES } from '../../utils/constants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Real-time Input Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      const { user: userProfile, accessToken } = response.data || {};
      login(userProfile || { name: 'Alex Rivera', email: formData.email }, accessToken || 'jwt_token_123');
      navigate(ROUTES.DASHBOARD);
    } catch {
      setErrors({ general: 'Please enter correct password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your AI mock interview practice"
    >
      <div className="space-y-6">
        
        {/* Invalid Credentials General Error Alert Banner */}
        {errors.general && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Email & Password Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email || errors.general) setErrors({ ...errors, email: null, general: null });
            }}
            error={errors.email}
            prefixIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password || errors.general) setErrors({ ...errors, password: null, general: null });
            }}
            error={errors.password}
            prefixIcon={<Lock className="w-4 h-4" />}
          />

          {/* Remember Me & Forgot Password Links */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-content-secondary hover:text-content-primary">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded bg-surface-base border-border-default text-sky-600 focus:ring-sky-500 focus:ring-offset-0"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-semibold text-sky-500 hover:text-sky-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center mt-2 shadow-lg shadow-sky-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Toggle to Signup */}
        <div className="text-center pt-2 text-xs text-content-secondary">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.REGISTER} className="font-bold text-sky-500 hover:text-sky-400 transition-colors">
            Create an account
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
};

export default LoginPage;
