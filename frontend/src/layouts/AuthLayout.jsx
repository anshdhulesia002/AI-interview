import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Sparkles, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../utils/constants';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-base relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Back To Home Navigation Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-xs font-semibold text-content-secondary hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-surface-card border border-border-default rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-2xl group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-sky-400" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-content-primary">
              Interview<span className="text-sky-500">AI</span>
            </span>
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          </Link>

          {title && <h2 className="text-2xl font-bold tracking-tight text-content-primary">{title}</h2>}
          {subtitle && <p className="text-xs text-content-secondary">{subtitle}</p>}
        </div>

        {/* Auth Page Content */}
        {children}
      </motion.div>

      {/* Footer Copyright */}
      <div className="mt-8 text-center text-xs text-content-muted">
        <p>&copy; {new Date().getFullYear()} Interview AI. Secure 256-bit encrypted authentication.</p>
      </div>

    </div>
  );
};
