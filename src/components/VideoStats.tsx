'use client';

import { VideoStats as VideoStatsType } from '@/lib/youtube';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VideoStatsProps {
  video: VideoStatsType;
  onSave: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

export default function VideoStats({ video, onSave, isSaved = false, isSaving = false }: VideoStatsProps) {
  const engagementData = [
    { name: 'Likes', value: video.likes },
    { name: 'Comments', value: video.comments },
  ];

  const statsData = [
    { name: 'Views', value: video.views },
    { name: 'Likes', value: video.likes },
    { name: 'Comments', value: video.comments },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Video Header */}
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
          <p className="text-slate-400 mb-4">Channel: {video.channel}</p>
          <p className="text-slate-300 text-sm mb-4">{video.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-slate-700 rounded-lg px-4 py-2">
              <p className="text-slate-400 text-sm">Duration</p>
              <p className="text-white font-semibold">{video.duration}</p>
            </div>
            <div className="bg-slate-700 rounded-lg px-4 py-2">
              <p className="text-slate-400 text-sm">Upload Date</p>
              <p className="text-white font-semibold">{video.uploadDate}</p>
            </div>
            {video.savedAt && (
              <div className="bg-slate-700 rounded-lg px-4 py-2">
                <p className="text-slate-400 text-sm">Saved At</p>
                <p className="text-white font-semibold">
                  {new Date(video.savedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onSave}
            disabled={isSaved || isSaving}
            className={`px-6 py-2 font-semibold rounded-lg transition ${
              isSaved
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-75`}
          >
            {isSaving ? 'Saving...' : isSaved ? '✓ Saved' : 'Save Video'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-2">Total Views</p>
          <p className="text-3xl font-bold text-blue-400">{formatNumber(video.views)}</p>
          <p className="text-slate-500 text-xs mt-2">{video.views.toLocaleString()} views</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-2">Total Likes</p>
          <p className="text-3xl font-bold text-green-400">{formatNumber(video.likes)}</p>
          <p className="text-slate-500 text-xs mt-2">
            {((video.likes / video.views) * 100).toFixed(2)}% like rate
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-2">Total Comments</p>
          <p className="text-3xl font-bold text-amber-400">{formatNumber(video.comments)}</p>
          <p className="text-slate-500 text-xs mt-2">
            {((video.comments / video.views) * 100).toFixed(2)}% comment rate
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Stats</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => formatNumber(value as number)}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => formatNumber(value as number)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}