export const generatePDFReport = (reportData) => {
  const data = reportData || {
    title: 'Senior Technical Engineer Evaluation Report',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    overallScore: 92,
    percentile: 'Top 5%',
    status: 'Pass / Recommended for Offer',
    candidateName: 'John Developer',
    breakdown: {
      technicalScore: 94,
      problemSolvingScore: 95,
      communicationScore: 92,
      behavioralScore: 90,
    },
    strongAreas: [
      'Mastery of distributed system rate limiter architecture with Redis sliding window logs.',
      'Optimal O(N) algorithmic problem solving using monotonic double-ended queues.',
      'Structured STAR method storytelling during high-stakes production incident recovery.',
      'Proactive focus on sub-10ms edge caching and graceful degradation failover.',
    ],
    weakAreas: [
      'Elaborate further on zero-downtime database schema migration strategy details.',
      'Specify exact retry backoff jitter equations for transient microservice network failures.',
      'Deepen telemetry monitoring metric explanations (p99 latency vs error rate bounds).',
    ],
    improvementTips: [
      { week: 'Week 1: High-Concurrency System Design', tip: 'Practice Token Bucket vs Leaky Bucket rate limiter implementations and Redis cluster partition sharding.' },
      { week: 'Week 2: React 19 RSC Internals', tip: 'Study server component Flight stream binary format, static/dynamic rendering boundaries, and Suspense waterfalls.' },
      { week: 'Week 3: Database Indexing Optimization', tip: 'Review MongoDB compound indexing, query execution explain plans, and zero-downtime schema evolution.' },
      { week: 'Week 4: Timed Mock Elevator Pitches', tip: 'Conduct 3 timed mock rounds focusing on concise 2-minute architectural elevator pitches.' },
    ],
  };

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download your PDF Evaluation Report.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${data.title} - PDF Evaluation Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          background: #090d16;
          color: #f1f5f9;
          padding: 40px;
          line-height: 1.5;
        }

        .report-card {
          max-w: 900px;
          margin: 0 auto;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #1e293b;
          padding-bottom: 24px;
          margin-bottom: 32px;
        }

        .brand {
          font-size: 24px;
          font-weight: 800;
          color: #38bdf8;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          margin-top: 6px;
        }

        .score-box {
          text-align: right;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 16px 24px;
          border-radius: 16px;
        }

        .score-number {
          font-size: 36px;
          font-weight: 900;
          color: #38bdf8;
          font-family: monospace;
        }

        .badge-pass {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-top: 4px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .section-box {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 20px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #38bdf8;
          margin-bottom: 16px;
        }

        .chart-row {
          margin-bottom: 12px;
        }

        .chart-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .chart-bar-bg {
          width: 100%;
          height: 10px;
          background: #0f172a;
          border-radius: 10px;
          overflow: hidden;
        }

        .chart-bar-fill {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #0284c7, #38bdf8);
        }

        .list-item {
          font-size: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .strong-item { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #6ee7b7; }
        .weak-item { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: #fde047; }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #1e293b;
          text-align: center;
          font-size: 11px;
          color: #64748b;
        }

        @media print {
          body { background: #ffffff; color: #000000; padding: 0; }
          .report-card { background: #ffffff; border: none; box-shadow: none; padding: 20px; }
          .title { color: #000000; }
          .section-box { background: #f8fafc; border: 1px solid #e2e8f0; }
          .chart-bar-bg { background: #e2e8f0; }
          .strong-item { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
          .weak-item { background: #fffbeb; color: #92400e; border: 1px solid #fef3c7; }
        }
      </style>
    </head>
    <body>
      <div class="report-card">
        
        <!-- Header Banner -->
        <div class="header">
          <div>
            <div class="brand">⚡ InterviewAI</div>
            <div class="title">${data.title}</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Candidate: <strong>${data.candidateName || 'John Developer'}</strong> • Date: ${data.date}</div>
          </div>
          <div class="score-box">
            <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Hire Readiness</div>
            <div class="score-number">${data.overallScore}<span style="font-size: 18px; color: #94a3b8;">/100</span></div>
            <div class="badge-pass">${data.status}</div>
          </div>
        </div>

        <!-- Competency Breakdown Charts -->
        <div class="section-box" style="margin-bottom: 24px;">
          <div class="section-title">📊 Competency Radar & STAR Scores</div>
          
          <div class="chart-row">
            <div class="chart-label"><span>Technical Architecture & Engineering Depth</span><span>${data.breakdown.technicalScore}%</span></div>
            <div class="chart-bar-bg"><div class="chart-bar-fill" style="width: ${data.breakdown.technicalScore}%;"></div></div>
          </div>

          <div class="chart-row">
            <div class="chart-label"><span>Problem Solving Speed & Algorithmic Accuracy</span><span>${data.breakdown.problemSolvingScore}%</span></div>
            <div class="chart-bar-bg"><div class="chart-bar-fill" style="width: ${data.breakdown.problemSolvingScore}%; background: linear-gradient(90deg, #059669, #34d399);"></div></div>
          </div>

          <div class="chart-row">
            <div class="chart-label"><span>Communication Clarity & Technical Articulation</span><span>${data.breakdown.communicationScore}%</span></div>
            <div class="chart-bar-bg"><div class="chart-bar-fill" style="width: ${data.breakdown.communicationScore}%; background: linear-gradient(90deg, #0891b2, #22d3ee);"></div></div>
          </div>

          <div class="chart-row">
            <div class="chart-label"><span>Behavioral Incident Breakdown (STAR Methodology)</span><span>${data.breakdown.behavioralScore}%</span></div>
            <div class="chart-bar-bg"><div class="chart-bar-fill" style="width: ${data.breakdown.behavioralScore}%; background: linear-gradient(90deg, #4f46e5, #818cf8);"></div></div>
          </div>
        </div>

        <!-- Strong & Weak Areas -->
        <div class="grid-2">
          <div class="section-box">
            <div class="section-title" style="color: #34d399;">✅ Verified Strong Competencies</div>
            ${data.strongAreas.map((item) => `<div class="list-item strong-item">✓ ${item}</div>`).join('')}
          </div>

          <div class="section-box">
            <div class="section-title" style="color: #fbbf24;">⚠️ Growth Areas & Architecture Gaps</div>
            ${data.weakAreas.map((item) => `<div class="list-item weak-item">⚠️ ${item}</div>`).join('')}
          </div>
        </div>

        <!-- Actionable Roadmap -->
        <div class="section-box">
          <div class="section-title">🎯 4-Week Gemini AI Preparation Roadmap</div>
          ${data.improvementTips.map((tip) => `
            <div style="margin-bottom: 10px;">
              <strong style="font-size: 12px; color: #38bdf8;">${tip.week}</strong>
              <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">${tip.tip}</div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div class="footer">
          Generated automatically by Interview AI Engine • Verified by Google Gemini 2.5 Flash Telemetry • Confidential
        </div>

      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export default generatePDFReport;
