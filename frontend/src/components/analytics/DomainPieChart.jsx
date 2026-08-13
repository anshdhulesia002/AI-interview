import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { getRealUserActivity } from '../../utils/userActivityHelper';

export const DomainPieChart = () => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const activity = getRealUserActivity();
    const sessions = activity.completedInterviews;

    if (sessions.length === 0) {
      setPieData([
        { name: 'No Practice Sessions', value: 100, color: '#475569' },
      ]);
    } else {
      const counts = { Frontend: 0, Backend: 0, 'System Design': 0, Behavioral: 0 };
      sessions.forEach((s) => {
        const cat = (s.category || '').toLowerCase();
        if (cat.includes('frontend') || cat.includes('react')) counts.Frontend++;
        else if (cat.includes('system')) counts['System Design']++;
        else if (cat.includes('behavioral')) counts.Behavioral++;
        else counts.Backend++;
      });

      const total = sessions.length;
      setPieData([
        { name: 'Frontend', value: Math.round((counts.Frontend / total) * 100) || 25, color: '#38bdf8' },
        { name: 'Backend', value: Math.round((counts.Backend / total) * 100) || 25, color: '#34d399' },
        { name: 'System Design', value: Math.round((counts['System Design'] / total) * 100) || 25, color: '#22d3ee' },
        { name: 'Behavioral', value: Math.round((counts.Behavioral / total) * 100) || 25, color: '#a78bfa' },
      ]);
    }
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 bg-surface-card border border-border-default rounded-xl shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-content-primary">{payload[0].name} Domain</p>
          <p className="font-semibold" style={{ color: payload[0].payload.color }}>
            Share: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
