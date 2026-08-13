import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Clock, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getRealUserActivity, setSelectedSessionReport } from '../../utils/userActivityHelper';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const RecentActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const activityData = getRealUserActivity();
    setActivities(activityData.completedInterviews);
  }, []);

  return (
    <Card variant="default" className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg">Recent Mock Interviews</CardTitle>
          <CardDescription>Review your past simulation scorecards and feedback</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.HISTORY)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="cursor-pointer"
        >
          View All History
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {activities.length === 0 ? (
          <div className="p-8 text-center bg-surface-base/50 rounded-2xl border border-dashed border-border-default space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-content-primary">No Mock Interview Sessions Recorded Yet</h4>
              <p className="text-xs text-content-muted mt-1 max-w-sm mx-auto">
                Complete your first AI mock interview session to unlock your performance scorecard, speech analysis, and readiness analytics.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.INTERVIEWS)}
              className="shadow-lg shadow-sky-500/20 cursor-pointer"
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Start First Practice Session
            </Button>
          </div>
        ) : (
          activities.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              onClick={() => {
                setSelectedSessionReport(item);
                navigate('/interviews/report');
              }}
              className="p-4 rounded-2xl bg-surface-base/60 border border-border-subtle hover:bg-surface-hover hover:border-sky-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-content-primary">{item.title}</h4>
                    <Badge variant={item.score >= 80 ? 'success' : item.score > 0 ? 'warning' : 'neutral'} size="sm">
                      {item.category || 'Technical'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-content-muted">
                    <span>Difficulty: {item.difficulty || 'Senior'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border-subtle">
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-lg font-extrabold text-content-primary">{item.score}</span>
                    <span className="text-xs text-content-muted">/100</span>
                  </div>
                  <span className={`text-[10px] font-bold flex items-center justify-end gap-1 ${item.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> {item.status || (item.score >= 80 ? 'Pass' : 'Needs Practice')}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSessionReport(item);
                    navigate('/interviews/report');
                  }}
                  rightIcon={<Sparkles className="w-3.5 h-3.5" />}
                  className="cursor-pointer"
                >
                  Report
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
