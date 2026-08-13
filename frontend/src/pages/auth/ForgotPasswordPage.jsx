import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/apiService';
import { ROUTES } from '../../utils/constants';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      const token = response.data?.resetToken || 'demo_token';
      setResetToken(token);
      setIsSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to process password reset request';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isSubmitted ? 'Reset Link Ready' : 'Reset Password'}
      subtitle={
        isSubmitted
          ? `Password reset link generated for ${email}`
          : 'Enter your account email to receive a password reset link'
      }
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            prefixIcon={<Mail className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center shadow-lg shadow-sky-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Send Reset Link
          </Button>

          <div className="text-center pt-4 border-t border-border-subtle">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-xs font-semibold text-content-secondary hover:text-sky-400"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-6 text-center">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
            <p className="text-xs font-bold">Password Reset Link Generated!</p>
          </div>

          <p className="text-xs text-content-secondary leading-relaxed">
            Please check your email inbox. We have sent a secure password reset link to your email.
          </p>

          <div className="space-y-3 pt-2">

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsSubmitted(false)}
              className="w-full justify-center gap-2 cursor-pointer"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Request Another Link
            </Button>

            <Link to={ROUTES.LOGIN} className="block">
              <Button variant="ghost" size="md" className="w-full justify-center">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
