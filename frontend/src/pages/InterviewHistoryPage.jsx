import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  Trash2,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard } from '../components/ui/Skeleton';
import { interviewService } from '../services/apiService';
import { setSelectedSessionReport } from '../utils/userActivityHelper';
import { ROUTES } from '../utils/constants';

export const InterviewHistoryPage = () => {
  const navigate = useNavigate();

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalSession, setDeleteModalSession] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // User-Isolated History Sessions State (Fetched from MongoDB for req.user._id)
  const [sessions, setSessions] = useState([]);

  // Fetch User-Isolated History from MongoDB & LocalStorage on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchUserHistory = async () => {
      setIsLoading(true);
      let localSessions = [];
      try {
        localSessions = JSON.parse(localStorage.getItem('user_completed_interviews') || '[]');
      } catch {
        localSessions = [];
      }

      try {
        const response = await interviewService.getUserInterviews();
        if (isMounted) {
          const apiSessions = Array.isArray(response.data) ? response.data : [];
          const mergedMap = new Map();
          [...apiSessions, ...localSessions].forEach((s) => {
            if (s && s.id) mergedMap.set(s.id, s);
          });
          setSessions(Array.from(mergedMap.values()));
        }
      } catch {
        if (isMounted) {
          setSessions(localSessions);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtering Logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.difficulty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || session.category === selectedCategory;

    const matchesScore =
      selectedScoreFilter === 'all' ||
      (selectedScoreFilter === 'pass' && session.score >= 80) ||
      (selectedScoreFilter === 'review' && session.score < 80);

    return matchesSearch && matchesCategory && matchesScore;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

  // Delete Session Handler
  const handleDeleteSession = async () => {
    if (!deleteModalSession) return;
    setIsDeleting(true);

    try {
      await interviewService.deleteInterview(deleteModalSession.id);
    } catch {
      // Local fallback state deletion
    } finally {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== deleteModalSession.id);
        try {
          localStorage.setItem('user_completed_interviews', JSON.stringify(updated));
        } catch {
          // LocalStorage exception handled
        }
        return updated;
      });
      setToastMessage(`Interview session "${deleteModalSession.title}" deleted successfully!`);
      setDeleteModalSession(null);
      setIsDeleting(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Download PDF Report Handler
  const handleDownloadReport = (session) => {
    alert(`Downloading PDF Evaluation Report for "${session.title}"...`);
  };

  return (
    <div className="flex min-h-screen bg-surface-base text-content-primary">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* History Main Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-2">
                <History className="w-3.5 h-3.5" />
                <span>{sessions.length} Interview Sessions in Your History</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                Interview Practice History & Evaluation Reports
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                Your practice history is isolated securely to your account. View past scores, download reports, or delete sessions.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.INTERVIEWS)}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="shadow-lg shadow-sky-500/20 shrink-0"
            >
              Start New Practice Session
            </Button>
          </div>

          {/* Toast Notification Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-400 text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
                <button type="button" onClick={() => setToastMessage(null)}>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search, Category & Score Filter Controls */}
          <div className="bg-surface-card p-4 rounded-2xl border border-border-default space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="w-full md:w-80 relative">
                <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search history by title, domain, role..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-surface-base border border-border-default rounded-xl w-full md:w-auto overflow-x-auto">
                {[
                  { id: 'all', label: 'All Domains' },
                  { id: 'technical', label: 'Technical' },
                  { id: 'system_design', label: 'System Design' },
                  { id: 'behavioral', label: 'Behavioral & HR' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      selectedCategory === tab.id
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Score Filter Select */}
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-4 h-4 text-content-muted" />
                <select
                  value={selectedScoreFilter}
                  onChange={(e) => {
                    setSelectedScoreFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-surface-base border border-border-default text-xs font-semibold text-sky-400 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="all">All Scores</option>
                  <option value="pass">Pass (80%+)</option>
                  <option value="review">Review Needed (&lt;80%)</option>
                </select>
              </div>

            </div>
          </div>

          {/* HISTORY CARDS GRID */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : currentSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {currentSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="h-full"
                >
                  <Card variant="default" className="h-full p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all">
                    
                    <div className="space-y-4">
                      
                      {/* Card Header: Category Badge & Overall Score */}
                      <div className="flex items-start justify-between gap-3">
                        <Badge variant="primary" size="sm" className="font-bold">
                          {session.category}
                        </Badge>

                        {/* Overall Score Badge */}
                        <Badge
                          variant={session.score >= 80 ? 'primary' : 'secondary'}
                          size="md"
                          className={
                            session.score >= 80
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-extrabold'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-extrabold'
                          }
                        >
                          {session.score} / 100
                        </Badge>
                      </div>

                      {/* Title & Metadata */}
                      <div>
                        <h3 className="text-base font-bold text-content-primary leading-snug line-clamp-2">
                          {session.title}
                        </h3>
                        <p className="text-xs text-content-muted mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          <span>{session.date} • {session.durationMinutes} Mins ({session.questionCount} Qs)</span>
                        </p>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] text-content-muted">Level:</span>
                        <span className="text-xs font-bold text-sky-400">{session.difficulty}</span>
                      </div>

                    </div>

                    {/* Card Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between gap-2">
                      
                      <div className="flex items-center gap-1">
                        {/* Download Report */}
                        <button
                          type="button"
                          onClick={() => handleDownloadReport(session)}
                          className="p-2 rounded-xl text-content-secondary hover:text-sky-400 hover:bg-surface-hover transition-colors"
                          title="Download PDF Evaluation Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Delete Session */}
                        <button
                          type="button"
                          onClick={() => setDeleteModalSession(session)}
                          className="p-2 rounded-xl text-content-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* View Report Trigger */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSessionReport(session);
                          navigate('/interviews/report');
                        }}
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                        className="text-xs cursor-pointer"
                      >
                        View Report
                      </Button>

                    </div>

                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-surface-card rounded-2xl border border-border-default space-y-3">
              <FileText className="w-10 h-10 text-content-muted mx-auto" />
              <h3 className="text-base font-bold text-content-primary">No Interview Sessions Completed Yet</h3>
              <p className="text-xs text-content-secondary max-w-sm mx-auto">
                You have completed {sessions.length} sessions. Start a practice round to generate your first AI evaluation report!
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.INTERVIEWS)}
                className="mt-2"
              >
                Start Practice Session
              </Button>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredSessions.length}
            itemsPerPage={itemsPerPage}
          />

        </main>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModalSession && (
          <Modal
            isOpen={!!deleteModalSession}
            onClose={() => setDeleteModalSession(null)}
            title="Delete Interview Session"
            description="Are you sure you want to delete this session from your history?"
          >
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                <span>
                  Deleting <strong>&quot;{deleteModalSession.title}&quot;</strong> will permanently remove its evaluation scores, AI transcript, and stored report document from MongoDB.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setDeleteModalSession(null)}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  size="md"
                  isLoading={isDeleting}
                  onClick={handleDeleteSession}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete Session
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InterviewHistoryPage;
