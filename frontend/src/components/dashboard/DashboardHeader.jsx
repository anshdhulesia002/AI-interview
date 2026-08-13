import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Sparkles, User, Settings, LogOut, Trash2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Toast } from '../ui/Toast';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';
import { notificationService } from '../../services/apiService';
import socketService from '../../services/socketService';
import { ROUTES } from '../../utils/constants';

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Notification State
  const [notificationsList, setNotificationsList] = useState([
    { _id: 'notif_1', title: 'Interview Report Ready', message: 'Senior Technical Practice Round evaluation report is ready for review.', type: 'success', isRead: false, createdAt: new Date() },
    { _id: 'notif_2', title: 'Milestone Achievement Unlocked', message: 'You earned the "7-Day Streak Legend" milestone badge! +300 XP awarded.', type: 'achievement', isRead: false, createdAt: new Date() },
    { _id: 'notif_3', title: 'Practice Streak Reminder', message: 'Maintain your 12-day practice streak by completing a mock interview today.', type: 'warning', isRead: false, createdAt: new Date() },
  ]);

  // Toast State
  const [toastConfig, setToastConfig] = useState({ isVisible: false, title: '', message: '', type: 'info' });

  const showToast = (title, message, type = 'info') => {
    setToastConfig({ isVisible: true, title, message, type });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, 4000);
  };

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifs = async () => {
      try {
        const response = await notificationService.getNotifications();
        if (isMounted && response.data?.notifications) {
          setNotificationsList(response.data.notifications);
        }
      } catch {
        // Fallback default array retained
      }
    };

    fetchNotifs();

    // Socket.io Real-Time Live Notification Listener
    const userId = user?._id || 'usr_1';
    socketService.initSocketClient(userId);

    const handleLiveNotification = (newNotif) => {
      setNotificationsList((prev) => [
        {
          _id: newNotif._id || Date.now().toString(),
          title: newNotif.title || 'Live System Update',
          message: newNotif.message || 'Real-time WebSocket update received.',
          type: newNotif.type || 'info',
          isRead: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
      showToast(newNotif.title || 'Live Real-Time Notification', newNotif.message || 'New live update.', 'info');
    };

    socketService.subscribeToNotifications(handleLiveNotification);

    return () => {
      isMounted = false;
      socketService.unsubscribeFromNotifications(handleLiveNotification);
    };
  }, [user]);

  const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await notificationService.markAsRead(id);
      showToast('Notification Updated', 'Marked notification as read.', 'success');
    } catch {
      // Local state already updated
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationService.markAllAsRead();
      showToast('Notifications Cleared', 'All notifications marked as read.', 'success');
    } catch {
      // Local state already updated
    }
  };

  const handleDeleteNotification = async (id) => {
    setNotificationsList((prev) => prev.filter((n) => n._id !== id));
    try {
      await notificationService.deleteNotification(id);
      showToast('Notification Deleted', 'Item removed from your notifications.', 'info');
    } catch {
      // Local state already updated
    }
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-surface-card border-b border-border-default flex items-center justify-between gap-4 sticky top-0 z-30">
      
      {/* Global Search Trigger Bar */}
      <div className="flex-1 max-w-md relative">
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full pl-9 pr-12 py-1.5 text-xs bg-surface-base border border-border-default rounded-xl text-content-muted hover:text-content-primary hover:border-sky-500/50 flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-content-muted group-hover:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <span className="truncate">Search interviews, reports, candidates...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-content-muted bg-surface-hover border border-border-subtle rounded select-none">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        
        {/* Upgrade Pro Badge Callout */}
        <div className="hidden lg:flex items-center">
          <Badge variant="primary" size="md" className="gap-1.5 cursor-pointer shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Pro Plan Active</span>
          </Badge>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-content-secondary hover:text-content-primary bg-surface-base border border-border-default hover:bg-surface-hover transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl text-content-secondary hover:text-content-primary bg-surface-base border border-border-default hover:bg-surface-hover transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-extrabold flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-surface-card animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-card border border-border-default shadow-2xl rounded-2xl p-4 z-50 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-content-primary">Notifications</h4>
                    {unreadCount > 0 && (
                      <Badge variant="primary" size="sm" className="bg-sky-500/10 text-sky-400 font-extrabold text-[10px]">
                        {unreadCount} Unread
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notificationsList.length === 0 ? (
                    <div className="py-6 text-center text-xs text-content-muted">No notifications found</div>
                  ) : (
                    notificationsList.map((n) => (
                      <div
                        key={n._id}
                        className={`p-3 rounded-xl border transition-colors space-y-1.5 relative group ${
                          n.isRead ? 'bg-surface-base/40 border-border-subtle opacity-75' : 'bg-surface-base border-sky-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />}
                            <span className="text-xs font-bold text-content-primary">{n.title}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {!n.isRead && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsRead(n._id)}
                                title="Mark as Read"
                                className="p-1 rounded-lg text-content-muted hover:text-sky-400 hover:bg-surface-hover transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteNotification(n._id)}
                              title="Delete Notification"
                              className="p-1 rounded-lg text-content-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-content-secondary leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 focus:outline-none"
          >
            <Avatar name={user?.name || 'Alex Rivera'} size="md" status="online" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-surface-card border border-border-default shadow-2xl rounded-2xl p-2 z-50 space-y-1"
              >
                <div className="p-3 border-b border-border-subtle mb-1">
                  <p className="text-xs font-bold text-content-primary truncate">{user?.name || 'Alex Rivera'}</p>
                  <p className="text-[11px] text-content-muted truncate">{user?.email || 'alex@example.com'}</p>
                </div>

                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-content-primary hover:bg-surface-hover rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-sky-400" /> My Profile
                </Link>

                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-content-primary hover:bg-surface-hover rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-sky-400" /> Account Settings
                </Link>

                <div className="my-1 border-t border-border-subtle" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Universal Global Search Engine Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Global Toast Component */}
      <Toast
        isVisible={toastConfig.isVisible}
        title={toastConfig.title}
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={() => setToastConfig((prev) => ({ ...prev, isVisible: false }))}
      />

    </header>
  );
};
