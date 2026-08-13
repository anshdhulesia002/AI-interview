import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/apiService';
import { ROUTES } from '../../utils/constants';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Password Strength Calculator
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'Weak', color: 'bg-red-500' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 4:
        return { score: 100, label: 'Very Strong', color: 'bg-emerald-500' };
      case 3:
        return { score: 75, label: 'Strong', color: 'bg-sky-500' };
      case 2:
        return { score: 50, label: 'Medium', color: 'bg-amber-500' };
      default:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Real-time Input Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!hasLetter || !hasNumber || !hasSpecial) {
      newErrors.password = 'Password must contain letters, numbers, and a special character (!@#$%^&*)';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
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
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('pendingEmail', formData.email);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'This email is already in use';
      setErrors({ email: 'This email is already in use', general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start practicing AI mock interviews in less than 2 minutes"
    >
      <div className="space-y-6">

        {/* General Registration Error Alert Banner */}
        {errors.general && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            error={errors.name}
            prefixIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            error={errors.email}
            prefixIcon={<Mail className="w-4 h-4" />}
          />

          {/* Password Input with Dynamic Strength Indicator */}
          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              prefixIcon={<Lock className="w-4 h-4" />}
            />

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-content-muted">Password Strength</span>
                  <span className="text-content-primary">{passwordStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-base rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
            }}
            error={errors.confirmPassword}
            prefixIcon={<ShieldCheck className="w-4 h-4" />}
          />

          {/* Terms & Conditions Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-content-secondary">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => {
                  setFormData({ ...formData, agreeTerms: e.target.checked });
                  if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
                }}
                className="mt-0.5 w-4 h-4 rounded bg-surface-base border-border-default text-sky-600 focus:ring-sky-500 focus:ring-offset-0"
              />
              <span>
                I agree to the{' '}
                <a href="#terms" className="font-bold text-sky-500 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="font-bold text-sky-500 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-[11px] font-medium text-red-400 mt-1">{errors.agreeTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center mt-2 shadow-lg shadow-sky-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Free Account
          </Button>
        </form>

        {/* Toggle to Login */}
        <div className="text-center pt-2 text-xs text-content-secondary">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-bold text-sky-500 hover:text-sky-400 transition-colors">
            Sign in
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
};

export default SignupPage;
