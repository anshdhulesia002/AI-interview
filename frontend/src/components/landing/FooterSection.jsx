import { Link } from 'react-router-dom';
import { Bot, Sparkles, Send } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { Button } from '../ui/Button';

export const FooterSection = () => {
  return (
    <footer className="bg-surface-card border-t border-border-default pt-16 pb-12 text-content-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border-subtle">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-xl">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-content-primary">
                Interview<span className="text-sky-500">AI</span>
              </span>
              <Sparkles className="w-4 h-4 text-sky-400" />
            </Link>

            <p className="text-sm text-content-secondary leading-relaxed max-w-sm">
              The world&apos;s leading conversational AI technical interview platform. Practice real-time voice and coding mock rounds tailored for FAANG and top tech companies.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-sm space-y-2">
              <p className="text-xs font-semibold text-content-primary">Subscribe to Interview Insights</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2 text-xs bg-surface-base border border-border-default rounded-lg text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <Button variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Join
                </Button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-content-primary">Product</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-sky-400 transition-colors">AI Voice Interviewer</a></li>
              <li><a href="#features" className="hover:text-sky-400 transition-colors">Interactive IDE</a></li>
              <li><a href="#features" className="hover:text-sky-400 transition-colors">STAR Method Coach</a></li>
              <li><a href="#pricing" className="hover:text-sky-400 transition-colors">Pricing Plans</a></li>
              <li><Link to="/design-system" className="hover:text-sky-400 transition-colors">Design System</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-content-primary">Resources</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-sky-400 transition-colors">FAQ</a></li>
              <li><a href="#testimonials" className="hover:text-sky-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">System Design Guide</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">LeetCode Prep Roadmap</a></li>
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-content-primary">Company</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-sky-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Security</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Subtext */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
          <p>&copy; {new Date().getFullYear()} Interview AI Inc. All rights reserved.</p>
          <p>Designed with React 19, Tailwind CSS & Framer Motion.</p>
        </div>

      </div>
    </footer>
  );
};
