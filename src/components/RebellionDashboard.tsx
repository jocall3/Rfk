import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MetricData {
  date: string;
  glucose: number;
  ketones: number;
  energyLevel: number;
}

const INITIAL_DATA: MetricData[] = [
  { date: '2023-10-01', glucose: 95, ketones: 0.5, energyLevel: 7 },
  { date: '2023-10-02', glucose: 92, ketones: 0.8, energyLevel: 8 },
  { date: '2023-10-03', glucose: 88, ketones: 1.2, energyLevel: 8 },
  { date: '2023-10-04', glucose: 85, ketones: 1.5, energyLevel: 9 },
  { date: '2023-10-05', glucose: 89, ketones: 1.1, energyLevel: 7 },
];

export const RebellionDashboard: React.FC = () => {
  const [data] = useState<MetricData[]>(INITIAL_DATA);

  const averages = useMemo(() => {
    const sum = data.reduce((acc, curr) => ({
      glucose: acc.glucose + curr.glucose,
      ketones: acc.ketones + curr.ketones,
    }), { glucose: 0, ketones: 0 });
    
    return {
      glucose: (sum.glucose / data.length).toFixed(1),
      ketones: (sum.ketones / data.length).toFixed(2),
    };
  }, [data]);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">Metabolic Rebellion Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Avg Glucose</p>
          <p className="text-3xl font-mono">{averages.glucose} <span className="text-sm text-slate-500">mg/dL</span></p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Avg Ketones</p>
          <p className="text-3xl font-mono">{averages.ketones} <span className="text-sm text-slate-500">mmol/L</span></p>
        </div>
      </div>

      <div className="h-64 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Line type="monotone" dataKey="glucose" stroke="#34d399" strokeWidth={2} />
            <Line type="monotone" dataKey="ketones" stroke="#fbbf24" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Bar dataKey="energyLevel" fill="#818cf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};