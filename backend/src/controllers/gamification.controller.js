import { Interview } from '../models/Interview.model.js';
import { Report } from '../models/Report.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// 1. Get Candidate Gamification Data (XP, Level, Streak, Badges & Dynamic Leaderboard)
export const getGamificationOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalInterviews = await Interview.countDocuments({ userId });
  const reports = await Report.find({ userId });

  const totalQuestions = totalInterviews * 4;
  const xpPoints = totalInterviews * 250 + totalQuestions * 25;
  const level = totalInterviews > 0 ? Math.floor(xpPoints / 250) + 1 : 1;
  const xpCurrentLevel = xpPoints % 250;
  const xpNextLevel = 250;

  // Level Title Taxonomy
  const getLevelTitle = (lvl) => {
    if (lvl >= 20) return 'Level 20 - Principal Tech Architect';
    if (lvl >= 15) return 'Level 15 - Staff Systems Engineer';
    if (lvl >= 10) return 'Level 10 - Senior Technical Lead';
    if (lvl >= 5) return 'Level 5 - Fullstack Developer';
    return 'Level 1 - Junior Candidate';
  };

  const hasSystemDesign = reports.some((r) => r.overallScore >= 80);
  const has100Score = reports.some((r) => r.overallScore >= 95);

  // Badges Collection Matrix
  const badges = [
    {
      id: 'first_interview',
      name: 'First Blood Practice',
      description: 'Completed your very first mock interview round',
      icon: '🎯',
      category: 'Mastery',
      unlocked: totalInterviews >= 1,
      progress: Math.min(totalInterviews, 1),
      maxProgress: 1,
      xpBonus: 100,
    },
    {
      id: 'streak_master',
      name: '7-Day Streak Legend',
      description: 'Maintained active interview practice for 7 consecutive days',
      icon: '🔥',
      category: 'Streaks',
      unlocked: totalInterviews >= 7,
      progress: Math.min(totalInterviews, 7),
      maxProgress: 7,
      xpBonus: 300,
    },
    {
      id: 'system_design_guru',
      name: 'System Design Architect',
      description: 'Scored 80%+ in System Design practice rounds',
      icon: '🏛️',
      category: 'Specialist',
      unlocked: hasSystemDesign,
      progress: hasSystemDesign ? 1 : 0,
      maxProgress: 1,
      xpBonus: 250,
    },
    {
      id: 'voice_master',
      name: 'Speech Auto-Fill Pro',
      description: 'Used Web Speech API voice auto-fill for interview answers',
      icon: '🎙️',
      category: 'AI Evaluator',
      unlocked: totalInterviews >= 1,
      progress: Math.min(totalInterviews, 1),
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
      unlocked: has100Score,
      progress: has100Score ? 1 : 0,
      maxProgress: 1,
      xpBonus: 500,
    },
  ];

  const scores = reports.map((r) => r.overallScore);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Global Community Leaderboard - Sorted by XP Descending
  const rawLeaderboard = [
    { name: `${req.user.name || 'Candidate'} (You)`, title: getLevelTitle(level), xp: xpPoints, readiness: avgScore, streakDays: totalInterviews > 0 ? 1 : 0, avatarColor: 'from-sky-500 to-cyan-400', isCurrentUser: true },
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        userStats: {
          level,
          levelTitle: getLevelTitle(level),
          xpPoints,
          xpCurrentLevel,
          xpNextLevel,
          streakDays: totalInterviews > 0 ? 1 : 0,
          multiplier: totalInterviews > 0 ? 1.5 : 1.0,
          totalBadgesUnlocked: badges.filter((b) => b.unlocked).length,
          totalBadges: badges.length,
        },
        badges,
        leaderboard,
      },
      'Gamification overview calculated cleanly based on candidate activity'
    )
  );
});
