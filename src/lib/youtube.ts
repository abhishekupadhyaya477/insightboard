/**
 * Extracts video ID from YouTube URL
 * @param url - YouTube video URL
 * @returns Video ID or null
 */
export function extractVideoId(url: string): string | null {
  try {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches YouTube video metadata from backend API
 * Uses YouTube Data API v3 for real statistics
 * @param videoId - YouTube video ID
 * @returns Video metadata with real statistics
 */
export async function fetchVideoMetadata(videoId: string) {
  try {
    // Call backend API which uses YouTube Data API v3
    const response = await fetch(`/api/youtube?videoId=${videoId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch video metadata');
    }

    const videoData = await response.json();
    return videoData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch video metadata';
    
    // Log error for debugging
    console.error('YouTube API Error:', errorMessage);
    
    throw new Error(errorMessage);
  }
}

export interface VideoStats {
  id: string;
  title: string;
  channel: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  uploadDate: string;
  thumbnail: string;
  description: string;
  savedAt?: string;
}