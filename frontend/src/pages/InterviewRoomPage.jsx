import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportService } from '../services/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  CheckCircle2,
  Play,
  Pause,
  Maximize,
  Minimize,
  X,
  FileText,
  Bot,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ROUTES } from '../utils/constants';

// Helper for Domain-Specific Questions
const getDomainQuestions = (domain = 'Node.js & Backend Architecture') => {
  const dom = (domain || 'Node.js').toLowerCase();

  if (dom.includes('node') || dom.includes('backend') || dom.includes('express')) {
    return [
      {
        id: 1,
        title: 'Node.js Event Loop & Non-Blocking I/O Architecture',
        category: 'Node.js & Backend',
        difficulty: 'Senior',
        questionText: 'Explain how the Node.js Event Loop operates across libuv phases (Timers, Pending Callbacks, Poll, Check, Close). How do microtasks (process.nextTick vs Promise.then) interact with the event loop during heavy I/O?',
        hint: 'Detail the libuv thread pool size, phase transitions, and starvation risks with process.nextTick.',
        expectedAnswer: 'Comprehensive breakdown of libuv phases, microtask queue priority, thread pool delegation, and asynchronous non-blocking event-driven execution.',
      },
      {
        id: 2,
        title: 'Express Microservices & Distributed Rate Limiting',
        category: 'Node.js & Backend',
        difficulty: 'Senior',
        questionText: 'Design a scalable Node.js/Express API Gateway architecture handling 50,000 requests/sec. How do you implement distributed rate limiting with Redis sliding window counters?',
        hint: 'Use Redis cluster with Lua scripts to atomically check and update sliding window request counts.',
        expectedAnswer: 'Redis Lua script implementation, sliding window log algorithm, token bucket fallback, and cluster failover.',
      },
      {
        id: 3,
        title: 'MongoDB Connection Pooling & Indexing Optimization',
        category: 'Node.js & Backend',
        difficulty: 'Mid',
        questionText: 'How do you optimize Mongoose/MongoDB connection pooling and aggregation pipelines for high-concurrency Node.js web applications?',
        hint: 'Explain compound indexing, ESR (Equal, Sort, Range) rule, maxPoolSize configuration, and lean() queries.',
        expectedAnswer: 'Mongoose connection pooling parameters, compound indexing strategy, aggregation pipeline performance, and memory optimization.',
      },
      {
        id: 4,
        title: 'STAR Method: Production Memory Leak Resolution',
        category: 'Node.js & Backend',
        difficulty: 'Senior',
        questionText: 'Describe a scenario where a Node.js production service suffered from heap memory leak under load. How did you take heap snapshots and resolve the memory leak?',
        hint: 'Structure using Situation, Task, Action, Result (STAR). Mention chrome://inspect, heap snapshots, and unhandled event listeners.',
        expectedAnswer: 'STAR response detailing heap snapshot inspection, identifying global array closures / unremoved event listeners, and deploying memory leak fixes.',
      },
    ];
  }

  if (dom.includes('react') || dom.includes('frontend')) {
    return [
      {
        id: 1,
        title: 'React 19 Server Components (RSC) & Flight Protocol',
        category: 'React & Frontend',
        difficulty: 'Senior',
        questionText: 'Explain the internal reconciliation architecture of React 19 Server Components (RSC) vs Client Components. How does React handle async data fetching without triggering re-render cascades?',
        hint: 'Focus on Flight stream payloads, Suspense boundaries, and static vs dynamic rendering boundaries.',
        expectedAnswer: 'Explanation of server-side Flight JSON streaming, zero-bundle-size server components, and Suspense boundary streaming.',
      },
      {
        id: 2,
        title: 'State Management & Web Vitals Optimization',
        category: 'React & Frontend',
        difficulty: 'Senior',
        questionText: 'How do you optimize Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) in complex React applications?',
        hint: 'Mention code splitting, resource hints (modulepreload), content-visibility, and avoiding main-thread blocking.',
        expectedAnswer: 'Detailed CWV optimization techniques covering LCP image priority, INP main-thread yield, and state atomicity.',
      },
    ];
  }

  return [
    {
      id: 1,
      title: `${domain} Core Concepts & Performance`,
      category: domain,
      difficulty: 'Senior',
      questionText: `Explain key performance considerations and architectural tradeoffs when designing scalable ${domain} systems for high-traffic environments.`,
      hint: 'Think about indexing strategies, caching mechanisms, and asynchronous event queues.',
      expectedAnswer: 'Comprehensive breakdown of time/space complexity, distributed caching (Redis), database indexing, and asynchronous processing.',
    },
    {
      id: 2,
      title: `${domain} Architecture Optimization`,
      category: domain,
      difficulty: 'Senior',
      questionText: `Design a high-availability ${domain} architecture capable of processing high-concurrency requests with sub-10ms latency.`,
      hint: 'Consider sliding window counter algorithm with Redis cluster and local token bucket fallback.',
      expectedAnswer: 'Detailed system architecture diagram explanation covering Redis cluster, token bucket algorithm, and failover redundancy.',
    },
  ];
};

export const InterviewRoomPage = () => {
  const navigate = useNavigate();

  // Load Active Session from localStorage
  const activeSession = (() => {
    try {
      return JSON.parse(localStorage.getItem('active_interview_session') || '{}');
    } catch {
      return {};
    }
  })();

  const sessionTitle = activeSession.title || 'Node.js & Backend Architecture Practice Round';
  const sessionDomain = activeSession.domain || activeSession.category || 'Node.js & Backend Architecture';

  // Questions State loaded from selected domain
  const [questions] = useState(() => {
    if (Array.isArray(activeSession.questions) && activeSession.questions.length > 0) {
      return activeSession.questions;
    }
    return getDomainQuestions(sessionDomain);
  });

  // Active State Management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2700);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Per-Question Saved Answers Dictionary State { [questionId]: string }
  const [savedAnswers, setSavedAnswers] = useState({});
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const recognitionRef = useRef(null);
  const isMicOnRef = useRef(isMicOn);
  isMicOnRef.current = isMicOn;

  const currentQ = questions[currentQuestionIndex] || getDomainQuestions(sessionDomain)[0];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  // Question Navigation Handler: Auto-Saves current answer & resets response box for target question
  const handleNavigateQuestion = (targetIndex) => {
    const updatedMap = {
      ...savedAnswers,
      [currentQ.id]: candidateAnswer,
    };
    setSavedAnswers(updatedMap);

    setTranscript('');
    setShowHint(false);

    const targetQ = questions[targetIndex];
    const targetAnswer = updatedMap[targetQ.id] || '';
    setCandidateAnswer(targetAnswer);

    setCurrentQuestionIndex(targetIndex);
  };

  // Application Keyboard Shortcuts Listener (Alt+Right: Next, Alt+Left: Prev, Ctrl+Enter: Submit)
  useEffect(() => {
    const handleRoomKeyDown = (e) => {
      // Next Question: Alt + ArrowRight OR Alt + N
      if ((e.altKey && e.key === 'ArrowRight') || (e.altKey && (e.key === 'n' || e.key === 'N'))) {
        e.preventDefault();
        if (currentQuestionIndex < questions.length - 1) {
          handleNavigateQuestion(currentQuestionIndex + 1);
        }
      }
      // Previous Question: Alt + ArrowLeft OR Alt + P
      else if ((e.altKey && e.key === 'ArrowLeft') || (e.altKey && (e.key === 'p' || e.key === 'P'))) {
        e.preventDefault();
        if (currentQuestionIndex > 0) {
          handleNavigateQuestion(currentQuestionIndex - 1);
        }
      }
      // Submit / Complete Session: Ctrl + Enter OR ⌘ + Enter
      else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-question-btn');
        if (submitBtn) submitBtn.click();
      }
    };

    window.addEventListener('keydown', handleRoomKeyDown);
    return () => window.removeEventListener('keydown', handleRoomKeyDown);
  }, [currentQuestionIndex, questions, candidateAnswer, savedAnswers]);

  // Initialize Persistent Web Speech API Instance ONCE on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      setSpeechError(null);
      let fullTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }

      const cleanText = fullTranscript.trim();
      if (cleanText) {
        setTranscript(cleanText);
        setCandidateAnswer(cleanText);
        setSavedAnswers((prev) => ({
          ...prev,
          [currentQ.id]: cleanText,
        }));
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isMicOnRef.current && recognitionRef.current) {
        // eslint-disable-next-line no-empty
        try { recognitionRef.current.start(); } catch {}
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        setIsListening(false);
        setSpeechError(`Browser Speech Notice (${event.error}). Please allow microphone access in address bar.`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        // eslint-disable-next-line no-empty
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [currentQ.id]);

  // Handle Microphone Permission and Toggle
  const handleMicToggle = async () => {
    if (!speechSupported) {
      alert('Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isMicOn) {
      setIsMicOn(false);
      setIsListening(false);
      if (recognitionRef.current) {
        // eslint-disable-next-line no-empty
        try { recognitionRef.current.stop(); } catch {}
      }
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch {
      setSpeechError('Microphone access denied by browser. Please click the Lock icon in browser address bar (https://) to allow microphone permissions.');
      return;
    }

    setIsMicOn(true);
    setSpeechError(null);

    if (recognitionRef.current) {
      // eslint-disable-next-line no-empty
      try { recognitionRef.current.start(); } catch {}
    }
  };

  // Timer Countdown Effect
  useEffect(() => {
    let timerInterval;
    if (!isTimerPaused && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerPaused, timeLeft]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-surface-base text-content-primary flex flex-col select-none overflow-hidden">
      
      {/* TOP CONTROL BAR (Timer, Progress, Controls) */}
      <header className="h-16 px-4 sm:px-6 bg-surface-card border-b border-border-default flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
        
        {/* Brand & Progress Step */}
        <div className="flex items-center gap-4">
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 border border-sky-500/30 rounded-xl">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <span className="font-extrabold text-base tracking-tight hidden sm:inline">
              Interview<span className="text-sky-500">AI</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-border-subtle hidden sm:block" />

          {/* Progress Step Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="md">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <span className="text-xs font-bold text-sky-400 hidden md:inline">{progressPercent}% Completed</span>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="hidden lg:block flex-1 max-w-xs mx-4">
          <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-400"
            />
          </div>
        </div>

        {/* Right Controls: Timer, Fullscreen, Exit */}
        <div className="flex items-center gap-3">
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-base border border-border-default text-xs font-mono font-bold">
            <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className={timeLeft < 300 ? 'text-red-400' : 'text-content-primary'}>
              {formatTime(timeLeft)}
            </span>
            <button
              type="button"
              onClick={() => setIsTimerPaused((prev) => !prev)}
              className="ml-1 text-content-muted hover:text-content-primary"
              title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              {isTimerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-content-secondary hover:text-content-primary bg-surface-base border border-border-default hover:bg-surface-hover transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Exit Interview Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              setIsSubmittingReport(true);
              const finalAnswers = {
                ...savedAnswers,
                [currentQ.id]: candidateAnswer,
              };
              setSavedAnswers(finalAnswers);

              const endedSession = {
                id: activeSession.id || Date.now().toString(),
                title: sessionTitle,
                category: sessionDomain,
                difficulty: activeSession.difficulty || 'Senior',
                score: 88,
                status: 'Pass',
                durationMinutes: Math.max(1, Math.round((2700 - timeLeft) / 60)),
                questionCount: questions.length || 4,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              };

              try {
                const stored = JSON.parse(localStorage.getItem('user_completed_interviews') || '[]');
                // Filter out old dummy system design cards
                const cleanStored = stored.filter((s) => s.title !== 'Distributed System Rate Limiter Architecture');
                localStorage.setItem('user_completed_interviews', JSON.stringify([endedSession, ...cleanStored]));
              } catch {
                // Handled
              }

              try {
                await reportService.generateReport({
                  interviewId: activeSession.id || null,
                  candidateAnswers: finalAnswers,
                });
              } catch {
                // Handled
              } finally {
                setIsSubmittingReport(false);
                navigate('/history');
              }
            }}
            className="text-red-400 hover:bg-red-500/10 gap-1.5"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">End Session</span>
          </Button>

        </div>

      </header>

      {/* MAIN SIMULATION ROOM CONTAINER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl w-full mx-auto overflow-y-auto">
        
        {/* LEFT COLUMN (7 Cols): AI Avatar, Question Panel, Voice Controls */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* SPEECH ERROR WARNING BANNER */}
            <AnimatePresence>
              {speechError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-300 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{speechError}</span>
                  </div>
                  <button type="button" onClick={() => setSpeechError(null)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI VOICE AVATAR & SPEECH WAVEFORM */}
            <Card variant="glass" className="p-6 relative overflow-hidden flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {/* Pulsing Avatar Halo */}
                <div className={`absolute inset-0 rounded-full blur-xl ${isListening ? 'bg-sky-500/30 animate-pulse' : 'bg-sky-500/10'}`} />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 p-1 shadow-2xl relative z-10 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-surface-card flex items-center justify-center">
                    <Bot className="w-10 h-10 text-sky-400" />
                  </div>
                </div>
                <span className={`w-4 h-4 rounded-full border-2 border-surface-card absolute bottom-0 right-0 z-20 ${isListening ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>

              <div>
                <h3 className="text-base font-bold text-content-primary flex items-center justify-center gap-1.5">
                  <span>AI Senior Technical Interviewer</span>
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </h3>
                <p className="text-xs text-sky-400 font-semibold mt-0.5">
                  {isListening ? '🎙️ Web Speech Engine Active — Speak into your mic now!' : 'Microphone Paused (Click below to speak)'}
                </p>
              </div>

              {/* Audio Waveform Animation */}
              <div className="flex items-center gap-1.5 h-6">
                {[30, 70, 45, 90, 60, 100, 40, 80, 50].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: isListening ? ['20%', `${h}%`, '20%'] : '20%' }}
                    transition={{ repeat: Infinity, duration: 0.8 + i * 0.1, ease: 'easeInOut' }}
                    className={`w-1 rounded-full ${isListening ? 'bg-sky-400' : 'bg-content-muted'}`}
                  />
                ))}
              </div>

              {/* Microphone Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  variant={isMicOn ? 'primary' : 'danger'}
                  size="md"
                  onClick={handleMicToggle}
                  leftIcon={isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  className="rounded-full px-8 shadow-lg shadow-sky-500/25"
                >
                  {isMicOn ? 'Microphone ON (Listening...)' : 'Turn ON Microphone'}
                </Button>
              </div>

              {/* Browser Address Bar Tip */}
              <div className="text-[11px] text-content-muted flex items-center justify-center gap-1 pt-1">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Tip: Allow mic permission in browser address bar (click 🔒 icon next to localhost:5173).</span>
              </div>
            </Card>

            {/* QUESTION PANEL */}
            <Card variant="default" className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{currentQ.category || sessionDomain}</Badge>
                  <Badge variant="secondary" size="sm">Difficulty: {currentQ.difficulty || 'Senior'}</Badge>
                </div>
                <span className="text-xs font-mono font-bold text-content-muted">Q0{currentQuestionIndex + 1}</span>
              </div>

              <h2 className="text-xl font-bold text-content-primary leading-snug">
                {currentQ.questionText}
              </h2>

              {/* Expandable Hint Drawer */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Hide AI Hint' : 'Show AI Hint'}</span>
                  {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 leading-relaxed"
                    >
                      💡 <strong>Gemini AI Hint</strong>: {currentQ.hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </div>

          {/* QUESTION NAVIGATION ACTION FOOTER */}
          <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
            <Button
              variant="secondary"
              size="md"
              disabled={currentQuestionIndex === 0}
              onClick={() => handleNavigateQuestion(Math.max(0, currentQuestionIndex - 1))}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous Question
            </Button>

            <Button
              id="submit-question-btn"
              variant="primary"
              size="md"
              isLoading={isSubmittingReport}
              onClick={async () => {
                if (currentQuestionIndex < questions.length - 1) {
                  handleNavigateQuestion(currentQuestionIndex + 1);
                } else {
                  setIsSubmittingReport(true);
                  const finalAnswers = {
                    ...savedAnswers,
                    [currentQ.id]: candidateAnswer,
                  };
                  setSavedAnswers(finalAnswers);

                  // Calculate true candidate word count & score
                  let totalWords = 0;
                  Object.values(finalAnswers).forEach((ans) => {
                    const text = (ans || '').toString().trim();
                    if (text) {
                      totalWords += text.split(/\s+/).filter(Boolean).length;
                    }
                  });

                  let computedScore = 0;
                  let computedStatus = 'Needs Improvement';
                  let computedGradeText = 'Needs Improvement / No Answers Submitted';
                  let computedPercentile = 'Bottom 5%';

                  if (totalWords === 0) {
                    computedScore = 0;
                    computedStatus = 'Needs Improvement';
                    computedGradeText = 'Needs Improvement / No Answers Submitted';
                    computedPercentile = 'Bottom 5%';
                  } else if (totalWords < 30) {
                    computedScore = Math.min(45, Math.max(15, Math.round(totalWords * 1.2)));
                    computedStatus = 'Incomplete';
                    computedGradeText = 'Needs Improvement / Incomplete Answers';
                    computedPercentile = 'Bottom 25%';
                  } else {
                    computedScore = Math.min(96, Math.max(65, Math.round(55 + totalWords * 0.2)));
                    computedStatus = computedScore >= 80 ? 'Pass' : 'Conditional Pass';
                    computedGradeText = computedScore >= 80 ? 'Pass / Recommended for Offer' : 'Conditional Pass / Needs Refinement';
                    computedPercentile = computedScore >= 85 ? 'Top 10%' : 'Top 30%';
                  }

                  const evaluatedReport = {
                    title: `${sessionDomain} Evaluation Report`,
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    overallScore: computedScore,
                    percentile: computedPercentile,
                    status: computedGradeText,
                    breakdown: {
                      technicalScore: computedScore === 0 ? 0 : Math.min(98, computedScore + 2),
                      behavioralScore: computedScore === 0 ? 0 : Math.max(50, computedScore - 3),
                      communicationScore: computedScore === 0 ? 0 : Math.min(96, computedScore + 1),
                      problemSolvingScore: computedScore === 0 ? 0 : Math.min(98, computedScore + 3),
                    },
                    strongAreas: computedScore === 0
                      ? ['Session attempted, but no candidate answers were submitted for evaluation.']
                      : ['Attempted candidate technical responses across interview questions.', 'Demonstrated engagement with domain topics.'],
                    weakAreas: computedScore === 0
                      ? ['No answers were recorded for any of the 4 interview questions.', 'Microphone or text input was missing.', 'Zero technical depth or problem-solving speed demonstrated.']
                      : ['Elaborate further on system design trade-offs and edge-case error handling.'],
                    improvementTips: computedScore === 0
                      ? [
                          { week: 'Step 1: Test Microphone & Speech API', tip: 'Unmute your mic or click Microphone ON before speaking.' },
                          { week: 'Step 2: Answer Technical Questions', tip: 'Speak or type for at least 60-90 seconds per question.' },
                        ]
                      : [
                          { week: 'Week 1: High-Concurrency System Design', tip: 'Study distributed rate limiters and Redis caching.' },
                        ],
                  };

                  try {
                    localStorage.setItem('user_latest_report', JSON.stringify(evaluatedReport));
                  } catch {
                    // Handled
                  }

                  const localSession = {
                    id: activeSession.id || Date.now().toString(),
                    title: sessionTitle,
                    category: sessionDomain,
                    difficulty: activeSession.difficulty || 'Senior',
                    score: computedScore,
                    status: computedStatus,
                    durationMinutes: Math.max(1, Math.round((2700 - timeLeft) / 60)),
                    questionCount: questions.length || 4,
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                  };

                  try {
                    const stored = JSON.parse(localStorage.getItem('user_completed_interviews') || '[]');
                    const cleanStored = stored.filter((s) => s.title !== 'Distributed System Rate Limiter Architecture');
                    localStorage.setItem('user_completed_interviews', JSON.stringify([localSession, ...cleanStored]));
                  } catch {
                    // LocalStorage exception handled
                  }

                  try {
                    const apiRes = await reportService.generateReport({
                      interviewId: activeSession.id || null,
                      candidateAnswers: finalAnswers,
                    });
                    if (apiRes?.data?.report) {
                      const rep = apiRes.data.report;
                      const updatedReport = {
                        ...evaluatedReport,
                        overallScore: typeof rep.overallScore === 'number' ? rep.overallScore : evaluatedReport.overallScore,
                        breakdown: rep.breakdown || evaluatedReport.breakdown,
                        strongAreas: rep.keyStrengths?.length > 0 ? rep.keyStrengths : evaluatedReport.strongAreas,
                        weakAreas: rep.areasForImprovement?.length > 0 ? rep.areasForImprovement : evaluatedReport.weakAreas,
                      };
                      localStorage.setItem('user_latest_report', JSON.stringify(updatedReport));
                    }
                  } catch {
                    // Handled
                  } finally {
                    setIsSubmittingReport(false);
                    navigate('/interviews/report');
                  }
                }
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-lg shadow-sky-500/25"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Session'}
            </Button>
          </div>

          {/* ROOM KEYBOARD SHORTCUTS HINT LEGEND */}
          <div className="p-3 bg-surface-card border border-border-subtle rounded-2xl text-[11px] text-content-muted flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-sky-400">⚡ Keyboard Shortcuts:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">→</kbd> Next Q
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">←</kbd> Prev Q
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">Enter</kbd> Submit
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-surface-base border border-border-default font-mono text-[10px] font-bold">K</kbd> Search
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): Auto-Fill Candidate Answer & Speech Transcript */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* AUTO-FILL CANDIDATE ANSWER TEXTAREA */}
          <Card variant="default" className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-content-primary flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Candidate Answer Response Box</span>
                </h3>
                <span className="text-[10px] font-semibold text-sky-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Speech Auto-Filling
                </span>
              </div>

              <textarea
                rows="12"
                placeholder={`Type or speak your answer for Question #${currentQuestionIndex + 1}... (Your answer will be automatically saved when you click Next Question!)`}
                value={candidateAnswer}
                onChange={(e) => {
                  const newText = e.target.value;
                  setCandidateAnswer(newText);
                  setSavedAnswers((prev) => ({
                    ...prev,
                    [currentQ.id]: newText,
                  }));
                }}
                className="w-full flex-1 p-3.5 text-xs bg-surface-base border border-border-default rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none transition-colors leading-relaxed font-mono"
              />
            </div>
          </Card>

          {/* REAL-TIME SPEECH TRANSCRIPT BOX */}
          <Card variant="default" className="p-4 space-y-2 bg-surface-card border-sky-500/30">
            <div className="flex items-center justify-between text-xs font-bold text-sky-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse text-emerald-400' : 'text-content-muted'}`} />
                <span>Live Speech Transcript Stream</span>
              </span>
              {transcript && (
                <button
                  type="button"
                  onClick={() => {
                    setTranscript('');
                    setCandidateAnswer('');
                    setSavedAnswers((prev) => ({
                      ...prev,
                      [currentQ.id]: '',
                    }));
                  }}
                  className="text-[10px] text-content-muted hover:text-red-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear Text
                </button>
              )}
            </div>
            <div className="text-xs text-content-secondary leading-relaxed italic bg-surface-base/80 p-3 rounded-xl border border-border-subtle max-h-24 overflow-y-auto font-mono">
              {transcript || (isListening ? 'Listening for your voice... Start speaking into your microphone.' : 'Microphone is turned off. Click "Turn ON Microphone" to speak.')}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default InterviewRoomPage;
