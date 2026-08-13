import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Video,
  FileText,
  User,
  Compass,
  X,
  ArrowRight,
  BarChart3,
  Award,
  Settings,
  Shield,
  CornerDownLeft,
} from 'lucide-react';
import { Badge } from './Badge';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search Items Corpus
  const interviewsCorpus = [
    { id: 'int_1', title: 'Senior Node.js & Backend Architecture', domain: 'Node.js', difficulty: 'Senior', path: '/interviews/room', category: 'interviews' },
    { id: 'int_2', title: 'React 19 Server Components & State Systems', domain: 'React', difficulty: 'Senior', path: '/interviews/room', category: 'interviews' },
    { id: 'int_3', title: 'System Design & Distributed Redis Caching', domain: 'System Design', difficulty: 'Staff Architect', path: '/interviews/room', category: 'interviews' },
    { id: 'int_4', title: 'Data Structures & Algorithmic Problem Solving', domain: 'DSA', difficulty: 'Intermediate', path: '/interviews/room', category: 'interviews' },
    { id: 'int_5', title: 'UI/UX Design Systems & Figma Prototyping', domain: 'UI/UX', difficulty: 'Senior', path: '/interviews/room', category: 'interviews' },
  ];

  const reportsCorpus = [
    { id: 'rep_1', title: 'Node.js & Backend Architecture Report', score: 92, summary: 'Strong architectural understanding of event loop, worker threads, and rate limiters.', path: '/interviews/report', category: 'reports' },
    { id: 'rep_2', title: 'React 19 Modern Frontend Practice Report', score: 95, summary: 'Exemplary STAR breakdown of React 19 flight payload and hydration optimization.', path: '/interviews/report', category: 'reports' },
    { id: 'rep_3', title: 'System Design Distributed Services Report', score: 88, summary: 'Solid discussion on database sharding and CAP theorem trade-offs.', path: '/interviews/report', category: 'reports' },
  ];

  const usersCorpus = [
    { id: 'usr_1', name: 'John Developer', title: 'John Developer', email: 'john@example.com', role: 'Candidate', path: '/profile', category: 'users' },
    { id: 'usr_2', name: 'Sarah Chen', title: 'Sarah Chen', email: 'sarah@example.com', role: 'Senior Frontend Candidate', path: '/profile', category: 'users' },
    { id: 'usr_3', name: 'David Miller', title: 'David Miller', email: 'david@example.com', role: 'Staff Backend Engineer', path: '/profile', category: 'users' },
  ];

  const pagesCorpus = [
    { id: 'page_1', title: 'Practice Suite & 11 Domains', icon: <Video className="w-4 h-4 text-sky-400" />, path: '/interviews', category: 'pages' },
    { id: 'page_2', title: 'Interview Session History', icon: <FileText className="w-4 h-4 text-emerald-400" />, path: '/history', category: 'pages' },
    { id: 'page_3', title: 'Performance Analytics', icon: <BarChart3 className="w-4 h-4 text-purple-400" />, path: '/analytics', category: 'pages' },
    { id: 'page_4', title: 'Gamification & Leaderboard', icon: <Award className="w-4 h-4 text-amber-400" />, path: '/achievements', category: 'pages' },
    { id: 'page_6', title: 'Candidate Settings', icon: <Settings className="w-4 h-4 text-sky-400" />, path: '/settings', category: 'pages' },
    { id: 'page_7', title: 'Super Admin Portal', icon: <Shield className="w-4 h-4 text-red-400" />, path: '/admin', category: 'pages' },
  ];

  // Filtering Logic
  const filteredInterviews = interviewsCorpus.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()) || i.domain.toLowerCase().includes(query.toLowerCase())
  );

  const filteredReports = reportsCorpus.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()) || r.summary.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = usersCorpus.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPages = pagesCorpus.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  // Flattened Visible Items list for keyboard navigation
  const visibleItems = [];
  if (activeFilter === 'all' || activeFilter === 'interviews') visibleItems.push(...filteredInterviews);
  if (activeFilter === 'all' || activeFilter === 'reports') visibleItems.push(...filteredReports);
  if (activeFilter === 'all' || activeFilter === 'users') visibleItems.push(...filteredUsers);
  if (activeFilter === 'all' || activeFilter === 'pages') visibleItems.push(...filteredPages);

  // Reset keyboard index when query or filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  const handleSelectResult = (path) => {
    onClose();
    navigate(path);
  };

  // Keyboard navigation listener (ArrowUp, ArrowDown, Enter, ESC)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (visibleItems.length > 0 ? (prev + 1) % visibleItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (visibleItems.length > 0 ? (prev - 1 + visibleItems.length) % visibleItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (visibleItems[selectedIndex]) {
          handleSelectResult(visibleItems[selectedIndex].path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, visibleItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-surface-card border border-border-default rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Top Search Input Header */}
          <div className="p-4 border-b border-border-subtle flex items-center gap-3 relative">
            <Search className="w-5 h-5 text-sky-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search interviews, AI reports, candidates, or pages (Use ↑ ↓ Enter)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-content-primary placeholder:text-content-muted focus:outline-none font-medium"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex items-center gap-1 p-2 bg-surface-base border-b border-border-subtle overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'interviews', label: `Interviews (${filteredInterviews.length})` },
              { id: 'reports', label: `Reports (${filteredReports.length})` },
              { id: 'users', label: `Candidates (${filteredUsers.length})` },
              { id: 'pages', label: `Navigation (${filteredPages.length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeFilter === f.id
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Results Body Container */}
          <div className="p-4 overflow-y-auto space-y-5 flex-1 divide-y divide-border-subtle">
            
            {/* 1. INTERVIEWS SECTION */}
            {(activeFilter === 'all' || activeFilter === 'interviews') && filteredInterviews.length > 0 && (
              <div className="space-y-2 pt-2 first:pt-0">
                <h5 className="text-[11px] font-extrabold text-content-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-sky-400" />
                  <span>Interview Practice Sessions</span>
                </h5>
                <div className="space-y-1.5">
                  {filteredInterviews.map((item) => {
                    const globalIdx = visibleItems.findIndex((v) => v.id === item.id);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item.path)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500/60 ring-2 ring-sky-500/20'
                            : 'bg-surface-base/60 border-border-subtle hover:bg-surface-hover'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold transition-colors ${isSelected ? 'text-sky-400' : 'text-content-primary'}`}>
                            {item.title}
                          </div>
                          <span className="text-[10px] text-content-muted">{item.domain} • {item.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[10px] font-bold text-sky-400 flex items-center gap-0.5">
                              Press <CornerDownLeft className="w-3 h-3" />
                            </span>
                          )}
                          <ArrowRight className={`w-4 h-4 transition-all ${isSelected ? 'text-sky-400 translate-x-1' : 'text-content-muted'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. REPORTS SECTION */}
            {(activeFilter === 'all' || activeFilter === 'reports') && filteredReports.length > 0 && (
              <div className="space-y-2 pt-4 first:pt-0">
                <h5 className="text-[11px] font-extrabold text-content-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Evaluation Reports</span>
                </h5>
                <div className="space-y-1.5">
                  {filteredReports.map((item) => {
                    const globalIdx = visibleItems.findIndex((v) => v.id === item.id);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item.path)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/60 ring-2 ring-emerald-500/20'
                            : 'bg-surface-base/60 border-border-subtle hover:bg-surface-hover'
                        }`}
                      >
                        <div className="space-y-0.5 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-emerald-400' : 'text-content-primary'}`}>
                              {item.title}
                            </span>
                            <Badge variant="primary" size="sm" className="bg-emerald-500/10 text-emerald-400 font-extrabold text-[9px]">
                              {item.score}%
                            </Badge>
                          </div>
                          <p className="text-[11px] text-content-secondary truncate">{item.summary}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                              Press <CornerDownLeft className="w-3 h-3" />
                            </span>
                          )}
                          <ArrowRight className={`w-4 h-4 transition-all ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-content-muted'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. USERS SECTION */}
            {(activeFilter === 'all' || activeFilter === 'users') && filteredUsers.length > 0 && (
              <div className="space-y-2 pt-4 first:pt-0">
                <h5 className="text-[11px] font-extrabold text-content-muted uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Candidate Profiles</span>
                </h5>
                <div className="space-y-1.5">
                  {filteredUsers.map((item) => {
                    const globalIdx = visibleItems.findIndex((v) => v.id === item.id);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item.path)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-500/60 ring-2 ring-purple-500/20'
                            : 'bg-surface-base/60 border-border-subtle hover:bg-surface-hover'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold transition-colors ${isSelected ? 'text-purple-400' : 'text-content-primary'}`}>
                            {item.name}
                          </div>
                          <span className="text-[10px] text-content-muted">{item.email} • {item.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[10px] font-bold text-purple-400 flex items-center gap-0.5">
                              Press <CornerDownLeft className="w-3 h-3" />
                            </span>
                          )}
                          <ArrowRight className={`w-4 h-4 transition-all ${isSelected ? 'text-purple-400 translate-x-1' : 'text-content-muted'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. PAGES & NAVIGATION SECTION */}
            {(activeFilter === 'all' || activeFilter === 'pages') && filteredPages.length > 0 && (
              <div className="space-y-2 pt-4 first:pt-0">
                <h5 className="text-[11px] font-extrabold text-content-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick System Navigation</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredPages.map((item) => {
                    const globalIdx = visibleItems.findIndex((v) => v.id === item.id);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item.path)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20'
                            : 'bg-surface-base/60 border-border-subtle hover:bg-surface-hover'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-surface-card border border-border-subtle">
                            {item.icon}
                          </div>
                          <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-amber-400' : 'text-content-primary'}`}>
                            {item.title}
                          </span>
                        </div>
                        {isSelected && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NO RESULTS FALLBACK */}
            {filteredInterviews.length === 0 &&
              filteredReports.length === 0 &&
              filteredUsers.length === 0 &&
              filteredPages.length === 0 && (
                <div className="py-12 text-center text-xs text-content-muted space-y-2">
                  <Search className="w-8 h-8 mx-auto text-content-muted opacity-40 animate-bounce" />
                  <p className="font-semibold text-content-primary">No results found for &quot;{query}&quot;</p>
                  <p>Try searching for &quot;Node.js&quot;, &quot;React&quot;, &quot;Report&quot;, &quot;Analytics&quot;, or candidate names.</p>
                </div>
              )}

          </div>

          {/* Footer Keyboard Navigation Shortcuts Legend */}
          <div className="p-3 bg-surface-base border-t border-border-subtle text-[11px] text-content-muted flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-card border border-border-default font-mono text-[10px] font-bold">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-surface-card border border-border-default font-mono text-[10px] font-bold">↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-card border border-border-default font-mono text-[10px] font-bold">↵</kbd> select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-card border border-border-default font-mono text-[10px] font-bold">ESC</kbd> close
              </span>
            </div>
            <span className="font-semibold text-sky-400">Ctrl+K Command Palette</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalSearchModal;
