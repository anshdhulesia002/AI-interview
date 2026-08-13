export const getRealUserActivity = () => {
  let completedInterviews = [];
  let latestReport = null;

  try {
    const storedInterviews = localStorage.getItem('user_completed_interviews');
    if (storedInterviews) {
      completedInterviews = JSON.parse(storedInterviews);
    }
  } catch {
    completedInterviews = [];
  }

  try {
    const storedReport = localStorage.getItem('user_latest_report');
    if (storedReport) {
      latestReport = JSON.parse(storedReport);
    }
  } catch {
    latestReport = null;
  }

  const totalSessions = completedInterviews.length;
  let totalScoreSum = 0;

  completedInterviews.forEach((session) => {
    const s = typeof session.score === 'number' ? session.score : 0;
    totalScoreSum += s;
  });

  if (latestReport && typeof latestReport.overallScore === 'number' && totalSessions === 0) {
    totalScoreSum = latestReport.overallScore;
  }

  const averageScore = totalSessions > 0 ? (totalScoreSum / totalSessions).toFixed(1) : (latestReport ? latestReport.overallScore.toFixed(1) : '0.0');

  const technicalScore = latestReport?.breakdown?.technicalScore ?? (totalSessions > 0 ? Math.round(Number(averageScore)) : 0);
  const behavioralScore = latestReport?.breakdown?.behavioralScore ?? (totalSessions > 0 ? Math.round(Number(averageScore)) : 0);
  const communicationScore = latestReport?.breakdown?.communicationScore ?? (totalSessions > 0 ? Math.round(Number(averageScore)) : 0);
  const codingScore = latestReport?.breakdown?.problemSolvingScore ?? (totalSessions > 0 ? Math.round(Number(averageScore)) : 0);

  return {
    totalSessions,
    averageScore: Number(averageScore),
    technicalScore,
    behavioralScore,
    communicationScore,
    codingScore,
    completedInterviews,
    latestReport,
  };
};

export const setSelectedSessionReport = (sessionItem) => {
  if (!sessionItem) return;

  const score = typeof sessionItem.score === 'number' ? sessionItem.score : 0;
  const isNoAnswer = score === 0;

  const selectedReport = {
    title: `${sessionItem.title || sessionItem.category || 'Technical Session'} Evaluation Report`,
    date: sessionItem.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    overallScore: score,
    percentile: isNoAnswer ? 'Bottom 5%' : (score >= 80 ? 'Top 10%' : 'Bottom 25%'),
    status: sessionItem.status || (isNoAnswer ? 'Needs Improvement / No Answers Submitted' : (score >= 80 ? 'Pass / Recommended for Offer' : 'Needs Practice / Incomplete Answers')),
    breakdown: {
      technicalScore: isNoAnswer ? 0 : Math.min(98, score + 2),
      behavioralScore: isNoAnswer ? 0 : Math.max(50, score - 3),
      communicationScore: isNoAnswer ? 0 : Math.min(96, score + 1),
      problemSolvingScore: isNoAnswer ? 0 : Math.min(98, score + 3),
    },
    strongAreas: isNoAnswer
      ? ['Mock interview session started, but no candidate answers were submitted for evaluation.']
      : ['Attempted candidate technical responses across interview questions.', 'Demonstrated engagement with domain topics.'],
    weakAreas: isNoAnswer
      ? [
          'No responses were recorded for any of the 4 interview questions.',
          'Microphone input or text input was missing.',
          'Zero technical depth, problem-solving speed, or STAR method communication demonstrated.',
        ]
      : ['Elaborate further on system design trade-offs and edge-case error handling.'],
    improvementTips: isNoAnswer
      ? [
          { week: 'Step 1: Test Microphone & Web Speech API', tip: 'Click the Microphone ON button and verify browser mic permissions.' },
          { week: 'Step 2: Answer Technical Questions', tip: 'Speak or type for at least 60-90 seconds per question.' },
          { week: 'Step 3: Retake Practice Session', tip: 'Relaunch the interview room and submit your answers.' },
        ]
      : [
          { week: 'Week 1: High-Concurrency System Design', tip: 'Study distributed rate limiters and Redis caching.' },
        ],
  };

  try {
    localStorage.setItem('user_latest_report', JSON.stringify(selectedReport));
  } catch {
    // LocalStorage exception handled
  }
};
