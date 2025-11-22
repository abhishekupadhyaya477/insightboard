import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface VideoMetadata {
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
}

/**
 * Converts ISO 8601 duration to readable format
 * @param duration - ISO 8601 duration string (e.g., PT10M45S)
 * @returns Formatted duration (e.g., 10:45)
 */
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Fetches video statistics from YouTube Data API v3
 * @param videoId - YouTube video ID
 * @returns Video metadata with statistics
 */
async function fetchVideoStats(videoId: string): Promise<VideoMetadata> {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    // Fetch video details and statistics
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        id: videoId,
        key: YOUTUBE_API_KEY,
        part: 'snippet,statistics,contentDetails',
      },
    });

    const items = response.data.items;

    if (!items || items.length === 0) {
      throw new Error('Video not found');
    }

    const video = items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;
    const contentDetails = video.contentDetails;

    // Extract data
    const title = snippet.title;
    const channel = snippet.channelTitle;
    const description = snippet.description;
    const uploadDate = new Date(snippet.publishedAt).toISOString().split('T')[0];
    const thumbnail = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url;
    const duration = formatDuration(contentDetails.duration);

    // Statistics (some may be disabled by channel)
    const views = parseInt(statistics.viewCount || '0');
    const likes = parseInt(statistics.likeCount || '0');
    const comments = parseInt(statistics.commentCount || '0');

    return {
      id: videoId,
      title,
      channel,
      views,
      likes,
      comments,
      duration,
      uploadDate,
      thumbnail,
      description,
    };
  } catch (error) {
    console.error('Error fetching video stats:', error);
    throw error;
  }
}

/**
 * GET /api/youtube
 * Fetches video statistics from YouTube Data API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId parameter is required' },
        { status: 400 }
      );
    }

    // Validate video ID format (11 characters, alphanumeric, dash, underscore)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json(
        { error: 'Invalid video ID format' },
        { status: 400 }
      );
    }

    const videoStats = await fetchVideoStats(videoId);

    return NextResponse.json(videoStats, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch video statistics';

    // Return appropriate error response
    if (errorMessage.includes('Video not found')) {
      return NextResponse.json(
        { error: 'Video not found. Please check the video ID.' },
        { status: 404 }
      );
    }

    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'YouTube API is not configured. Please set up your API key.' },
        { status: 500 }
      );
    }

    if (errorMessage.includes('quotaExceeded')) {
      return NextResponse.json(
        { error: 'YouTube API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}