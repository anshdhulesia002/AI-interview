import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Download,
  ArrowRight,
  Target,
  BookOpen,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { generatePDFReport } from '../utils/pdfGenerator';
import { ROUTES } from '../utils/constants';

const parseReportFromStorage = () => {
  try {
    const saved = localStorage.getItem('user_latest_report');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        title: parsed.title || 'Technical Candidate Evaluation Report',
        date: parsed.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : (parsed.score || 0),
        percentile: parsed.percentile || (parsed.overallScore === 0 ? 'Bottom 5%' : 'Top 15%'),
        status: parsed.status || (parsed.overallScore === 0 ? 'Needs Improvement / No Answers Submitted' : 'Pass / Recommended for Offer'),
        breakdown: parsed.breakdown || {
          technicalScore: parsed.overallScore || 0,
          behavioralScore: parsed.overallScore || 0,
          communicationScore: parsed.overallScore || 0,
          problemSolvingScore: parsed.overallScore || 0,
        },
        strongAreas: parsed.keyStrengths || parsed.strongAreas || (parsed.overallScore === 0 ? ['No strong technical areas identified because no answers were submitted.'] : ['Attempted candidate technical responses.']),
        weakAreas: parsed.areasForImprovement || parsed.weakAreas || (parsed.overallScore === 0 ? ['No responses provided for any of the 4 interview questions.', 'Microphone input or text input was missing.'] : ['Elaborate further on system design details.']),
        improvementTips: (parsed.actionableRoadmap || parsed.improvementTips || []).map((item, idx) => ({
          week: item.topic || item.week || `Step ${idx + 1}`,
          tip: item.recommendation || item.tip || 'Practice timed mock rounds.',
        })),
      };
    }
  } catch {
    // LocalStorage exception handled
  }

  return {
    title: 'Technical Candidate Evaluation Report',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    overallScore: 0,
    percentile: 'Bottom 5%',
    status: 'Needs Improvement / No Answers Submitted',
    breakdown: {
      technicalScore: 0,
      behavioralScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
    },
    strongAreas: [
      'Mock interview session started, but no candidate answers were submitted for evaluation.',
    ],
    weakAreas: [
      'No responses were recorded for any of the 4 interview questions.',
      'Make sure your microphone is unmuted or type your answers into the answer box before advancing.',
      'Zero technical depth, problem-solving speed, or STAR method communication demonstrated.',
    ],
    improvementTips: [
      {
        week: 'Step 1: Test Microphone & Web Speech API',
        tip: 'Click the Microphone ON button and verify browser mic permissions.',
      },
      {
        week: 'Step 2: Answer Technical Questions',
        tip: 'Speak or type for at least 60-90 seconds per question before completing.',
      },
    ],
  };
};

export const InterviewReportPage = () => {
  const navigate = useNavigate();

  // Dynamic Report Data State (Loaded from candidate's actual session)
  const [reportData, setReportData] = useState(() => parseReportFromStorage());

  useEffect(() => {
    setReportData(parseReportFromStorage());
  }, []);

  return (
    <div className="flex min-h-screen bg-surface-base text-content-primary">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Report Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Session Completed & Evaluated by Gemini AI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                {reportData.title}
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Evaluated on {reportData.date}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => generatePDFReport(reportData)}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download PDF
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-lg shadow-sky-500/20"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>

          {/* 1. OVERALL SCORE & BREAKDOWN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* OVERALL SCORE GAUGE CARD (5 cols) */}
            <Card variant="glass" className="lg:col-span-5 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">Overall Readiness Grade</span>
              
              {/* Circular Gauge Ring */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-hover stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-sky-400 stroke-current"
                    strokeDasharray={`${reportData.overallScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${reportData.overallScore}, 100` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-content-primary">{reportData.overallScore}</span>
                  <span className="text-xs text-content-muted">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <Badge variant="primary" size="md" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                  {reportData.status}
                </Badge>
                <p className="text-xs text-content-secondary mt-1">
                  Performance Rank: <strong className="text-sky-400">{reportData.percentile}</strong> of candidates
                </p>
              </div>
            </Card>

            {/* SCORE BREAKDOWN BARS (7 cols) */}
            <Card variant="default" className="lg:col-span-7 p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-content-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-400" />
                  <span>Performance Breakdown</span>
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">Evaluation across 4 core competency domains</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Technical Depth & Architecture', score: reportData.breakdown.technicalScore, color: 'bg-sky-500' },
                  { label: 'Problem Solving Speed', score: reportData.breakdown.problemSolvingScore, color: 'bg-emerald-500' },
                  { label: 'Communication Clarity', score: reportData.breakdown.communicationScore, color: 'bg-cyan-500' },
                  { label: 'Behavioral & STAR Method', score: reportData.breakdown.behavioralScore, color: 'bg-indigo-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-content-primary">{item.label}</span>
                      <span className="text-sky-400 font-mono font-bold">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-base rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* 2. STRONG AREAS & WEAK AREAS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* STRONG AREAS CARD */}
            <Card variant="default" className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Strong Areas</span>
                </CardTitle>
                <CardDescription>Key competencies demonstrated during evaluation</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                {reportData.strongAreas.map((strength, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-200 leading-relaxed">{strength}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* WEAK AREAS CARD */}
            <Card variant="default" className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Weak Areas & Gaps</span>
                </CardTitle>
                <CardDescription>Technical areas to refine before live company rounds</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                {reportData.weakAreas.map((weakness, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-amber-200 leading-relaxed">{weakness}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* 3. ACTIONABLE IMPROVEMENT TIPS ROADMAP */}
          <Card variant="default" className="p-6 space-y-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-400" />
                <span>Actionable 4-Week Improvement Tips Roadmap</span>
              </CardTitle>
              <CardDescription>Step-by-step preparation timeline generated by Gemini AI</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {reportData.improvementTips.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-surface-base/80 border border-border-default space-y-2 hover:border-sky-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{item.week}</span>
                  </div>
                  <p className="text-xs text-content-secondary leading-relaxed">
                    {item.tip}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

        </main>

      </div>

    </div>
  );
};

export default InterviewReportPage;
