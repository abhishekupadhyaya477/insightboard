'use client';

import { VideoStats } from '@/lib/youtube';

interface SavedVideosProps {
  videos: VideoStats[];
  onSelectVideo: (video: VideoStats) => void;
  onRemoveVideo: (videoId: string) => void;
  isRemoving?: string | null;
}

export default function SavedVideos({
  videos,
  onSelectVideo,
  onRemoveVideo,
  isRemoving = null,
}: SavedVideosProps) {
  if (videos.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-8 text-center">
        <p className="text-slate-400 text-lg">No saved videos yet</p>
        <p className="text-slate-500 text-sm mt-2">
          Analyze a YouTube video and save it to see it here
        </p>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white">Saved Videos ({videos.length})</h2>
      </div>

      <div className="divide-y divide-slate-700">
        {videos.map((video) => (
          <div
            key={video.id}
            className="p-4 hover:bg-slate-700 transition cursor-pointer group"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/320x180?text=Video';
                  }}
                />
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg font-semibold text-white truncate hover:text-blue-400 transition"
                  onClick={() => onSelectVideo(video)}
                >
                  {video.title}
                </h3>
                <p className="text-slate-400 text-sm mb-2">{video.channel}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Views: </span>
                    <span className="text-white font-semibold">{formatNumber(video.views)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Likes: </span>
                    <span className="text-white font-semibold">{formatNumber(video.likes)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Comments: </span>
                    <span className="text-white font-semibold">{formatNumber(video.comments)}</span>
                  </div>
                </div>

                {video.savedAt && (
                  <p className="text-slate-500 text-xs mt-2">
                    Saved on {formatDate(video.savedAt)}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-center">
                <button
                  onClick={() => onSelectVideo(video)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => onRemoveVideo(video.id)}
                  disabled={isRemoving === video.id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-lg transition text-sm"
                >
                  {isRemoving === video.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}