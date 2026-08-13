import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/apiService';
import { ROUTES } from '../../utils/constants';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!hasLetter || !hasNumber || !hasSpecial) {
      newErrors.password = 'Password must contain letters, numbers, and a special character (!@#$%^&*)';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      if (token) {
        await authService.resetPassword({ token, newPassword: formData.password });
      }
      setIsSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update password. Reset token may be invalid or expired.';
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isSuccess ? 'Password Updated!' : 'Set New Password'}
      subtitle={
        isSuccess
          ? 'Your password has been successfully reset'
          : 'Create a new strong password for your account'
      }
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errors.general}</span>
            </div>
          )}

          <Input
            label="New Password"
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

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              if (errors.confirmPassword || errors.general) setErrors({ ...errors, confirmPassword: null, general: null });
            }}
            error={errors.confirmPassword}
            prefixIcon={<ShieldCheck className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center mt-2 shadow-lg shadow-sky-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Update Password
          </Button>
        </form>
      ) : (
        <div className="space-y-6 text-center">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
            <p className="text-sm font-bold">Password Reset Complete</p>
          </div>

          <p className="text-xs text-content-secondary">
            Redirecting you to the sign in page...
          </p>
        </div>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
