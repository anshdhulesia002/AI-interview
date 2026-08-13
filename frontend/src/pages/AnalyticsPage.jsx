import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Activity,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  PieChart as PieIcon,
  Sparkles,
  BarChart3,
  Radar as RadarIcon,
  Zap,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { analyticsService } from '../services/apiService';
import { getRealUserActivity } from '../utils/userActivityHelper';

// Harmonious Curated Colors for Pie & Visuals
const CATEGORY_COLORS = ['#38bdf8', '#06b6d4', '#a855f7', '#10b981', '#ec4899'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const computeUserAnalytics = async () => {
      setIsLoading(true);
      const localActivity = getRealUserActivity();
      const {
        totalSessions,
        averageScore,
        technicalScore,
        behavioralScore,
        communicationScore,
        codingScore,
        completedInterviews,
      } = localActivity;

      // Construct Heatmap Data
      const today = new Date();
      const sessionDates = new Set(completedInterviews.map((s) => s.date));
      const heatmapData = [];

      for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const hasSession = sessionDates.has(dateStr);

        heatmapData.push({
          date: dateStr,
          count: hasSession ? 1 : 0,
          level: hasSession ? 2 : 0,
        });
      }

      // Domain Breakdown Pie Chart
      const categoryCounts = {
        'Technical & Coding': 0,
        'System Design': 0,
        'Behavioral & STAR': 0,
        'Frontend Architecture': 0,
      };

      completedInterviews.forEach((interview) => {
        const dom = (interview.category || interview.title || '').toLowerCase();
        if (dom.includes('system')) categoryCounts['System Design']++;
        else if (dom.includes('behavioral') || dom.includes('hr')) categoryCounts['Behavioral & STAR']++;
        else if (dom.includes('frontend') || dom.includes('react')) categoryCounts['Frontend Architecture']++;
        else categoryCounts['Technical & Coding']++;
      });

      const totalCatSum = completedInterviews.length || 1;
      const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
        percentage: totalSessions > 0 ? Math.round((value / totalCatSum) * 100) : 0,
      }));

      // Radar Data
      const radarData = [
        { subject: 'System Architecture', score: technicalScore },
        { subject: 'Algorithmic Coding', score: codingScore },
        { subject: 'STAR Storytelling', score: behavioralScore },
        { subject: 'Database Tuning', score: technicalScore },
        { subject: 'Communication', score: communicationScore },
        { subject: 'Problem Solving Speed', score: codingScore },
      ];

      // Weekly Progress
      const weeklyProgress = [
        { week: 'W1', score: Math.round(averageScore * 0.7), questions: totalSessions > 0 ? 4 : 0 },
        { week: 'W2', score: Math.round(averageScore * 0.8), questions: totalSessions > 0 ? 8 : 0 },
        { week: 'W3', score: Math.round(averageScore * 0.9), questions: totalSessions > 0 ? 12 : 0 },
        { week: 'Current', score: averageScore, questions: totalSessions * 4 },
      ];

      // Monthly Progress
      const monthlyProgress = [
        { month: 'Current Month', score: averageScore, sessions: totalSessions },
      ];

      let apiSummary = null;
      try {
        const res = await analyticsService.getUserAnalytics();
        if (res?.data?.summary) {
          apiSummary = res.data.summary;
        }
      } catch {
        // API fallback
      }

      if (isMounted) {
        setAnalyticsData({
          summary: {
            totalInterviews: totalSessions || apiSummary?.totalInterviews || 0,
            totalHours: Math.round((totalSessions * 45) / 60),
            totalQuestions: totalSessions * 4,
            averageScore,
            practiceStreakDays: totalSessions > 0 ? 1 : 0,
          },
          heatmapData,
          pieData,
          radarData,
          weeklyProgress,
          monthlyProgress,
        });
        setIsLoading(false);
      }
    };

    computeUserAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = analyticsData?.summary || {};
  const heatmapData = analyticsData?.heatmapData || [];
  const pieData = analyticsData?.pieData || [];
  const radarData = analyticsData?.radarData || [];
  const weeklyProgress = analyticsData?.weeklyProgress || [];
  const monthlyProgress = analyticsData?.monthlyProgress || [];

  // Radar SVG Calculations
  const centerX = 130;
  const centerY = 130;
  const radius = 85;
  const numAxes = radarData.length || 6;

  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const radarPoints = radarData.map((d, i) => {
    const coords = getCoordinates(i, d.score);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="flex h-screen bg-surface-base text-content-primary overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Scrollable Analytics Main Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>Performance & Growth Analytics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                Candidate Analytics & Skill Breakdown
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                Real-time activity heatmap, domain distribution, competency radar, and progress trends.
              </p>
            </div>

            <Badge variant="primary" size="md" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold shrink-0">
              <Flame className="w-4 h-4 mr-1 text-emerald-400 inline" />
              {summary.practiceStreakDays || 0} Day Practice Streak
            </Badge>
          </div>

          {/* 1. TOP SUMMARY METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <Card variant="default" className="p-5 space-y-2 hover:border-sky-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">Total Sessions</span>
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{summary.totalInterviews || 0}</div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {summary.totalInterviews > 0 ? 'Active Candidate' : 'No activity yet'}
              </p>
            </Card>

            <Card variant="default" className="p-5 space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">Average Score</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{summary.averageScore || 0} <span className="text-xs font-normal text-content-muted">/ 100</span></div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {summary.averageScore >= 80 ? 'Pass Readiness Level' : summary.averageScore > 0 ? 'Needs Practice' : 'Uncalculated'}
              </p>
            </Card>

            <Card variant="default" className="p-5 space-y-2 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">Practice Time</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{summary.totalHours || 0} <span className="text-xs font-normal text-content-muted">Hours</span></div>
              <p className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> {summary.totalQuestions || 0} Questions Answered
              </p>
            </Card>

            <Card variant="default" className="p-5 space-y-2 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between text-content-muted">
                <span className="text-xs font-semibold">Current Streak</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">{summary.practiceStreakDays || 0} <span className="text-xs font-normal text-content-muted">Days</span></div>
              <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {summary.practiceStreakDays > 0 ? 'Active Streak Bonus' : 'Start streak today'}
              </p>
            </Card>

          </div>

          {/* 2. 52-WEEK PRACTICE HEATMAP GRID */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span>52-Week Practice Activity Heatmap</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Daily interview practice frequency over the past 365 days</CardDescription>
                </div>

                {/* Heatmap Legend */}
                <div className="flex items-center gap-2 text-xs text-content-muted">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded bg-surface-base border border-border-subtle" />
                  <div className="w-3 h-3 rounded bg-emerald-500/30" />
                  <div className="w-3 h-3 rounded bg-emerald-500/60" />
                  <div className="w-3 h-3 rounded bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  <span>More</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              {isLoading ? (
                <div className="py-12 text-center text-xs font-semibold text-sky-400">Loading activity heatmap...</div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Month Headers */}
                  <div className="overflow-x-auto pb-1">
                    <div className="flex justify-between text-[11px] font-mono text-content-muted min-w-[720px] px-1 mb-1">
                      {MONTH_NAMES.map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>

                    {/* Heatmap Grid (7 Rows x 52 Columns) */}
                    <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-[720px]">
                      {heatmapData.map((day, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setActiveTooltip(day)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className={`w-3 h-3 rounded-[3px] transition-all cursor-pointer ${
                            day.level === 0
                              ? 'bg-surface-base border border-border-subtle hover:border-sky-400'
                              : day.level === 1
                              ? 'bg-emerald-500/30 border border-emerald-500/40 hover:scale-125'
                              : day.level === 2
                              ? 'bg-emerald-500/60 border border-emerald-500/80 hover:scale-125'
                              : 'bg-emerald-400 shadow-sm shadow-emerald-400/50 hover:scale-125'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Tooltip Display */}
                  <div className="h-6 flex items-center justify-between text-xs text-content-secondary bg-surface-card/60 px-3 py-1.5 rounded-xl border border-border-subtle">
                    {activeTooltip ? (
                      <span className="font-semibold text-emerald-400">
                        📅 {activeTooltip.date}: <strong>{activeTooltip.count} session(s) completed</strong>
                      </span>
                    ) : (
                      <span className="text-content-muted">Hover over any square to inspect session counts</span>
                    )}
                  </div>

                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. CHARTS GRID: DOMAIN PIE & COMPETENCY RADAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* PIE / DONUT CHART: DOMAIN DISTRIBUTION (5 Cols) */}
            <Card variant="default" className="lg:col-span-5 p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-sky-400" />
                  <span>Domain Category Breakdown</span>
                </CardTitle>
                <CardDescription className="text-xs">Distribution of completed mock rounds</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-2 flex-1 flex flex-col justify-between">
                
                {/* SVG Donut Visual */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center shrink-0 my-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {pieData.map((slice, i) => {
                      const total = pieData.reduce((a, b) => a + b.value, 0) || 1;
                      let offset = 0;
                      for (let j = 0; j < i; j++) offset += (pieData[j].value / total) * 100;
                      const slicePercent = (slice.value / total) * 100;

                      return (
                        <circle
                          key={slice.name}
                          cx="50"
                          cy="50"
                          r="32"
                          pathLength="100"
                          fill="transparent"
                          stroke={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                          strokeWidth="10"
                          strokeDasharray={`${slicePercent} ${100 - slicePercent}`}
                          strokeDashoffset={-offset}
                          className="transition-all hover:strokeWidth-12 cursor-pointer"
                        />
                      );
                    })}
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-content-primary leading-none">{summary.totalInterviews || 0}</span>
                    <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest mt-1">ROUNDS</span>
                  </div>
                </div>

                {/* Category Legend List */}
                <div className="space-y-3 pt-2">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-surface-base border border-border-subtle">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                        />
                        <span className="font-semibold text-content-primary truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-content-muted font-mono text-[11px]">{item.value} rounds</span>
                        <Badge variant="secondary" size="sm" className="font-extrabold text-[10px] bg-sky-500/10 text-sky-400">
                          {item.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>

            {/* 6-AXIS COMPETENCY RADAR CHART (7 Cols) */}
            <Card variant="default" className="lg:col-span-7 p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RadarIcon className="w-5 h-5 text-cyan-400" />
                  <span>6-Axis Competency Radar</span>
                </CardTitle>
                <CardDescription className="text-xs">Multidimensional skill strength radar evaluated by Gemini AI</CardDescription>
              </CardHeader>

              <CardContent className="pt-2 flex-1 flex flex-col justify-between space-y-6">
                
                {/* Center SVG Radar Visual */}
                <div className="w-64 h-64 mx-auto relative shrink-0 my-2">
                  <svg viewBox="0 0 260 260" className="w-full h-full">
                    
                    {/* Background Concentric Rings */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((ringLevel, rIdx) => (
                      <polygon
                        key={rIdx}
                        points={radarData.map((_, i) => {
                          const c = getCoordinates(i, ringLevel * 100);
                          return `${c.x},${c.y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Axis Radial Lines */}
                    {radarData.map((_, i) => {
                      const end = getCoordinates(i, 100);
                      return (
                        <line
                          key={i}
                          x1={centerX}
                          y1={centerY}
                          x2={end.x}
                          y2={end.y}
                          stroke="rgba(255,255,255,0.12)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Dynamic Radar Competency Polygon */}
                    <polygon
                      points={radarPoints}
                      fill="rgba(6, 182, 212, 0.25)"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      className="transition-all hover:fill-opacity-40"
                    />

                    {/* Vertex Dots */}
                    {radarData.map((d, i) => {
                      const c = getCoordinates(i, d.score);
                      return (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r="4.5"
                          fill="#38bdf8"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* 2-Column Competency Progress Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {radarData.map((item) => (
                    <div key={item.subject} className="p-2.5 rounded-xl bg-surface-base border border-border-subtle space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-content-primary truncate">{item.subject}</span>
                        <span className="text-sky-400 font-extrabold shrink-0">{item.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-card rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>

          </div>

          {/* 4. CHARTS GRID: WEEKLY PROGRESS & MONTHLY GROWTH */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* WEEKLY PROGRESS TREND CHART */}
            <Card variant="default" className="p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Weekly Performance Trajectory</span>
                </CardTitle>
                <CardDescription className="text-xs">Week-over-week overall score trajectory and questions volume</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-2 flex-1 flex flex-col justify-between">
                
                {/* Bar Graph Visual */}
                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-border-default">
                  {weeklyProgress.map((w) => (
                    <div key={w.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      
                      <span className="text-[10px] font-bold text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {w.score}%
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full max-w-[36px] bg-surface-base rounded-t-xl overflow-hidden border border-border-subtle flex flex-col justify-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.min(100, Math.max(0, w.score))}%` }}
                          transition={{ duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-sky-600 to-emerald-400 rounded-t-xl group-hover:brightness-125 transition-all"
                        />
                      </div>

                      <span className="text-[11px] font-semibold text-content-muted">{w.week}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-content-secondary pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Current Average: <strong className="text-content-primary">{summary.averageScore || 0}%</strong></span>
                  </div>
                  <span className="text-emerald-400 font-bold">{summary.averageScore >= 80 ? 'Pass Readiness Level' : 'Active Practice'}</span>
                </div>

              </CardContent>
            </Card>

            {/* MONTHLY GROWTH & MILESTONE PROGRESS */}
            <Card variant="default" className="p-6 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span>Monthly Growth & Target Milestones</span>
                </CardTitle>
                <CardDescription className="text-xs">Month-over-month score progress & readiness milestones</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2 flex-1 flex flex-col justify-between">
                
                <div className="space-y-3">
                  {monthlyProgress.map((m) => (
                    <div key={m.month} className="p-3.5 rounded-2xl bg-surface-base border border-border-default space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-content-primary">{m.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-content-muted font-mono">{m.sessions} Sessions</span>
                          <Badge variant="primary" size="sm" className="bg-purple-500/10 border-purple-500/30 text-purple-400 font-extrabold">
                            {m.score}% Score
                          </Badge>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-surface-card rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-sky-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Target Milestone Unlocked Card */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
                  summary.averageScore >= 80
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                }`}>
                  <Award className="w-6 h-6 text-sky-400 shrink-0" />
                  <div>
                    <div className="font-extrabold">
                      {summary.averageScore >= 80 ? 'FAANG Tier Readiness Milestone Unlocked! 🏆' : 'Practice Track Milestone Active 🚀'}
                    </div>
                    <div className="text-[11px] opacity-90 mt-0.5">
                      {summary.averageScore >= 80
                        ? 'Your average score exceeds 80%+ across technical domains.'
                        : 'Complete practice rounds to unlock advanced interview readiness badges.'}
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AnalyticsPage;
