'use client';

import { useState } from 'react';
import { extractVideoId, fetchVideoMetadata, VideoStats } from '@/lib/youtube';

interface VideoFormProps {
  onVideoFetch: (video: VideoStats) => void;
  isLoading?: boolean;
}

export default function VideoForm({ onVideoFetch, isLoading = false }: VideoFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!url.trim()) {
        setError('Please enter a YouTube URL or video ID');
        setLoading(false);
        return;
      }

      // Extract video ID from URL
      const videoId = extractVideoId(url);

      if (!videoId) {
        setError('Invalid YouTube URL or video ID. Please check and try again.');
        setLoading(false);
        return;
      }

      // Fetch video metadata
      const videoData = await fetchVideoMetadata(videoId);
      onVideoFetch(videoData);
      setUrl('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch video data';
      
      // Provide helpful error messages
      if (errorMessage.includes('not configured')) {
        setError('YouTube API is not configured. Please check the setup guide.');
      } else if (errorMessage.includes('not found')) {
        setError('Video not found. Please check the video ID or URL.');
      } else if (errorMessage.includes('quota')) {
        setError('API quota exceeded. Please try again later.');
      } else if (errorMessage.includes('disabled')) {
        setError('Video statistics are disabled by the uploader.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Analyze YouTube Video</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            YouTube URL or Video ID
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or dQw4w9WgXcQ"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            disabled={loading || isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
            <p className="font-semibold mb-1">Error:</p>
            <p>{error}</p>
            {error.includes('not configured') && (
              <p className="text-xs mt-2">
                📖 See <a href="/YOUTUBE_API_SETUP.md" className="underline hover:text-red-100">setup guide</a> for help
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition"
        >
          {loading || isLoading ? 'Fetching Video Data...' : 'Analyze Video'}
        </button>
      </form>

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        <p>💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Paste a full YouTube URL or just the video ID (11 characters)</li>
          <li>Video must be public to see statistics</li>
          <li>Some creators disable public statistics</li>
        </ul>
      </div>
    </div>
  );
}