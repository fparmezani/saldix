'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryBreakdownEntry {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}

interface ExpensesByCategoryChartProps {
  entries: CategoryBreakdownEntry[];
}

export function ExpensesByCategoryChart({ entries }: ExpensesByCategoryChartProps) {
  if (entries.length === 0) return null;

  const data = entries.map((entry) => ({ name: entry.categoryName, value: entry.percentage }));

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: 220, height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
              {entries.map((entry) => (
                <Cell key={entry.categoryId} fill={entry.categoryColor} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{ background: '#161a20', border: '1px solid #242a33', color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
        {entries.map((entry) => (
          <li key={entry.categoryId} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.categoryColor }}
            />
            {entry.categoryName}: {entry.percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
}
