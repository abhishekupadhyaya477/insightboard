'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ChartCard from '@/components/ChartCard';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="p-8">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
        
        {loading ? (
          <div className="text-center text-slate-300">Loading metrics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ChartCard title="Revenue" value="$45,231" trend="+12.5%" />
            <ChartCard title="Users" value="2,543" trend="+8.2%" />
            <ChartCard title="Engagement" value="68%" trend="+5.1%" />
          </div>
        )}
      </main>
    </div>
  );
}