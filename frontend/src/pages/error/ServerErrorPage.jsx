import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServerCrash, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../utils/constants';

export const ServerErrorPage = () => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface-base text-content-primary flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient Red Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-surface-card border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative z-10"
      >
        
        {/* Floating 500 Icon Header */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-500 to-rose-400 p-0.5 shadow-xl shadow-red-500/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-surface-card rounded-[22px] flex items-center justify-center">
              <ServerCrash className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <span className="absolute -top-2 -right-3 px-2.5 py-0.5 rounded-full bg-red-500 text-white font-mono text-xs font-black shadow-md">
            500
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
            Internal Server Exception
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Our Express backend server encountered an unexpected error while processing your request. Please try refreshing.
          </p>
        </div>

        {/* Collapsible Error Trace */}
        <div className="rounded-2xl bg-surface-base border border-border-subtle overflow-hidden text-left">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="w-full p-3.5 text-xs font-bold text-content-muted flex items-center justify-between hover:text-content-primary transition-colors"
          >
            <span>Error Stack Trace Details</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="p-3.5 bg-black/40 border-t border-border-subtle font-mono text-[11px] text-red-400 overflow-x-auto">
              500 InternalServerError: Failed to process request pipeline at ExpressController.handleException
            </div>
          )}
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            isLoading={isRetrying}
            onClick={handleRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Retry API Request
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            leftIcon={<Home className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg shadow-sky-500/20"
          >
            Return to Dashboard
          </Button>
        </div>

      </motion.div>

    </div>
  );
};

export default ServerErrorPage;
