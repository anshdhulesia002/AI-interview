import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { ROUTES } from '../../utils/constants';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Interviews', path: ROUTES.INTERVIEWS },
    { label: 'Design System', path: '/design-system' },
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-border-default/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-xl shadow-glow-sky group-hover:bg-sky-500/20 transition-all"
          >
            <Bot className="w-5 h-5 text-sky-500" />
          </motion.div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-xl tracking-tight text-content-primary">
              Interview<span className="text-sky-500">AI</span>
            </span>
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-card/60 p-1.5 rounded-full border border-border-subtle shadow-sm backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-sky-500/15 border border-sky-500/30 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={isActive ? 'text-sky-500 font-bold' : 'text-content-secondary hover:text-content-primary'}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Authentication Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light Mode Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl text-content-secondary hover:text-content-primary bg-surface-card border border-border-default hover:bg-surface-hover transition-colors focus:outline-none"
            aria-label="Toggle theme mode"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-sky-600" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Login Button */}
          <Link to={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>

          {/* Signup Button */}
          <Link to={ROUTES.REGISTER}>
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu & Theme Controls Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-content-secondary hover:text-content-primary bg-surface-card border border-border-default"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-content-primary hover:bg-surface-hover focus:outline-none"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-border-default glass-effect overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-3">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-content-primary hover:bg-surface-hover flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    {location.pathname === link.path && <span className="w-2 h-2 rounded-full bg-sky-500" />}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-border-subtle flex flex-col gap-2.5">
                <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    Log In
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
