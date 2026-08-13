import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Video,
  History,
  BarChart3,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Active navigation links
  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { label: 'Interview', path: ROUTES.INTERVIEWS, icon: <Video className="w-5 h-5 shrink-0" /> },
    { label: 'History', path: '/history', icon: <History className="w-5 h-5 shrink-0" /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5 shrink-0" /> },
    { label: 'Achievements', path: '/achievements', icon: <Award className="w-5 h-5 shrink-0" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const sidebarInnerContent = (
    <div className="flex flex-col h-full bg-surface-card border-r border-border-default select-none overflow-hidden">
      
      {/* Brand Header */}
      <div className={`h-16 border-b border-border-subtle shrink-0 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        {!isCollapsed ? (
          <>
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-xl shrink-0">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
              <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
                <span className="font-extrabold text-lg tracking-tight text-content-primary">
                  Interview<span className="text-sky-500">AI</span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="hidden md:flex p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors shrink-0"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="hidden md:flex relative p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all items-center justify-center group"
            title="Expand Sidebar"
          >
            <Bot className="w-5 h-5 group-hover:opacity-0 transition-opacity" />
            <ChevronRight className="w-5 h-5 absolute opacity-0 group-hover:opacity-100 transition-opacity text-sky-400" />
          </button>
        )}

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="flex md:hidden p-1.5 rounded-lg text-content-muted hover:text-content-primary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={isCollapsed ? item.label : undefined}
              className={`relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'text-sky-400 font-bold'
                  : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'
              }`}
            >
              {/* Active Animated Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 bg-sky-500/10 border border-sky-500/30 rounded-xl -z-0"
                />
              )}

              <span className="relative z-10">{item.icon}</span>

              {!isCollapsed && (
                <span className="relative z-10 truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Logout & Profile Footer */}
      <div className="p-3 border-t border-border-subtle bg-surface-base/50 shrink-0 flex items-center justify-center">
        {isCollapsed ? (
          <button
            type="button"
            onClick={handleLogout}
            className="relative group p-1 rounded-full hover:ring-2 hover:ring-red-500/40 transition-all"
            title="Sign Out"
          >
            <Avatar name={user?.name || 'Alex Rivera'} size="md" status="online" />
            <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
              <LogOut className="w-4 h-4" />
            </div>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar name={user?.name || 'Alex Rivera'} size="md" status="online" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-content-primary truncate">{user?.name || 'Alex Rivera'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant="primary" size="sm">Senior Dev</Badge>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-content-muted hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-xs z-10 h-full"
            >
              {sidebarInnerContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Collapsible Animated Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block h-screen sticky top-0 shrink-0 z-30"
      >
        {sidebarInnerContent}
      </motion.aside>

      {/* Mobile Header Trigger */}
      <div className="md:hidden sticky top-0 z-40 bg-surface-card border-b border-border-default px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-content-primary hover:bg-surface-hover"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-extrabold text-base tracking-tight text-content-primary">
          Interview<span className="text-sky-500">AI</span>
        </span>
        <Avatar name={user?.name || 'Alex Rivera'} size="sm" status="online" />
      </div>
    </>
  );
};
