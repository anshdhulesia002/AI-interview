import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Play } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getRealUserActivity } from '../../utils/userActivityHelper';
import { ROUTES } from '../../utils/constants';

export const ProfileWidget = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(() => getRealUserActivity());

  useEffect(() => {
    setUserStats(getRealUserActivity());
  }, []);

  const { averageScore, technicalScore, behavioralScore, communicationScore, codingScore, totalSessions } = userStats;

  const skillBreakdown = [
    { name: 'Technical Depth & Architecture', score: technicalScore, color: 'bg-sky-500' },
    { name: 'Algorithmic Problem Solving', score: codingScore, color: 'bg-emerald-500' },
    { name: 'Communication Clarity', score: communicationScore, color: 'bg-cyan-500' },
    { name: 'Behavioral & STAR Method', score: behavioralScore, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Candidate Profile Summary Card */}
      <Card variant="glass" className="p-6 space-y-6 relative overflow-hidden">
        
        {/* Header Avatar & Role */}
        <div className="flex items-center gap-4">
          <Avatar name={user?.name || 'Alex Rivera'} size="xl" status="online" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-content-primary">{user?.name || 'Alex Rivera'}</h3>
            <p className="text-xs text-content-secondary">Target Role: <span className="text-sky-400 font-semibold">{user?.role || 'Software Engineer'}</span></p>
            <div className="flex items-center gap-1.5 pt-1">
              <Badge variant="primary" size="sm">
                {totalSessions === 0 ? 'New Candidate' : `${totalSessions} Session${totalSessions > 1 ? 's' : ''} Completed`}
              </Badge>
            </div>
          </div>
        </div>

        {/* Skill Mastery Breakdown */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-content-primary">
            <span>Domain Skill Mastery</span>
            <span className="text-sky-400">{averageScore}% Overall</span>
          </div>

          <div className="space-y-2.5">
            {skillBreakdown.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-content-secondary">
                  <span>{skill.name}</span>
                  <span className="font-mono font-bold text-content-primary">{skill.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, skill.score))}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${skill.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Mock Interview Action Button */}
        <div className="pt-2">
          <Link to={ROUTES.INTERVIEWS} className="block">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-lg shadow-sky-500/25 gap-2 cursor-pointer"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Start New Mock Interview
            </Button>
          </Link>
        </div>

      </Card>

      {/* Recommended Practice Track Widget */}
      <Card variant="default" className="p-5 space-y-3 border-sky-500/20 bg-sky-500/5">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
          <Target className="w-4 h-4" />
          <span>Recommended Practice</span>
        </div>
        <h4 className="text-sm font-bold text-content-primary">Node.js & React Mock Session</h4>
        <p className="text-xs text-content-secondary leading-relaxed">
          {averageScore === 0
            ? 'Complete your first practice round to receive customized AI feedback recommendations.'
            : 'Practicing System Architecture trade-offs will boost your readiness index.'}
        </p>
        <Link to={ROUTES.INTERVIEWS} className="block">
          <Button variant="outline" size="sm" className="w-full justify-center text-xs cursor-pointer">
            Start Recommended Round
          </Button>
        </Link>
      </Card>

    </div>
  );
};
