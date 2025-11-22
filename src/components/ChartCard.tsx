'use client';

import React from 'react';

interface ChartCardProps {
  title: string;
  value: string;
  trend?: string;
  icon?: React.ReactNode;
}

export default function ChartCard({
  title,
  value,
  trend,
  icon,
}: ChartCardProps) {
  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>

      {trend && (
        <div
          className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isPositive ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  );
}