'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import VideoForm from '@/components/VideoForm';
import VideoStats from '@/components/VideoStats';
import SavedVideos from '@/components/SavedVideos';
import { useAuth } from '@/store/useAuth';
import { VideoStats as VideoStatsType } from '@/lib/youtube';
import { saveVideo, getSavedVideos, removeVideo } from '@/lib/db';

export default function Analyzer() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [currentVideo, setCurrentVideo] = useState<VideoStatsType | null>(null);
  const [savedVideos, setSavedVideos] = useState<VideoStatsType[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'saved'>('analyze');

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Load saved videos
  useEffect(() => {
    if (user?.id) {
      const videos = getSavedVideos(user.id);
      setSavedVideos(videos);
    }
  }, [user?.id]);

  const handleVideoFetch = (video: VideoStatsType) => {
    setCurrentVideo(video);
    setActiveTab('analyze');
  };

  const handleSaveVideo = async () => {
    if (!currentVideo || !user?.id) return;

    setIsSaving(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      saveVideo(user.id, currentVideo);
      const updatedVideos = getSavedVideos(user.id);
      setSavedVideos(updatedVideos);
    } catch (error) {
      console.error('Failed to save video:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveVideo = async (videoId: string) => {
    if (!user?.id) return;

    setIsRemoving(videoId);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      removeVideo(user.id, videoId);
      const updatedVideos = getSavedVideos(user.id);
      setSavedVideos(updatedVideos);

      // If the removed video is currently displayed, clear it
      if (currentVideo?.id === videoId) {
        setCurrentVideo(null);
      }
    } catch (error) {
      console.error('Failed to remove video:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleSelectSavedVideo = (video: VideoStatsType) => {
    setCurrentVideo(video);
    setActiveTab('analyze');
  };

  const isSaved = currentVideo ? savedVideos.some((v) => v.id === currentVideo.id) : false;

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">YouTube Video Analyzer</h1>
            <p className="text-slate-400">
              Analyze video statistics and save your favorite videos for later
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === 'analyze'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              Analyze Video
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === 'saved'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              Saved Videos ({savedVideos.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'analyze' ? (
            <div className="space-y-8">
              <VideoForm onVideoFetch={handleVideoFetch} />

              {currentVideo ? (
                <VideoStats
                  video={currentVideo}
                  onSave={handleSaveVideo}
                  isSaved={isSaved}
                  isSaving={isSaving}
                />
              ) : (
                <div className="bg-slate-800 rounded-lg shadow-lg p-12 text-center">
                  <p className="text-slate-400 text-lg">
                    Enter a YouTube URL or video ID above to get started
                  </p>
                </div>
              )}
            </div>
          ) : (
            <SavedVideos
              videos={savedVideos}
              onSelectVideo={handleSelectSavedVideo}
              onRemoveVideo={handleRemoveVideo}
              isRemoving={isRemoving}
            />
          )}
        </div>
      </main>
    </div>
  );
}