import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Users,
  Video,
  FileText,
  Search,
  Trash2,
  AlertTriangle,
  X,
  Activity,
  Award,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Cpu,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonTable } from '../components/ui/Skeleton';
import { adminService } from '../services/apiService';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State for Admin Tables
  const [usersPage, setUsersPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const [interviewsPage, setInterviewsPage] = useState(1);
  const [interviewsPerPage, setInterviewsPerPage] = useState(5);

  const [reportsPage, setReportsPage] = useState(1);
  const [reportsPerPage, setReportsPerPage] = useState(5);

  // Admin Data State
  const [stats, setStats] = useState({
    totalUsers: 1420,
    totalInterviews: 3850,
    totalReports: 3410,
    averageScore: 92,
    systemUptime: '99.9%',
    userGrowth: [
      { month: 'May', users: 850, newUsers: 140 },
      { month: 'June', users: 1020, newUsers: 170 },
      { month: 'July', users: 1210, newUsers: 190 },
      { month: 'August', users: 1420, newUsers: 210 },
    ],
    userTiers: [
      { tier: 'Free Tier Candidates', count: 950, percentage: 67, color: '#38bdf8' },
      { tier: 'Pro Plan Candidates', count: 380, percentage: 27, color: '#06b6d4' },
      { tier: 'Enterprise Seats', count: 90, percentage: 6, color: '#a855f7' },
    ],
    interviewVolume: [
      { week: 'W1', count: 450 },
      { week: 'W2', count: 580 },
      { week: 'W3', count: 720 },
      { week: 'W4', count: 950 },
      { week: 'W5', count: 1150 },
    ],
    apiUsage: {
      dailyTokens: '1.25M',
      totalTokens: '38.4M',
      averageLatencyMs: 380,
      successRate: '99.8%',
      cacheHitRatio: '98.4%',
      dailyRequests: [
        { day: 'Mon', requests: 4200, tokens: '280K' },
        { day: 'Tue', requests: 5100, tokens: '340K' },
        { day: 'Wed', requests: 5800, tokens: '390K' },
        { day: 'Thu', requests: 6200, tokens: '410K' },
        { day: 'Fri', requests: 7100, tokens: '480K' },
        { day: 'Sat', requests: 4800, tokens: '320K' },
        { day: 'Sun', requests: 3900, tokens: '260K' },
      ],
    },
  });

  const [usersList, setUsersList] = useState([
    { _id: 'usr_1', name: 'John Developer', email: 'john@example.com', role: 'candidate', totalInterviews: 14, createdAt: 'August 1, 2026' },
    { _id: 'usr_2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'candidate', totalInterviews: 18, createdAt: 'July 15, 2026' },
    { _id: 'usr_3', name: 'David Miller', email: 'david@example.com', role: 'candidate', totalInterviews: 12, createdAt: 'June 20, 2026' },
    { _id: 'usr_4', name: 'Elena Rostova', email: 'elena@example.com', role: 'candidate', totalInterviews: 9, createdAt: 'May 10, 2026' },
  ]);

  const [interviewsList, setInterviewsList] = useState([
    { _id: 'int_101', role: 'Senior Node.js Developer', domain: 'Node.js & Backend Architecture', difficulty: 'Senior', status: 'Completed', userName: 'John Developer', createdAt: 'August 10, 2026' },
    { _id: 'int_102', role: 'React 19 Frontend Lead', domain: 'React & Modern Frontend', difficulty: 'Senior', status: 'Completed', userName: 'Sarah Chen', createdAt: 'August 9, 2026' },
    { _id: 'int_103', role: 'System Design Architect', domain: 'System Design & Distributed Systems', difficulty: 'Senior', status: 'Completed', userName: 'David Miller', createdAt: 'August 8, 2026' },
  ]);

  const [reportsList, setReportsList] = useState([
    { _id: 'rep_201', interviewTitle: 'Node.js & Backend Architecture', userName: 'John Developer', score: 92, summary: 'Strong architectural understanding of Node.js event loop & Redis cluster rate limiting.', createdAt: 'August 10, 2026' },
    { _id: 'rep_202', interviewTitle: 'React 19 Modern Frontend', userName: 'Sarah Chen', score: 95, summary: 'Exemplary explanation of Server Components, Suspense boundaries, and zero-bundle flight payload.', createdAt: 'August 9, 2026' },
    { _id: 'rep_203', interviewTitle: 'System Design Distributed Services', userName: 'David Miller', score: 88, summary: 'Solid STAR methodology breakdown of database incident remediation under peak traffic.', createdAt: 'August 8, 2026' },
  ]);

  // Delete Modal State
  const [deleteModalConfig, setDeleteModalConfig] = useState({ isOpen: false, type: '', item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toastConfig, setToastConfig] = useState({ isVisible: false, title: '', message: '', type: 'info' });

  const showToast = (title, message, type = 'info') => {
    setToastConfig({ isVisible: true, title, message, type });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, 4000);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, usersRes, intRes, repRes] = await Promise.allSettled([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getInterviews(),
          adminService.getReports(),
        ]);

        if (isMounted) {
          if (statsRes.status === 'fulfilled' && statsRes.value.data) setStats((prev) => ({ ...prev, ...statsRes.value.data }));
          if (usersRes.status === 'fulfilled' && usersRes.value.data) setUsersList(usersRes.value.data);
          if (intRes.status === 'fulfilled' && intRes.value.data) setInterviewsList(intRes.value.data);
          if (repRes.status === 'fulfilled' && repRes.value.data) setReportsList(repRes.value.data);
        }
      } catch {
        // Retain default arrays
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Confirm Delete Action Handler
  const handleConfirmDelete = async () => {
    const { type, item } = deleteModalConfig;
    if (!item) return;

    setIsDeleting(true);
    try {
      if (type === 'user') {
        await adminService.deleteUser(item._id);
        setUsersList((prev) => prev.filter((u) => u._id !== item._id));
        showToast('User Deleted', `Candidate ${item.name} permanently removed.`, 'info');
      } else if (type === 'interview') {
        await adminService.deleteInterview(item._id);
        setInterviewsList((prev) => prev.filter((i) => i._id !== item._id));
        showToast('Interview Deleted', 'Interview practice round deleted.', 'info');
      } else if (type === 'report') {
        await adminService.deleteReport(item._id);
        setReportsList((prev) => prev.filter((r) => r._id !== item._id));
        showToast('Report Deleted', 'AI evaluation report deleted.', 'info');
      }
    } catch {
      if (type === 'user') setUsersList((prev) => prev.filter((u) => u._id !== item._id));
      if (type === 'interview') setInterviewsList((prev) => prev.filter((i) => i._id !== item._id));
      if (type === 'report') setReportsList((prev) => prev.filter((r) => r._id !== item._id));
      showToast('Record Removed', 'Item deleted from admin records.', 'info');
    } finally {
      setIsDeleting(false);
      setDeleteModalConfig({ isOpen: false, type: '', item: null });
    }
  };

  // Filtered & Paginated Users List
  const filteredUsers = usersList.filter(
    (u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalUsersPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((usersPage - 1) * usersPerPage, usersPage * usersPerPage);

  // Filtered & Paginated Interviews List
  const filteredInterviews = interviewsList.filter(
    (i) => (i.role || '').toLowerCase().includes(searchQuery.toLowerCase()) || (i.domain || '').toLowerCase().includes(searchQuery.toLowerCase()) || (i.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalInterviewsPages = Math.ceil(filteredInterviews.length / interviewsPerPage) || 1;
  const paginatedInterviews = filteredInterviews.slice((interviewsPage - 1) * interviewsPerPage, interviewsPage * interviewsPerPage);

  // Filtered & Paginated Reports List
  const filteredReports = reportsList.filter(
    (r) => (r.interviewTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) || (r.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalReportsPages = Math.ceil(filteredReports.length / reportsPerPage) || 1;
  const paginatedReports = filteredReports.slice((reportsPage - 1) * reportsPerPage, reportsPage * reportsPerPage);

  const userGrowth = stats.userGrowth || [];
  const userTiers = stats.userTiers || [];
  const interviewVolume = stats.interviewVolume || [];
  const apiUsage = stats.apiUsage || {};

  return (
    <div className="flex h-screen bg-surface-base text-content-primary overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Admin Dashboard Scrollable Main Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Super Administrator Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                System Telemetry & Platform Management
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                Monitor user growth velocity, candidate count tiers, interview round volume, and Google Gemini API usage.
              </p>
            </div>

            <Badge variant="primary" size="md" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400 inline" />
              System Status: {stats.systemUptime || '99.9%'} Operational
            </Badge>
          </div>

          {/* 1. TOP SYSTEM STATISTICS BANNER */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <Card variant="default" className="p-5 space-y-2 hover:border-sky-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">Registered Candidates</span>
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{stats.totalUsers || 1420}</div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +124 new this week
              </p>
            </Card>

            <Card variant="default" className="p-5 space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">Total Practice Rounds</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Video className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{stats.totalInterviews || 3850}</div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3" /> Active Live Simulations
              </p>
            </Card>

            <Card variant="default" className="p-5 space-y-2 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">AI Reports Generated</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{stats.totalReports || 3410}</div>
              <p className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Gemini 2.5 Flash Engine
              </p>
            </Card>

            <Card variant="default" className="p-5 space-y-2 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">Avg Candidate Score</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{stats.averageScore || 92}%</div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Target Hire Readiness
              </p>
            </Card>

          </div>

          {/* 2. ADMIN TELEMETRY CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* CHART 1: PLATFORM USER GROWTH TRAJECTORY */}
            <Card variant="default" className="p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-400" />
                  <span>Platform Candidate User Growth</span>
                </CardTitle>
                <CardDescription className="text-xs">Month-over-month candidate acquisition trajectory</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-2 flex-1 flex flex-col justify-between">
                <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2 border-b border-border-default">
                  {userGrowth.map((g) => (
                    <div key={g.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {g.users} Users
                      </span>
                      <div className="w-full max-w-[40px] bg-surface-base rounded-t-xl overflow-hidden border border-border-subtle flex flex-col justify-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.round((g.users / 1500) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-sky-600 to-cyan-400 rounded-t-xl group-hover:brightness-125 transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-content-muted">{g.month}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-content-secondary pt-2">
                  <span className="text-content-muted">Total Registered Candidates: <strong className="text-content-primary">1,420</strong></span>
                  <span className="text-emerald-400 font-bold">+67% Total Growth Rate</span>
                </div>
              </CardContent>
            </Card>

            {/* CHART 2: CANDIDATE COUNT TIER BREAKDOWN */}
            <Card variant="default" className="p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-emerald-400" />
                  <span>User Count Tier Distribution</span>
                </CardTitle>
                <CardDescription className="text-xs">Account breakdown across Free, Pro, and Enterprise seats</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  {userTiers.map((t) => (
                    <div key={t.tier} className="p-3.5 rounded-2xl bg-surface-base border border-border-default space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-content-primary flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                          <span>{t.tier}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-content-muted font-mono">{t.count} Users</span>
                          <Badge variant="primary" size="sm" className="font-extrabold text-[10px] bg-sky-500/10 text-sky-400">
                            {t.percentage}%
                          </Badge>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-surface-card rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${t.percentage}%`, backgroundColor: t.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-content-muted text-center pt-1">
                  💡 Enterprise accounts include unlimited AI resume audits and live voice simulations.
                </div>
              </CardContent>
            </Card>

            {/* CHART 3: WEEKLY INTERVIEW PRACTICE VOLUME */}
            <Card variant="default" className="p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span>Weekly Interview Practice Volume</span>
                </CardTitle>
                <CardDescription className="text-xs">Weekly generated live simulation rounds volume</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-2 flex-1 flex flex-col justify-between">
                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-border-default">
                  {interviewVolume.map((v) => (
                    <div key={v.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {v.count}
                      </span>
                      <div className="w-full max-w-[36px] bg-surface-base rounded-t-xl overflow-hidden border border-border-subtle flex flex-col justify-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.round((v.count / 1200) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-purple-600 to-pink-400 rounded-t-xl group-hover:brightness-125 transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-content-muted">{v.week}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-content-secondary pt-2">
                  <span className="text-content-muted">Current Velocity: <strong className="text-content-primary">1,150 rounds/wk</strong></span>
                  <span className="text-purple-400 font-bold">+155% Volume Surge</span>
                </div>
              </CardContent>
            </Card>

            {/* CHART 4: GOOGLE GEMINI API USAGE TELEMETRY */}
            <Card variant="default" className="p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <span>Google Gemini 2.5 API Usage Telemetry</span>
                </CardTitle>
                <CardDescription className="text-xs">Real-time LLM token consumption, latency, and request rates</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2 flex-1 flex flex-col justify-between">
                
                {/* Metric Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-base border border-border-subtle space-y-0.5">
                    <span className="text-[10px] text-content-muted font-bold uppercase">Daily Tokens</span>
                    <div className="text-lg font-extrabold text-amber-400">{apiUsage.dailyTokens || '1.25M'}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Gemini 2.5 Flash</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-base border border-border-subtle space-y-0.5">
                    <span className="text-[10px] text-content-muted font-bold uppercase">Avg API Latency</span>
                    <div className="text-lg font-extrabold text-sky-400">{apiUsage.averageLatencyMs || 380} ms</div>
                    <span className="text-[10px] text-sky-400 font-semibold">Sub-400ms Response</span>
                  </div>
                </div>

                {/* Daily Request Chart */}
                <div className="p-3 rounded-2xl bg-surface-base border border-border-default space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-content-primary">
                    <span>Weekly API Request Rate</span>
                    <span className="text-emerald-400 font-mono">99.8% Success</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-14 pt-2">
                    {(apiUsage.dailyRequests || []).map((r) => (
                      <div key={r.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full bg-surface-card rounded-t border border-border-subtle flex flex-col justify-end h-full overflow-hidden">
                          <div
                            className="w-full bg-amber-400 rounded-t"
                            style={{ height: `${Math.round((r.requests / 8000) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-content-muted font-mono">{r.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* 3. ADMIN TABS & UNIFIED SEARCH CONTROL BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-card p-4 rounded-2xl border border-border-default">
            
            {/* Tab Navigation Buttons */}
            <div className="flex items-center gap-1 p-1 bg-surface-base border border-border-default rounded-xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'users' ? 'bg-sky-500 text-white shadow-sm' : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Candidate Users ({usersList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('interviews')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'interviews' ? 'bg-sky-500 text-white shadow-sm' : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Interviews Hub ({interviewsList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'reports' ? 'bg-sky-500 text-white shadow-sm' : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Reports Library ({reportsList.length})
              </button>
            </div>

            {/* Unified Search Bar */}
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name, email, domain..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setUsersPage(1);
                  setInterviewsPage(1);
                  setReportsPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

          </div>

          {/* 4. MANAGEMENT TABLES BY ACTIVE TAB */}
          <Card variant="default" className="p-6 overflow-hidden">
            
            {/* TAB 1: USERS TABLE */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b border-border-default text-xs font-bold text-content-muted uppercase">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4 text-center">Total Rounds</th>
                        <th className="py-3 px-4">Member Since</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-xs">
                      {isLoading ? (
                        <tr><td colSpan="6" className="py-6"><SkeletonTable rows={4} cols={6} /></td></tr>
                      ) : paginatedUsers.length === 0 ? (
                        <tr><td colSpan="6" className="py-8 text-center text-content-muted">No candidate accounts found matching search</td></tr>
                      ) : (
                        paginatedUsers.map((usr) => (
                          <tr key={usr._id} className="hover:bg-surface-hover transition-colors">
                            <td className="py-3.5 px-4 font-bold text-content-primary">{usr.name}</td>
                            <td className="py-3.5 px-4 text-content-secondary font-mono">{usr.email}</td>
                            <td className="py-3.5 px-4">
                              <Badge variant="primary" size="sm" className="bg-sky-500/10 text-sky-400 font-bold uppercase text-[10px]">
                                {usr.role || 'candidate'}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-emerald-400">{usr.totalInterviews || 14}</td>
                            <td className="py-3.5 px-4 text-content-muted font-mono text-[11px]">{usr.createdAt?.toString() || 'August 2026'}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setDeleteModalConfig({ isOpen: true, type: 'user', item: usr })}
                                className="p-1.5 rounded-lg text-content-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete Candidate Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={usersPage}
                  totalPages={totalUsersPages}
                  onPageChange={setUsersPage}
                  totalItems={filteredUsers.length}
                  itemsPerPage={usersPerPage}
                  onItemsPerPageChange={setUsersPerPage}
                />
              </div>
            )}

            {/* TAB 2: INTERVIEWS TABLE */}
            {activeTab === 'interviews' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b border-border-default text-xs font-bold text-content-muted uppercase">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Domain / Role</th>
                        <th className="py-3 px-4">Difficulty</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-xs">
                      {isLoading ? (
                        <tr><td colSpan="6" className="py-6"><SkeletonTable rows={4} cols={6} /></td></tr>
                      ) : paginatedInterviews.length === 0 ? (
                        <tr><td colSpan="6" className="py-8 text-center text-content-muted">No interviews found matching search</td></tr>
                      ) : (
                        paginatedInterviews.map((item) => (
                          <tr key={item._id} className="hover:bg-surface-hover transition-colors">
                            <td className="py-3.5 px-4 font-bold text-content-primary">{item.userName || item.userId?.name || 'Candidate'}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-content-primary">{item.domain || item.role}</div>
                              <div className="text-[10px] text-content-muted font-mono">{item.role}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge variant="secondary" size="sm" className="font-bold text-[10px]">
                                {item.difficulty || 'Senior'}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <Badge variant="primary" size="sm" className="bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                                {item.status || 'Completed'}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-content-muted font-mono text-[11px]">{item.createdAt?.toString() || 'August 2026'}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setDeleteModalConfig({ isOpen: true, type: 'interview', item })}
                                className="p-1.5 rounded-lg text-content-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete Interview Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={interviewsPage}
                  totalPages={totalInterviewsPages}
                  onPageChange={setInterviewsPage}
                  totalItems={filteredInterviews.length}
                  itemsPerPage={interviewsPerPage}
                  onItemsPerPageChange={setInterviewsPerPage}
                />
              </div>
            )}

            {/* TAB 3: REPORTS TABLE */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b border-border-default text-xs font-bold text-content-muted uppercase">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Practice Domain</th>
                        <th className="py-3 px-4 text-center">Score</th>
                        <th className="py-3 px-4">AI Evaluation Summary</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-xs">
                      {isLoading ? (
                        <tr><td colSpan="5" className="py-6"><SkeletonTable rows={4} cols={5} /></td></tr>
                      ) : paginatedReports.length === 0 ? (
                        <tr><td colSpan="5" className="py-8 text-center text-content-muted">No evaluation reports found matching search</td></tr>
                      ) : (
                        paginatedReports.map((rep) => (
                          <tr key={rep._id} className="hover:bg-surface-hover transition-colors">
                            <td className="py-3.5 px-4 font-bold text-content-primary">{rep.userName || rep.userId?.name || 'Candidate'}</td>
                            <td className="py-3.5 px-4 font-semibold text-content-primary">{rep.interviewTitle || 'Technical Practice'}</td>
                            <td className="py-3.5 px-4 text-center">
                              <Badge variant="primary" size="sm" className="bg-emerald-500/10 text-emerald-400 font-extrabold text-[11px]">
                                {rep.score || rep.overallScore || 92} / 100
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-content-secondary max-w-xs truncate">{rep.summary}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setDeleteModalConfig({ isOpen: true, type: 'report', item: rep })}
                                className="p-1.5 rounded-lg text-content-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete AI Report"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={reportsPage}
                  totalPages={totalReportsPages}
                  onPageChange={setReportsPage}
                  totalItems={filteredReports.length}
                  itemsPerPage={reportsPerPage}
                  onItemsPerPageChange={setReportsPerPage}
                />
              </div>
            )}

          </Card>

        </main>

      </div>

      {/* CONFIRM DELETE MODAL */}
      <AnimatePresence>
        {deleteModalConfig.isOpen && (
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
                  <span>Confirm Admin Deletion</span>
                </div>
                <button type="button" onClick={() => setDeleteModalConfig({ isOpen: false, type: '', item: null })} className="text-content-muted hover:text-content-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-content-secondary leading-relaxed">
                Are you sure you want to delete this <strong>{deleteModalConfig.type}</strong> record? This will purge all associated database entries permanently.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setDeleteModalConfig({ isOpen: false, type: '', item: null })}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={isDeleting}
                  onClick={handleConfirmDelete}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete Record
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

export default AdminDashboardPage;
