import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const MonthlyBarChart = () => {
  const data = [
    { month: 'Jan', sessions: 8, avgScore: 78 },
    { month: 'Feb', sessions: 12, avgScore: 82 },
    { month: 'Mar', sessions: 15, avgScore: 85 },
    { month: 'Apr', sessions: 18, avgScore: 88 },
    { month: 'May', sessions: 22, avgScore: 90 },
    { month: 'Jun', sessions: 25, avgScore: 92 },
    { month: 'Jul', sessions: 28, avgScore: 94 },
    { month: 'Aug', sessions: 32, avgScore: 96 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-surface-card border border-border-default rounded-xl shadow-xl backdrop-blur-md space-y-1 text-xs">
          <p className="font-bold text-content-primary">{label} Summary</p>
          <p className="text-sky-400 font-semibold">Sessions Completed: {payload[0].value}</p>
          <p className="text-emerald-400 font-semibold">Avg Candidate Score: {payload[1].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

          <Bar dataKey="sessions" name="Sessions Completed" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          <Bar dataKey="avgScore" name="Avg Score (%)" fill="#34d399" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
