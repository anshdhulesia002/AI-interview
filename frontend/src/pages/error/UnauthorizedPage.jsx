import { useNavigate } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../utils/constants';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-base text-content-primary flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient Amber Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-surface-card border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative z-10"
      >
        
        {/* Floating 401 Icon Header */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-surface-card rounded-[22px] flex items-center justify-center">
              <Lock className="w-10 h-10 text-amber-400" />
            </div>
          </div>
          <span className="absolute -top-2 -right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-mono text-xs font-black shadow-md">
            401
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
            Unauthorized Access
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            You must be logged in with candidate authorization credentials to access this protected area.
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.LOGIN)}
            leftIcon={<LogIn className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg shadow-sky-500/20"
          >
            Sign In to Account
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate(ROUTES.HOME)}
            leftIcon={<Home className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Home
          </Button>
        </div>

      </motion.div>

    </div>
  );
};

export default UnauthorizedPage;
