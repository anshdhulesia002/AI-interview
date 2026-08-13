import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Server,
  FileCode2,
  Database,
  Users,
  Terminal,
  Coffee,
  Layers,
  Palette,
  Cloud,
  GitBranch,
  Search,
  Sparkles,
  Play,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { InterviewSetupModal } from '../components/interview/InterviewSetupModal';
import { interviewService } from '../services/apiService';

export const InterviewCategoryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activeModalCategory, setActiveModalCategory] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  // All 11 Requested Categories
  const categories = [
    {
      id: 'react',
      title: 'React 19 & Frontend',
      type: 'technical',
      count: '140+ Questions',
      icon: <Code2 className="w-6 h-6 text-sky-400" />,
      badgeColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      description: 'React 19, Custom Hooks, Fiber Architecture, Server Components & State Management.',
      companies: ['Meta', 'Netflix', 'Vercel', 'Uber'],
      tags: ['Hooks', 'Fiber', 'Zustand', 'RSC'],
    },
    {
      id: 'node',
      title: 'Node.js & Runtime',
      type: 'technical',
      count: '120+ Questions',
      icon: <Server className="w-6 h-6 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      description: 'Event Loop, Microservices, EventEmitters, Streams & Async I/O Performance.',
      companies: ['LinkedIn', 'PayPal', 'Amazon', 'Stripe'],
      tags: ['Event Loop', 'Express', 'Streams', 'Async'],
    },
    {
      id: 'javascript',
      title: 'JavaScript (ES6+)',
      type: 'technical',
      count: '150+ Questions',
      icon: <FileCode2 className="w-6 h-6 text-amber-400" />,
      badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      description: 'Closures, Prototypes, Event Loop, Promises, Memory Leaks & V8 Optimization.',
      companies: ['Google', 'Meta', 'Apple', 'Airbnb'],
      tags: ['Closures', 'Promises', 'Prototypes', 'V8'],
    },
    {
      id: 'mongodb',
      title: 'MongoDB & NoSQL',
      type: 'technical',
      count: '90+ Questions',
      icon: <Database className="w-6 h-6 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      description: 'Aggregation Pipelines, Compound Indexing, Document Schemas & Sharding.',
      companies: ['Coinbase', 'eBay', 'Adobe', 'MongoDB Inc.'],
      tags: ['Aggregations', 'Indexes', 'Sharding'],
    },
    {
      id: 'hr',
      title: 'HR & Behavioral',
      type: 'behavioral',
      count: '110+ Questions',
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      badgeColor: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      description: 'STAR Method Storytelling, Leadership Principles, Conflict Resolution & Culture Fit.',
      companies: ['Amazon', 'Google', 'Apple', 'Microsoft'],
      tags: ['STAR Method', 'Leadership', 'Culture Fit'],
    },
    {
      id: 'python',
      title: 'Python & AI/ML',
      type: 'technical',
      count: '130+ Questions',
      icon: <Terminal className="w-6 h-6 text-cyan-400" />,
      badgeColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      description: 'Asyncio, Generators, Memory Management, Decorators, GIL & Data Science.',
      companies: ['Google', 'Meta', 'OpenAI', 'Netflix'],
      tags: ['Asyncio', 'GIL', 'Generators', 'AI/ML'],
    },
    {
      id: 'java',
      title: 'Java & Spring Boot',
      type: 'technical',
      count: '125+ Questions',
      icon: <Coffee className="w-6 h-6 text-amber-500" />,
      badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
      description: 'OOP Design Patterns, JVM Garbage Collection, Multithreading & Spring Boot.',
      companies: ['Oracle', 'Amazon', 'Goldman Sachs', 'Uber'],
      tags: ['JVM', 'Multithreading', 'Spring Boot'],
    },
    {
      id: 'system_design',
      title: 'System Design',
      type: 'system_design',
      count: '95+ Questions',
      icon: <Layers className="w-6 h-6 text-sky-400" />,
      badgeColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      description: 'Distributed Caching, Load Balancers, Sharding, Message Queues & Microservices.',
      companies: ['Google', 'Meta', 'Amazon', 'Netflix'],
      tags: ['Caching', 'Kafka', 'Sharding', 'CAP Theorem'],
    },
    {
      id: 'ui_ux',
      title: 'UI / UX Design Systems',
      type: 'technical',
      count: '85+ Questions',
      icon: <Palette className="w-6 h-6 text-pink-400" />,
      badgeColor: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
      description: 'Design Systems, Accessibility (WCAG 2.1), Component State & Micro-interactions.',
      companies: ['Figma', 'Apple', 'Google', 'Stripe'],
      tags: ['WCAG', 'Design Tokens', 'Figma', 'Tokens'],
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps',
      type: 'system_design',
      count: '105+ Questions',
      icon: <Cloud className="w-6 h-6 text-cyan-400" />,
      badgeColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      description: 'AWS Infrastructure, Kubernetes Clusters, Docker Containers & CI/CD Pipelines.',
      companies: ['AWS', 'Microsoft Azure', 'Datadog', 'HashiCorp'],
      tags: ['AWS', 'K8s', 'Docker', 'CI/CD'],
    },
    {
      id: 'dsa',
      title: 'DSA (Data Structures)',
      type: 'technical',
      count: '200+ Questions',
      icon: <GitBranch className="w-6 h-6 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      description: 'Trees, Graphs, Dynamic Programming, Sliding Window, Heap & Sorting Algorithms.',
      companies: ['Google', 'Meta', 'Amazon', 'Apple'],
      tags: ['Trees', 'Graphs', 'Dynamic Prog', 'Heaps'],
    },
  ];

  // Filtering Logic
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || cat.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Generate & Save Interview Handler -> Redirects to /interviews/room!
  const handleGenerateInterview = async (configData) => {
    const domainTitle = activeModalCategory?.title || configData.role || 'Node.js & Backend Architecture';
    try {
      const response = await interviewService.createInterview({
        role: configData.role || domainTitle,
        difficulty: configData.difficulty,
        experienceYears: configData.experienceYears,
        durationMinutes: configData.durationMinutes,
        domain: domainTitle,
      });

      const interviewId = response.data?.interview?._id;
      const createdQuestions = response.data?.questions || [];

      const activeSessionPayload = {
        id: interviewId || Date.now().toString(),
        title: `${domainTitle} Practice Round`,
        domain: domainTitle,
        category: domainTitle,
        difficulty: configData.difficulty || 'Mid',
        durationMinutes: configData.durationMinutes || 45,
        questions: createdQuestions,
      };
      localStorage.setItem('active_interview_session', JSON.stringify(activeSessionPayload));

      if (interviewId) {
        navigate(`/interviews/${interviewId}/room`);
      } else {
        navigate('/interviews/room');
      }
    } catch {
      const activeSessionPayload = {
        id: Date.now().toString(),
        title: `${domainTitle} Practice Round`,
        domain: domainTitle,
        category: domainTitle,
        difficulty: configData.difficulty || 'Mid',
        durationMinutes: configData.durationMinutes || 45,
        questions: [],
      };
      localStorage.setItem('active_interview_session', JSON.stringify(activeSessionPayload));
      navigate('/interviews/room');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-base text-content-primary">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Categories Main Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>11 Specialized Domains</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                Interview Categories & Practice Rounds
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                Configure your target Role, Difficulty, Experience, and Duration to generate & store an interview in MongoDB.
              </p>
            </div>
          </div>

          {/* Database Persistence Success Toast Banner */}
          <AnimatePresence>
            {successBanner && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-400 text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successBanner}</span>
                </div>
                <button type="button" onClick={() => setSuccessBanner(null)}>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-card p-4 rounded-2xl border border-border-default">
            
            {/* Search Input */}
            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories (e.g. React, DSA, AWS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Category Type Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-surface-base border border-border-default rounded-xl w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'all', label: 'All Domains' },
                { id: 'technical', label: 'Technical' },
                { id: 'system_design', label: 'System Design' },
                { id: 'behavioral', label: 'Behavioral & HR' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    selectedType === tab.id
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* 11 CATEGORIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="h-full"
              >
                <Card
                  variant="default"
                  className="h-full p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all overflow-hidden relative group"
                >
                  <div className="space-y-4">
                    
                    {/* Header Icon & Count Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className={`p-3 rounded-2xl border ${cat.badgeColor} shrink-0 group-hover:scale-105 transition-transform`}>
                        {cat.icon}
                      </div>
                      <Badge variant="primary" size="sm" className="font-semibold">
                        {cat.count}
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-content-primary group-hover:text-sky-400 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-content-secondary leading-relaxed mt-2 line-clamp-3">
                        {cat.description}
                      </p>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {cat.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-base border border-border-subtle text-content-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between gap-2">
                    <div className="text-[11px] text-content-muted truncate">
                      Target: <span className="text-content-primary font-semibold">{cat.companies.slice(0, 2).join(', ')}</span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveModalCategory(cat)}
                      rightIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                      className="shrink-0 shadow-md shadow-sky-500/20"
                    >
                      Start Practice
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

        </main>

      </div>

      {/* SESSION GENERATION & SETUP MODAL */}
      {activeModalCategory && (
        <InterviewSetupModal
          isOpen={!!activeModalCategory}
          onClose={() => setActiveModalCategory(null)}
          initialDomain={activeModalCategory.title}
          onGenerate={handleGenerateInterview}
        />
      )}

    </div>
  );
};

export default InterviewCategoryPage;
