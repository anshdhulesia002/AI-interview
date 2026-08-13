import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Video,
  Zap,
  Mic,
  Code2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getRealUserActivity } from '../../utils/userActivityHelper';
import { analyticsService } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const StatsOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => getRealUserActivity());

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getUserAnalytics();
        if (res?.data?.summary) {
          const apiSummary = res.data.summary;
          const localActivity = getRealUserActivity();
          setStats({
            ...localActivity,
            totalSessions: localActivity.totalSessions || apiSummary.totalInterviews || 0,
            averageScore: localActivity.totalSessions > 0 ? localActivity.averageScore : (apiSummary.averageScore || 0),
          });
        }
      } catch {
        // Fallback to local computed stats
      }
    };
    fetchAnalytics();
  }, []);

  const { totalSessions, averageScore, technicalScore, communicationScore, codingScore } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      
      {/* 1. AVERAGE SCORE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="h-full"
      >
        <Card variant="default" className="h-full p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all overflow-hidden relative group">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Overall Performance</span>
              <h4 className="text-base font-bold text-content-primary truncate">Average Score</h4>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-3xl font-extrabold text-content-primary tracking-tight">{averageScore}</span>
                <span className="text-xs font-semibold text-content-muted">/ 100</span>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-hover"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className="text-sky-500"
                  strokeDasharray="100, 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - Math.min(100, Math.max(0, averageScore)) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Award className="w-6 h-6 text-sky-400 absolute" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
            <span className="text-content-secondary font-semibold">
              {totalSessions === 0 ? 'No sessions completed' : `${totalSessions} Session${totalSessions > 1 ? 's' : ''} Evaluated`}
            </span>
            <Badge variant={averageScore >= 80 ? 'success' : averageScore > 0 ? 'warning' : 'neutral'} size="sm">
              {averageScore >= 80 ? 'Pass Grade' : averageScore > 0 ? 'Needs Practice' : 'No Activity'}
            </Badge>
          </div>
        </Card>
      </motion.div>

      {/* 2. MOCK INTERVIEWS COUNT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="h-full"
      >
        <Card variant="default" className="h-full p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all overflow-hidden relative group">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Activity Track</span>
              <h4 className="text-base font-bold text-content-primary truncate">Completed Sessions</h4>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-3xl font-extrabold text-content-primary tracking-tight">{totalSessions}</span>
                <span className="text-xs font-semibold text-content-muted">Mock Rounds</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <Video className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-border-subtle">
            <div className="flex justify-between text-xs text-content-secondary font-semibold">
              <span>Technical Depth</span>
              <span className="text-emerald-400 font-bold">{technicalScore}%</span>
            </div>
            <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, technicalScore))}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 3. CONFIDENCE RATING CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="h-full"
      >
        <Card variant="default" className="h-full p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all overflow-hidden relative group">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">AI Analysis</span>
              <h4 className="text-base font-bold text-content-primary truncate">Confidence Rating</h4>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-3xl font-extrabold text-content-primary tracking-tight">
                  {averageScore > 0 ? `${Math.round(averageScore)}%` : '0%'}
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  {averageScore >= 80 ? 'High 🚀' : averageScore > 0 ? 'Medium ⚡' : 'Initial 🎯'}
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-border-subtle">
            <div className="flex justify-between text-xs text-content-secondary font-semibold">
              <span>Readiness Gauge</span>
              <span className="text-amber-400 font-bold">{averageScore > 0 ? 'Active' : 'Uncalculated'}</span>
            </div>
            <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, averageScore))}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 4. COMMUNICATION SCORE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="h-full"
      >
        <Card variant="default" className="h-full p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all overflow-hidden relative group">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Speech Clarity</span>
              <h4 className="text-base font-bold text-content-primary truncate">Communication</h4>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-3xl font-extrabold text-content-primary tracking-tight">{communicationScore}</span>
                <span className="text-xs font-semibold text-content-muted">/ 100</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
              <Mic className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
            <span className="text-xs text-content-secondary font-semibold">
              {communicationScore > 0 ? 'Speech Analyzed' : 'No speech recorded'}
            </span>
          </div>
        </Card>
      </motion.div>

      {/* 5. CODING SCORE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="h-full"
      >
        <Card variant="default" className="h-full p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all overflow-hidden relative group">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Problem Solving</span>
              <h4 className="text-base font-bold text-content-primary truncate">Coding Efficiency</h4>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-3xl font-extrabold text-content-primary tracking-tight">{codingScore}</span>
                <span className="text-xs font-semibold text-content-muted">/ 100</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
              <Code2 className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
            <span className="font-mono text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {codingScore > 0 ? 'Evaluated' : 'Unrated'}
            </span>
          </div>
        </Card>
      </motion.div>

      {/* 6. UPCOMING PRACTICE SCHEDULE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="h-full"
      >
        <Card variant="default" className="h-full p-6 flex flex-col justify-between border-sky-500/30 bg-sky-500/5 hover:border-sky-500/50 transition-all overflow-hidden relative group">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Next Recommended Practice</span>
              </div>
              <h4 className="text-base font-bold text-content-primary truncate mt-1">Node.js & React Mock Round</h4>
              <p className="text-xs text-content-muted flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> Ready anytime
              </p>
            </div>

            <Badge variant="primary" size="sm" className="shrink-0 gap-1">
              <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
              <span>Live AI</span>
            </Badge>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.INTERVIEWS)}
              className="w-full justify-center text-xs font-bold shadow-md shadow-sky-500/20 cursor-pointer"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Start Practice Session
            </Button>
          </div>
        </Card>
      </motion.div>

    </div>
  );
};
