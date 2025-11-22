import { VideoStats } from './youtube';

/**
 * Saves a video to user's collection
 * @param userId - User ID
 * @param video - Video stats to save
 */
export function saveVideo(userId: string, video: VideoStats): void {
  try {
    const key = `videos_${userId}`;
    const existingVideos = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Check if video already exists
    const videoExists = existingVideos.some((v: VideoStats) => v.id === video.id);
    
    if (!videoExists) {
      const videoWithTimestamp = {
        ...video,
        savedAt: new Date().toISOString(),
      };
      existingVideos.push(videoWithTimestamp);
      localStorage.setItem(key, JSON.stringify(existingVideos));
    }
  } catch (error) {
    console.error('Failed to save video:', error);
  }
}

/**
 * Gets all saved videos for a user
 * @param userId - User ID
 * @returns Array of saved videos
 */
export function getSavedVideos(userId: string): VideoStats[] {
  try {
    const key = `videos_${userId}`;
    const videos = localStorage.getItem(key);
    return videos ? JSON.parse(videos) : [];
  } catch (error) {
    console.error('Failed to get saved videos:', error);
    return [];
  }
}

/**
 * Removes a video from user's collection
 * @param userId - User ID
 * @param videoId - Video ID to remove
 */
export function removeVideo(userId: string, videoId: string): void {
  try {
    const key = `videos_${userId}`;
    const existingVideos = JSON.parse(localStorage.getItem(key) || '[]');
    const filteredVideos = existingVideos.filter((v: VideoStats) => v.id !== videoId);
    localStorage.setItem(key, JSON.stringify(filteredVideos));
  } catch (error) {
    console.error('Failed to remove video:', error);
  }
}

/**
 * Gets a specific video by ID
 * @param userId - User ID
 * @param videoId - Video ID
 * @returns Video stats or null
 */
export function getVideoById(userId: string, videoId: string): VideoStats | null {
  try {
    const videos = getSavedVideos(userId);
    return videos.find((v) => v.id === videoId) || null;
  } catch (error) {
    console.error('Failed to get video:', error);
    return null;
  }
}

/**
 * Clears all saved videos for a user
 * @param userId - User ID
 */
export function clearAllVideos(userId: string): void {
  try {
    const key = `videos_${userId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear videos:', error);
  }
}