import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export const GoogleOAuthModal = ({ isOpen, onClose, onAuthenticate, isLoading, apiError }) => {
  const [step, setStep] = useState(1); // Step 1: Select Email, Step 2: Enter Password
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (!googleEmail) {
      setLocalError('Please enter your Google account email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(googleEmail)) {
      setLocalError('Please enter a valid Google email address');
      return;
    }
    setLocalError('');
    setStep(2);
  };

  const handleSelectPredefined = (email, name) => {
    setGoogleEmail(email);
    setGoogleName(name);
    setLocalError('');
    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!googlePassword) {
      setLocalError('Please enter correct password');
      return;
    }
    if (googlePassword.length < 6) {
      setLocalError('Please enter correct password');
      return;
    }
    setLocalError('');
    onAuthenticate({ email: googleEmail, password: googlePassword, name: googleName || googleEmail.split('@')[0] });
  };

  const handleResetModal = () => {
    setStep(1);
    setGooglePassword('');
    setLocalError('');
    onClose();
  };

  const currentError = localError || apiError;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetModal}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-md bg-surface-card border border-border-default shadow-2xl rounded-3xl p-6 sm:p-8 z-10 space-y-6"
        >
          {/* Header with Google Logo & Close button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white border border-gray-200 shadow-sm shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-content-primary tracking-tight">
                  {step === 1 ? 'Sign in with Google' : 'Google Account Verification'}
                </h3>
                <p className="text-xs text-content-secondary">
                  {step === 1 ? 'Choose a Google Account for Interview AI' : `Verify password for ${googleEmail}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetModal}
              className="p-1.5 rounded-xl text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {currentError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{currentError}</span>
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Quick Account Options */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-content-muted block">
                  Saved Accounts
                </label>

                <button
                  type="button"
                  onClick={() => handleSelectPredefined('alex.rivera@gmail.com', 'Alex Rivera')}
                  className="w-full p-3 rounded-2xl bg-surface-base border border-border-default hover:border-sky-500/50 flex items-center justify-between transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-400 font-extrabold text-xs flex items-center justify-center border border-sky-500/30">
                      AR
                    </div>
                    <div>
                      <p className="text-xs font-bold text-content-primary">Alex Rivera</p>
                      <p className="text-[11px] text-content-muted">alex.rivera@gmail.com</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-border-subtle" />
                <span className="absolute bg-surface-card px-3 text-[10px] font-bold uppercase tracking-wider text-content-muted">
                  Or enter another account
                </span>
              </div>

              {/* Manual Google Account Input Form */}
              <form onSubmit={handleNextStep} className="space-y-4">
                <Input
                  label="Google Email Address"
                  type="email"
                  placeholder="name@gmail.com"
                  value={googleEmail}
                  onChange={(e) => {
                    setGoogleEmail(e.target.value);
                    if (localError) setLocalError('');
                  }}
                  prefixIcon={<Mail className="w-4 h-4" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-lg shadow-sky-500/20"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Password Verification
                </Button>
              </form>
            </>
          ) : (
            /* STEP 2: PASSWORD VERIFICATION FORM */
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-surface-base border border-border-default flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs font-bold text-content-primary truncate">{googleEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change
                </button>
              </div>

              <Input
                label="Google Account Password"
                type="password"
                placeholder="••••••••"
                value={googlePassword}
                onChange={(e) => {
                  setGooglePassword(e.target.value);
                  if (localError) setLocalError('');
                }}
                prefixIcon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full justify-center shadow-lg shadow-sky-500/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Verify Password & Complete Sign In
              </Button>
            </form>
          )}

          {/* Disclaimer */}
          <p className="text-[11px] text-content-muted text-center leading-relaxed">
            By continuing, Google credentials will be authenticated securely with Interview AI.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GoogleOAuthModal;
