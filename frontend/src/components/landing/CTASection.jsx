import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ROUTES } from '../../utils/constants';

export const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-900 via-sky-950 to-gray-950 p-10 sm:p-16 border border-sky-500/30 shadow-2xl shadow-sky-950/50 text-center">
          
          {/* Animated Glow Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/20 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs sm:text-sm font-semibold shadow-md"
            >
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>Start Your Practice Session Today</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
            >
              Ready to Turn Interview Stress Into Job Offers?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-sky-100/80 leading-relaxed max-w-2xl mx-auto"
            >
              Join 500,000+ candidates using AI-driven mock interviews to land offers at Google, Meta, Amazon, and top startups.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={ROUTES.REGISTER}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-base px-8 py-3.5 shadow-xl shadow-sky-500/30 bg-sky-500 hover:bg-sky-400 text-white font-bold"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Free Mock Interview
                </Button>
              </Link>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-sky-200/70 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free 14-day trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cancel anytime
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
