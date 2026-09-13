'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const TYPE_LABELS: Record<string, string> = {
  main: 'Renda Principal',
  extra: 'Renda Extra',
};

const COLORS = ['#2563eb', '#eab308', '#22c55e', '#a855f7'];

interface IncomeDonutChartProps {
  percentageByType: Record<string, number>;
}

export function IncomeDonutChart({ percentageByType }: IncomeDonutChartProps) {
  const entries = Object.entries(percentageByType);
  if (entries.length === 0) return null;

  const data = entries.map(([type, value]) => ({
    name: TYPE_LABELS[type] ?? type,
    value,
  }));

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: 220, height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{ background: '#161a20', border: '1px solid #242a33', color: '#fff' }}
              itemStyle={{ color: '#f3f4f6' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
        {data.map((entry, index) => (
          <li key={entry.name} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            {entry.name}: {entry.value}%
          </li>
        ))}
      </ul>
    </div>
  );
}
