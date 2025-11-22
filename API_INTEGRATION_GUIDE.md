# YouTube API Integration Guide

Quick reference for developers working with the YouTube Data API v3 integration.

## Architecture Overview

```
Frontend (React)
    ↓
VideoForm Component
    ↓
/api/youtube (Backend Route)
    ↓
YouTube Data API v3
    ↓
Real Video Statistics
```

## File Structure

```
src/
├── app/
│   └── api/
│       └── youtube/
│           └── route.ts          # Backend API route
├── lib/
│   └── youtube.ts                # Frontend utilities
└── components/
    └── VideoForm.tsx             # User input component

.env.local                         # Environment variables
YOUTUBE_API_SETUP.md              # Setup instructions
```

## Key Files

### 1. Backend API Route (`src/app/api/youtube/route.ts`)

**Purpose**: Handles YouTube API requests securely

**Endpoint**: `GET /api/youtube?videoId=<VIDEO_ID>`

**Response**:
```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Video Title",
  "channel": "Channel Name",
  "views": 1234567,
  "likes": 12345,
  "comments": 5678,
  "duration": "3:32",
  "uploadDate": "2024-01-15",
  "thumbnail": "https://...",
  "description": "Video description..."
}
```

**Error Handling**:
- 400: Invalid video ID format
- 404: Video not found
- 429: Quota exceeded
- 500: API not configured or other errors

### 2. Frontend Utilities (`src/lib/youtube.ts`)

**Functions**:

#### `extractVideoId(url: string): string | null`
Extracts video ID from various YouTube URL formats
```typescript
extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
extractVideoId('https://youtu.be/dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
extractVideoId('dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
```

#### `fetchVideoMetadata(videoId: string): Promise<VideoStats>`
Fetches video statistics from backend API
```typescript
const stats = await fetchVideoMetadata('dQw4w9WgXcQ');
console.log(stats.views); // 1234567
```

### 3. Environment Variables (`.env.local`)

```env
# Required
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here

# Optional (for OAuth)
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/callback
```

## API Flow

### Step 1: User Input
```typescript
// User enters YouTube URL or video ID
const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
```

### Step 2: Extract Video ID
```typescript
const videoId = extractVideoId(url); // 'dQw4w9WgXcQ'
```

### Step 3: Fetch from Backend
```typescript
const response = await fetch(`/api/youtube?videoId=${videoId}`);
const videoStats = await response.json();
```

### Step 4: Backend Calls YouTube API
```typescript
// Inside /api/youtube route
const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
  params: {
    id: videoId,
    key: YOUTUBE_API_KEY,
    part: 'snippet,statistics,contentDetails',
  },
});
```

### Step 5: Return to Frontend
```typescript
// Frontend receives real statistics
console.log(videoStats.views); // Real view count
```

## Error Handling

### Common Errors and Solutions

#### "YouTube API is not configured"
```
Cause: NEXT_PUBLIC_YOUTUBE_API_KEY not set
Solution: Add API key to .env.local and restart server
```

#### "Video not found"
```
Cause: Invalid video ID or private video
Solution: Verify video ID and ensure video is public
```

#### "Quota exceeded"
```
Cause: Exceeded 10,000 daily API units
Solution: Wait until next day or request higher quota
```

#### "Statistics disabled by uploader"
```
Cause: Creator disabled public statistics
Solution: This is a YouTube privacy setting, can't be overridden
```

## Testing

### Manual Testing

1. **Test with Popular Video**:
   ```
   Video ID: dQw4w9WgXcQ
   URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

2. **Check API Response**:
   ```bash
   curl "http://localhost:3000/api/youtube?videoId=dQw4w9WgXcQ"
   ```

3. **Verify in Browser**:
   - Open DevTools (F12)
   - Go to Network tab
   - Analyze video
   - Check `/api/youtube` request

### Debugging

**Enable Logging**:
```typescript
// In src/app/api/youtube/route.ts
console.log('Fetching video:', videoId);
console.log('API Response:', response.data);
```

**Check Environment**:
```bash
# Verify API key is set
echo $NEXT_PUBLIC_YOUTUBE_API_KEY
```

## Performance Optimization

### Caching Strategy

Implement caching to reduce API calls:

```typescript
// Example: Cache for 1 hour
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const cache = new Map();

export async function fetchVideoMetadata(videoId: string) {
  const cached = cache.get(videoId);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetch(`/api/youtube?videoId=${videoId}`);
  cache.set(videoId, { data, timestamp: Date.now() });
  
  return data;
}
```

### Rate Limiting

Implement rate limiting on backend:

```typescript
// Example: Limit to 10 requests per minute per IP
const rateLimit = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  
  // Remove old requests
  const recentRequests = userRequests.filter(
    (time: number) => now - time < 60000
  );
  
  if (recentRequests.length >= 10) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}
```

## Security Best Practices

### 1. API Key Protection
- ✅ Never expose API key in client-side code
- ✅ Use backend route to handle API calls
- ✅ Restrict API key to YouTube Data API v3 only
- ✅ Rotate API key periodically

### 2. Input Validation
```typescript
// Validate video ID format
if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
  throw new Error('Invalid video ID format');
}
```

### 3. Error Messages
- ✅ Don't expose internal errors to users
- ✅ Log detailed errors server-side
- ✅ Return user-friendly messages

### 4. HTTPS
- ✅ Always use HTTPS in production
- ✅ Set secure cookies
- ✅ Enable HSTS headers

## Deployment

### Environment Variables for Production

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_production_api_key
YOUTUBE_CLIENT_ID=your_production_client_id
YOUTUBE_CLIENT_SECRET=your_production_client_secret
YOUTUBE_REDIRECT_URI=https://yourdomain.com/api/youtube/callback
```

### Vercel Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Self-Hosted Deployment

1. Set environment variables on server
2. Build: `npm run build`
3. Start: `npm start`
4. Use reverse proxy (nginx) for HTTPS

## Monitoring

### Track API Usage

```typescript
// Log API calls
console.log(`[${new Date().toISOString()}] Video analyzed: ${videoId}`);
console.log(`Quota remaining: ${10000 - usedQuota}`);
```

### Set Up Alerts

- Alert when quota usage > 80%
- Alert on repeated errors
- Monitor response times

## Future Enhancements

- [ ] Implement caching layer
- [ ] Add rate limiting
- [ ] Support OAuth for channel analytics
- [ ] Add video search functionality
- [ ] Implement batch video analysis
- [ ] Add historical data tracking
- [ ] Create analytics dashboard

## Resources

- [YouTube Data API v3 Docs](https://developers.google.com/youtube/v3)
- [API Reference](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

---

**Last Updated**: 2024
**API Version**: YouTube Data API v3