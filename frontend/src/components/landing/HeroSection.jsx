import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Mic, Code2, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ROUTES } from '../../utils/constants';

export const HeroSection = () => {
  const companyLogos = ['Google', 'Meta', 'Netflix', 'Amazon', 'Microsoft', 'Apple'];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Text Container */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Animated Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>Next-Gen AI Mock Interview Simulator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-content-secondary text-xs">v2.0 Released</span>
          </motion.div>

          {/* High-Impact Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-content-primary leading-[1.1]"
          >
            Master Technical Interviews with{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-600 bg-clip-text text-transparent">
              Real-Time AI Feedback
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-content-secondary leading-relaxed max-w-2xl mx-auto"
          >
            Conduct realistic voice and coding mock interviews tailored to your target company. Get instant AI scoring, STAR method coaching, and actionable feedback.
          </motion.p>

          {/* CTA Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link to={ROUTES.REGISTER}>
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-3.5 shadow-lg shadow-sky-500/25"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Start Free Mock Interview
              </Button>
            </Link>

            <a href="#how-it-works">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-base px-6 py-3.5"
                leftIcon={<Play className="w-4 h-4 fill-current text-sky-400" />}
              >
                Watch Interactive Demo
              </Button>
            </a>
          </motion.div>

          {/* Guarantee Subtext */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-6 text-xs text-content-muted pt-2"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free 14-day trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
          </motion.div>
        </div>

        {/* Dashboard Preview Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 relative max-w-5xl mx-auto"
        >
          {/* Main Screenshot Container */}
          <div className="relative rounded-2xl overflow-hidden border border-border-default shadow-2xl bg-surface-card group">
            <img
              src="/hero_dashboard.jpg"
              alt="Interview AI Dashboard Preview"
              className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
            />
            
            {/* Dark Gradient Overlay at Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-base/90 via-transparent to-transparent pointer-events-none" />

            {/* Floating Live Badge 1: Voice Waveform Indicator */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-6 left-6 glass-effect p-3.5 rounded-xl border border-sky-500/30 shadow-xl hidden sm:flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-content-primary">Voice AI Active</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-3 bg-sky-400 rounded-full animate-pulse" />
                  <span className="w-1.5 h-5 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-2 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  <span className="w-1.5 h-4 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                  <span className="text-[10px] text-content-muted ml-1">Analyzing Speech...</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Live Badge 2: Candidate Readiness Score */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute bottom-8 right-6 glass-effect p-4 rounded-xl border border-emerald-500/30 shadow-xl hidden sm:flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-content-muted font-medium">Readiness Score</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-content-primary">94.8%</span>
                  <span className="text-xs font-bold text-emerald-400">+12% vs last week</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Live Badge 3: Code Evaluation */}
            <motion.div
              animate={{ x: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute bottom-8 left-6 glass-effect px-4 py-3 rounded-xl border border-border-default shadow-xl hidden sm:flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-content-primary">Time Complexity</p>
                <p className="text-sky-400 font-mono">O(N log N) - Optimal</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Company Trust Section */}
        <div className="mt-20 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-content-muted">
            Engineers hired at top tech companies use Interview AI
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70">
            {companyLogos.map((logo) => (
              <span key={logo} className="text-lg md:text-xl font-bold font-mono tracking-wider text-content-secondary hover:text-content-primary transition-colors">
                {logo}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
