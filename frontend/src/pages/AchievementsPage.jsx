import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Zap,
  Award,
  Crown,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { gamificationService } from '../services/apiService';
import { getRealUserActivity } from '../utils/userActivityHelper';
import { useAuth } from '../hooks/useAuth';

export const AchievementsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination State for Leaderboard
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    let isMounted = true;

    const computeGamification = async () => {
      setIsLoading(true);
      const activity = getRealUserActivity();
      const { totalSessions, averageScore, completedInterviews } = activity;

      const xpPoints = totalSessions * 250 + Math.round(averageScore * 10);
      const level = totalSessions > 0 ? Math.floor(xpPoints / 300) + 1 : 1;
      const xpCurrentLevel = xpPoints % 300;
      const xpNextLevel = 300;

      const getLevelTitle = (lvl) => {
        if (lvl >= 10) return `Level ${lvl} - Senior Interview Architect`;
        if (lvl >= 5) return `Level ${lvl} - Technical Specialist`;
        if (lvl >= 2) return `Level ${lvl} - Practice Associate`;
        return `Level 1 - Junior Candidate`;
      };

      const hasPassSession = completedInterviews.some((s) => s.score >= 80);
      const hasPerfectScore = completedInterviews.some((s) => s.score >= 95);

      const badges = [
        {
          id: 'first_interview',
          name: 'First Blood Practice',
          description: 'Completed your very first mock interview round',
          icon: '🎯',
          category: 'Mastery',
          unlocked: totalSessions >= 1,
          progress: Math.min(totalSessions, 1),
          maxProgress: 1,
          xpBonus: 100,
        },
        {
          id: 'streak_master',
          name: '7-Day Streak Legend',
          description: 'Maintained active interview practice for 7 consecutive days',
          icon: '🔥',
          category: 'Streaks',
          unlocked: totalSessions >= 7,
          progress: Math.min(totalSessions, 7),
          maxProgress: 7,
          xpBonus: 300,
        },
        {
          id: 'system_design_guru',
          name: 'System Design Architect',
          description: 'Scored 80%+ in System Design practice rounds',
          icon: '🏛️',
          category: 'Specialist',
          unlocked: hasPassSession,
          progress: hasPassSession ? 1 : 0,
          maxProgress: 1,
          xpBonus: 250,
        },
        {
          id: 'voice_master',
          name: 'Speech Auto-Fill Pro',
          description: 'Used Web Speech API voice auto-fill for interview answers',
          icon: '🎙️',
          category: 'AI Evaluator',
          unlocked: totalSessions >= 1,
          progress: Math.min(totalSessions, 1),
          maxProgress: 1,
          xpBonus: 150,
        },
        {
          id: 'resume_audited',
          name: 'ATS Resume Master',
          description: 'Uploaded & audited resume against AI role taxonomies',
          icon: '📄',
          category: 'Specialist',
          unlocked: false,
          progress: 0,
          maxProgress: 1,
          xpBonus: 200,
        },
        {
          id: 'perfect_score',
          name: 'Century 100/100',
          description: 'Achieved a perfect score in an AI evaluation report',
          icon: '👑',
          category: 'Mastery',
          unlocked: hasPerfectScore,
          progress: hasPerfectScore ? 1 : 0,
          maxProgress: 1,
          xpBonus: 500,
        },
      ];

      const userName = user?.name || 'Alex Rivera';

      const rawLeaderboard = [
        { name: `${userName} (You)`, title: getLevelTitle(level), xp: xpPoints, readiness: averageScore, streakDays: totalSessions > 0 ? 1 : 0, avatarColor: 'from-sky-500 to-cyan-400', isCurrentUser: true },
        { name: 'Sarah Chen', title: 'Level 18 - Staff Systems Lead', xp: 3200, readiness: 92, streakDays: 15, avatarColor: 'from-emerald-500 to-teal-400', isCurrentUser: false },
        { name: 'David Miller', title: 'Level 16 - Senior Fullstack Developer', xp: 2950, readiness: 90, streakDays: 9, avatarColor: 'from-purple-500 to-pink-400', isCurrentUser: false },
        { name: 'Elena Rostova', title: 'Level 14 - System Design Architect', xp: 2600, readiness: 88, streakDays: 7, avatarColor: 'from-amber-500 to-orange-400', isCurrentUser: false },
        { name: 'Marcus Vance', title: 'Level 12 - DevOps Engineer', xp: 2300, readiness: 86, streakDays: 5, avatarColor: 'from-rose-500 to-red-400', isCurrentUser: false },
      ];

      rawLeaderboard.sort((a, b) => b.xp - a.xp);
      const leaderboard = rawLeaderboard.map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));

      let apiGamification = null;
      try {
        const response = await gamificationService.getOverview();
        if (response?.data) {
          apiGamification = response.data;
        }
      } catch {
        // Fallback to local
      }

      if (isMounted) {
        setData({
          userStats: {
            level,
            levelTitle: getLevelTitle(level),
            xpPoints,
            xpCurrentLevel,
            xpNextLevel,
            streakDays: totalSessions > 0 ? 1 : 0,
            multiplier: totalSessions > 0 ? 1.5 : 1.0,
            totalBadgesUnlocked: badges.filter((b) => b.unlocked).length,
            totalBadges: badges.length,
          },
          badges: apiGamification?.badges?.length > 0 ? apiGamification.badges : badges,
          leaderboard: apiGamification?.leaderboard?.length > 0 ? apiGamification.leaderboard : leaderboard,
        });
        setIsLoading(false);
      }
    };

    computeGamification();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const stats = data?.userStats || {};
  const badges = data?.badges || [];
  const leaderboard = data?.leaderboard || [];

  const filteredBadges = badges.filter(
    (b) => selectedCategory === 'All' || b.category === selectedCategory
  );

  // Leaderboard Pagination
  const totalLeaderboardPages = Math.ceil(leaderboard.length / itemsPerPage) || 1;
  const paginatedLeaderboard = leaderboard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-surface-base text-content-primary overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Gamification Main Scrollable Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>Gamification & XP Progression</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                Achievements, Streaks & Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                Level up your technical skills, unlock milestone badges, maintain streaks, and rise up the candidate ranks.
              </p>
            </div>

            <Badge variant="primary" size="md" className="bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold shrink-0">
              <Zap className="w-4 h-4 mr-1 text-amber-400 inline" />
              {stats.multiplier || 1.0}x Active XP Multiplier
            </Badge>
          </div>

          {/* 1. HERO LEVEL & XP PROGRESSION CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEVEL PROGRESSION CARD (7 Cols) */}
            <Card variant="default" className="lg:col-span-7 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-surface-card rounded-[14px] flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Candidate Rank Level</div>
                      <h2 className="text-xl font-extrabold text-content-primary leading-snug">{stats.levelTitle || 'Level 1 - Junior Candidate'}</h2>
                    </div>
                  </div>

                  <Badge variant="secondary" size="md" className="font-extrabold font-mono text-xs bg-amber-500/10 text-amber-400 shrink-0">
                    {stats.xpPoints || 0} Total XP
                  </Badge>
                </div>

                {/* Level Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-content-secondary">Progress to Level {(stats.level || 1) + 1}</span>
                    <span className="text-amber-400 font-mono font-bold">{stats.xpCurrentLevel || 0} / {stats.xpNextLevel || 300} XP</span>
                  </div>
                  <div className="w-full h-3 bg-surface-base rounded-full overflow-hidden border border-border-subtle p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(((stats.xpCurrentLevel || 0) / (stats.xpNextLevel || 300)) * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-content-secondary">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Earn +250 XP per completed interview round
                </span>
                <span className="text-content-muted font-mono">{stats.totalBadgesUnlocked || 0} / {stats.totalBadges || 6} Badges</span>
              </div>
            </Card>

            {/* DAILY PRACTICE STREAK CARD (5 Cols) */}
            <Card variant="default" className="lg:col-span-5 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-surface-card rounded-[14px] flex items-center justify-center">
                        <Flame className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Daily Streak</div>
                      <h2 className="text-2xl font-extrabold text-content-primary">{stats.streakDays || 0} Consecutive Days</h2>
                    </div>
                  </div>
                </div>

                {/* Streak Milestones */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2.5 rounded-xl bg-surface-base border border-border-subtle space-y-0.5">
                    <span className="text-[10px] text-content-muted font-bold uppercase">3 Days</span>
                    <div className="text-xs font-extrabold text-emerald-400">+50 XP</div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-base border border-emerald-500/30 space-y-0.5">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">7 Days</span>
                    <div className="text-xs font-extrabold text-emerald-400">+200 XP</div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-base border border-border-subtle space-y-0.5 opacity-75">
                    <span className="text-[10px] text-content-muted font-bold uppercase">14 Days</span>
                    <div className="text-xs font-extrabold text-amber-400">+500 XP</div>
                    <span className="text-[10px] text-sky-400 font-bold">Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="text-content-secondary">Practice daily to maintain your multiplier</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </Card>

          </div>

          {/* 2. MILESTONE BADGES COLLECTION GRID */}
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-content-primary flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Milestone Badge Collection</span>
                </h2>
                <p className="text-xs text-content-secondary mt-0.5">Unlock badges by completing practice rounds, maintaining streaks, and scoring 80%+</p>
              </div>

              {/* Badge Category Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-surface-card border border-border-default rounded-xl overflow-x-auto">
                {['All', 'Mastery', 'Streaks', 'Specialist', 'AI Evaluator'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-black shadow-sm font-bold'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full py-12 text-center text-xs font-semibold text-amber-400">Loading badge collection...</div>
              ) : (
                filteredBadges.map((badge) => (
                  <Card
                    key={badge.id}
                    variant="default"
                    className={`p-5 flex flex-col justify-between transition-all ${
                      badge.unlocked
                        ? 'border-amber-500/30 bg-surface-card hover:border-amber-500/60 shadow-lg shadow-amber-500/5'
                        : 'border-border-subtle bg-surface-base/50 opacity-75'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-3xl p-2 rounded-2xl bg-surface-base border border-border-subtle shrink-0">
                          {badge.icon}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" size="sm" className="font-extrabold text-[10px] bg-amber-500/10 text-amber-400">
                            +{badge.xpBonus} XP
                          </Badge>
                          {badge.unlocked ? (
                            <Badge variant="primary" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold">
                              UNLOCKED 🏆
                            </Badge>
                          ) : (
                            <Badge variant="secondary" size="sm" className="bg-surface-hover text-content-muted border-border-subtle font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> LOCKED
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-content-primary">{badge.name}</h3>
                        <p className="text-xs text-content-secondary leading-relaxed mt-1">{badge.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-border-subtle space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-content-muted">
                        <span>Progress</span>
                        <span>{badge.progress} / {badge.maxProgress}</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-base rounded-full overflow-hidden border border-border-subtle">
                        <div
                          className={`h-full rounded-full ${badge.unlocked ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-content-muted'}`}
                          style={{ width: `${Math.round((badge.progress / badge.maxProgress) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

          </div>

          {/* 3. COMMUNITY CANDIDATE LEADERBOARD */}
          <Card variant="default" className="p-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span>Global Candidate Leaderboard</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Top ranked interview practice candidates worldwide</CardDescription>
                </div>

                <Badge variant="primary" size="sm" className="bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold self-start sm:self-auto">
                  Weekly Standings
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-2 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-border-default text-xs font-bold text-content-muted uppercase">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Title / Level</th>
                      <th className="py-3 px-4 text-center">XP Points</th>
                      <th className="py-3 px-4 text-center">Readiness</th>
                      <th className="py-3 px-4 text-center">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-xs">
                    {paginatedLeaderboard.map((u) => (
                      <tr
                        key={u.rank}
                        className={`transition-colors ${
                          u.isCurrentUser
                            ? 'bg-sky-500/10 border-l-4 border-l-sky-500 font-bold'
                            : 'hover:bg-surface-hover'
                        }`}
                      >
                        {/* Rank Medal */}
                        <td className="py-4 px-4 font-mono font-extrabold text-sm">
                          {u.rank === 1 ? '🥇 #1' : u.rank === 2 ? '🥈 #2' : u.rank === 3 ? '🥉 #3' : `#${u.rank}`}
                        </td>

                        {/* Candidate Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${u.avatarColor || 'from-sky-500 to-cyan-400'} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-content-primary block">{u.name}</span>
                              {u.isCurrentUser && (
                                <span className="text-[10px] text-sky-400 font-bold uppercase">Your Rank</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Title / Level */}
                        <td className="py-4 px-4 text-content-secondary font-semibold">
                          {u.title}
                        </td>

                        {/* XP Points */}
                        <td className="py-4 px-4 text-center font-mono font-extrabold text-amber-400">
                          {u.xp} XP
                        </td>

                        {/* Readiness Score */}
                        <td className="py-4 px-4 text-center">
                          <Badge variant="primary" size="sm" className="bg-emerald-500/10 text-emerald-400 font-extrabold">
                            {u.readiness}%
                          </Badge>
                        </td>

                        {/* Streak */}
                        <td className="py-4 px-4 text-center font-bold text-emerald-400">
                          🔥 {u.streakDays}d
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Leaderboard Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalLeaderboardPages}
                onPageChange={setCurrentPage}
                totalItems={leaderboard.length}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </CardContent>
          </Card>

        </main>

      </div>

    </div>
  );
};

export default AchievementsPage;
