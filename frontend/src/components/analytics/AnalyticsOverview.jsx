import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart2, PieChart as PieIcon, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { WeeklyLineChart } from './WeeklyLineChart';
import { MonthlyBarChart } from './MonthlyBarChart';
import { SkillRadarChart } from './SkillRadarChart';
import { DomainPieChart } from './DomainPieChart';

export const AnalyticsOverview = () => {
  const [leftTab, setLeftTab] = useState('weekly'); // 'weekly' | 'monthly'
  const [rightTab, setRightTab] = useState('radar'); // 'radar' | 'pie'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Left Column (8 cols): Progress Charts (Line / Bar) */}
      <div className="lg:col-span-8">
        <Card variant="default" className="p-6 h-full flex flex-col justify-between">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-400" />
                <span>Performance & Progress Analytics</span>
              </CardTitle>
              <CardDescription>
                Track your score improvements and practice session volume over time
              </CardDescription>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-surface-base border border-border-default rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setLeftTab('weekly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  leftTab === 'weekly'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Weekly Line
              </button>
              <button
                type="button"
                onClick={() => setLeftTab('monthly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  leftTab === 'monthly'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Monthly Bar
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <AnimatePresence mode="wait">
              {leftTab === 'weekly' ? (
                <motion.div
                  key="weekly"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <WeeklyLineChart />
                </motion.div>
              ) : (
                <motion.div
                  key="monthly"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <MonthlyBarChart />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Right Column (4 cols): Skill Breakdown & Domain Distribution (Radar / Pie) */}
      <div className="lg:col-span-4">
        <Card variant="default" className="p-6 h-full flex flex-col justify-between">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Skill Mastery</span>
              </CardTitle>
              <CardDescription>Domain distribution & radar competency</CardDescription>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-surface-base border border-border-default rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setRightTab('radar')}
                className={`p-1.5 rounded-lg transition-all ${
                  rightTab === 'radar'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-content-muted hover:text-content-primary'
                }`}
                title="Radar Chart"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRightTab('pie')}
                className={`p-1.5 rounded-lg transition-all ${
                  rightTab === 'pie'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-content-muted hover:text-content-primary'
                }`}
                title="Donut Pie Chart"
              >
                <PieIcon className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <AnimatePresence mode="wait">
              {rightTab === 'radar' ? (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <SkillRadarChart />
                </motion.div>
              ) : (
                <motion.div
                  key="pie"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <DomainPieChart />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
