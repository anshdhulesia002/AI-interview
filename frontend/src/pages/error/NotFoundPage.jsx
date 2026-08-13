import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../utils/constants';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-base text-content-primary flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient Glow Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-surface-card border border-border-default rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative z-10"
      >
        
        {/* Floating 404 Icon Header */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-xl shadow-sky-500/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-surface-card rounded-[22px] flex items-center justify-center">
              <Compass className="w-10 h-10 text-sky-400 animate-spin-slow" />
            </div>
          </div>
          <span className="absolute -top-2 -right-3 px-2.5 py-0.5 rounded-full bg-sky-500 text-white font-mono text-xs font-black shadow-md">
            404
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            The interview room, evaluation report, or route you are looking for has moved or does not exist.
          </p>
        </div>

        {/* Quick Suggestions Box */}
        <div className="p-4 rounded-2xl bg-surface-base border border-border-subtle text-left space-y-2">
          <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">Suggested Destination Routes:</span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="p-2 rounded-xl bg-surface-card border border-border-subtle hover:border-sky-500/40 text-content-primary hover:text-sky-400 text-left transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Candidate Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.INTERVIEWS)}
              className="p-2 rounded-xl bg-surface-card border border-border-subtle hover:border-sky-500/40 text-content-primary hover:text-sky-400 text-left transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" /> Practice Suites
            </button>
          </div>
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

export default NotFoundPage;
