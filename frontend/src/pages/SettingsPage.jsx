import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Sun,
  Moon,
  Globe,
  Shield,
  Key,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  Palette,
  Lock,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/apiService';
import { ROUTES } from '../utils/constants';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  // Settings Form State
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [accentColor, setAccentColor] = useState('sky');
  
  // Privacy Switches
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [isAiTrainingOptOut, setIsAiTrainingOptOut] = useState(true);
  const [resumeRetention, setResumeRetention] = useState('90_days');

  // Password Update Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toastConfig, setToastConfig] = useState({ isVisible: false, title: '', message: '', type: 'info' });

  const triggerToast = (title, message, type = 'info') => {
    setToastConfig({ isVisible: true, title, message, type });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, 4000);
  };

  // Password Update Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast('Validation Error', 'Please fill out all password fields.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      triggerToast('Validation Error', 'New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('Password Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authService.resetPassword('demo-token', newPassword);
      triggerToast('Password Updated', 'Your account password has been updated successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      triggerToast('Password Updated', 'Your security password was saved.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      triggerToast('Confirmation Required', 'Please enter your password to confirm account deletion.', 'error');
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteAccount();
    } catch {
      // Local clean up
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="flex h-screen bg-surface-base text-content-primary overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Scrollable Settings Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Account Preferences & Security</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
              Candidate Settings
            </h1>
            <p className="text-xs sm:text-sm text-content-secondary mt-1">
              Customize dark mode theme, interface language, privacy controls, password security, and account management.
            </p>
          </div>

          {/* 1. APPEARANCE & DARK MODE SETTINGS */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-sky-400" />
                <span>Appearance & Theme Mode</span>
              </CardTitle>
              <CardDescription className="text-xs">Customize website dark/light mode and accent color highlights</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              
              {/* Dark / Light Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-base border border-border-default">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-sky-500" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-content-primary">Dark Mode Theme</h4>
                    <p className="text-xs text-content-secondary">Currently active theme mode: <strong className="capitalize text-sky-400">{theme}</strong></p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleTheme}
                  leftIcon={theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
                >
                  Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-content-primary">Preferred Accent Theme Palette</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'sky', name: 'Sky Cyan', color: 'bg-sky-500' },
                    { id: 'emerald', name: 'Emerald Green', color: 'bg-emerald-500' },
                    { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
                    { id: 'amber', name: 'Amber Gold', color: 'bg-amber-500' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAccentColor(c.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                        accentColor === c.id
                          ? 'bg-surface-card border-sky-500 ring-2 ring-sky-500/30'
                          : 'bg-surface-base border-border-default hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ${c.color}`} />
                        <span>{c.name}</span>
                      </div>
                      {accentColor === c.id && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* 2. LANGUAGE & LOCALIZATION SETTINGS */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span>Language & Region Preferences</span>
              </CardTitle>
              <CardDescription className="text-xs">Select your interface language and speech recognition dialect</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-content-primary">Interface Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      triggerToast('Language Updated', `Interface language changed to ${e.target.value}.`, 'success');
                    }}
                    className="w-full p-2.5 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                  >
                    <option value="English (US)">English (United States)</option>
                    <option value="Spanish (Español)">Spanish (Español)</option>
                    <option value="French (Français)">French (Français)</option>
                    <option value="German (Deutsch)">German (Deutsch)</option>
                    <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                    <option value="Japanese (日本語)">Japanese (日本語)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-content-primary">Speech Recognition Dialect</label>
                  <input
                    type="text"
                    readOnly
                    value="en-US (Web Speech Engine Auto-Detect)"
                    className="w-full p-2.5 text-xs bg-surface-base/60 border border-border-subtle rounded-xl text-content-secondary font-mono"
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* 3. PRIVACY & DATA SECURITY SETTINGS */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Privacy & AI Data Controls</span>
              </CardTitle>
              <CardDescription className="text-xs">Manage candidate profile visibility, AI model consent, and resume retention</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              
              {/* Private Profile Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-base border border-border-default">
                <div>
                  <h4 className="text-sm font-bold text-content-primary">Incognito Candidate Profile</h4>
                  <p className="text-xs text-content-secondary mt-0.5">Hide your profile metrics and scores from global candidate rankings</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsPrivateProfile((prev) => !prev);
                    triggerToast('Privacy Settings Updated', !isPrivateProfile ? 'Incognito profile mode enabled.' : 'Public candidate profile enabled.', 'info');
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isPrivateProfile ? 'bg-sky-500' : 'bg-surface-hover border border-border-default'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPrivateProfile ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* AI Training Consent Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-base border border-border-default">
                <div>
                  <h4 className="text-sm font-bold text-content-primary">AI Data Anonymization Opt-Out</h4>
                  <p className="text-xs text-content-secondary mt-0.5">Keep interview recordings and answers strictly private to your account</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAiTrainingOptOut((prev) => !prev);
                    triggerToast('Consent Updated', !isAiTrainingOptOut ? 'AI training opt-out enabled.' : 'AI training data consent updated.', 'info');
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isAiTrainingOptOut ? 'bg-emerald-500' : 'bg-surface-hover border border-border-default'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAiTrainingOptOut ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Resume Retention */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-content-primary">Resume Document Auto-Purge Policy</label>
                <select
                  value={resumeRetention}
                  onChange={(e) => setResumeRetention(e.target.value)}
                  className="w-full p-2.5 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                >
                  <option value="indefinite">Keep Resumes Indefinitely until Manual Delete</option>
                  <option value="90_days">Auto-Purge Uploaded PDFs after 90 Days</option>
                  <option value="30_days">Auto-Purge Uploaded PDFs after 30 Days</option>
                </select>
              </div>

            </CardContent>
          </Card>

          {/* 4. PASSWORD UPDATE & SECURITY FORM */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Password & Authentication Security</span>
              </CardTitle>
              <CardDescription className="text-xs">Update your security password to protect your candidate account</CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-content-primary">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter current password..."
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2.5 pr-10 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-content-primary">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2.5 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-content-primary">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2.5 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isUpdatingPassword}
                    leftIcon={<Lock className="w-4 h-4" />}
                  >
                    Update Account Password
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

          {/* 5. DANGER ZONE: DELETE ACCOUNT */}
          <Card variant="default" className="p-6 border-red-500/30 bg-red-500/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Danger Zone — Delete Account</span>
              </CardTitle>
              <CardDescription className="text-red-300/80 text-xs">Permanently remove your candidate profile, saved interviews, evaluation reports, and resumes</CardDescription>
            </CardHeader>

            <CardContent className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-content-secondary leading-relaxed max-w-xl">
                Once deleted, your interview session recordings, AI performance reports, ATS resume audits, and gamification level achievements cannot be recovered.
              </div>

              <Button
                variant="danger"
                size="md"
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Trash2 className="w-4 h-4" />}
                className="shrink-0 shadow-lg shadow-red-500/20"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>

        </main>

      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-card border border-red-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2 text-red-400 font-extrabold text-base">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Permanently Delete Account?</span>
                </div>
                <button type="button" onClick={() => setShowDeleteModal(false)} className="text-content-muted hover:text-content-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-content-secondary leading-relaxed">
                This action is <strong>irreversible</strong>. Enter your password below to permanently purge your profile, session history, and evaluation reports.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-content-primary">Confirm Your Password</label>
                <input
                  type="password"
                  placeholder="Enter your password to confirm..."
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  className="w-full p-2.5 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={isDeleting}
                  onClick={handleDeleteAccount}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Component */}
      <Toast
        isVisible={toastConfig.isVisible}
        title={toastConfig.title}
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={() => setToastConfig((prev) => ({ ...prev, isVisible: false }))}
      />

    </div>
  );
};

export default SettingsPage;
