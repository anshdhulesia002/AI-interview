import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { getRealUserActivity } from '../../utils/userActivityHelper';

export const SkillRadarChart = () => {
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const activity = getRealUserActivity();
    const { technicalScore, behavioralScore, communicationScore, codingScore } = activity;

    setRadarData([
      { subject: 'System Design', score: technicalScore, fullMark: 100 },
      { subject: 'React / Frontend', score: technicalScore, fullMark: 100 },
      { subject: 'Algorithms & Data', score: codingScore, fullMark: 100 },
      { subject: 'Behavioral & STAR', score: behavioralScore, fullMark: 100 },
      { subject: 'Communication', score: communicationScore, fullMark: 100 },
      { subject: 'DevOps & Cloud', score: technicalScore, fullMark: 100 },
    ]);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 bg-surface-card border border-border-default rounded-xl shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-content-primary">{payload[0].payload.subject}</p>
          <p className="text-sky-400 font-semibold">Mastery: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tickLine={false} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
          <Radar
            name="Skill Mastery"
            dataKey="score"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
