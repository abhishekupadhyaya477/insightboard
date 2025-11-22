# YouTube API Setup Guide

This guide will help you set up the YouTube Data API v3 to get real video statistics for InsightBoard.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Create a Google Cloud Project](#step-1-create-a-google-cloud-project)
3. [Step 2: Enable YouTube Data API v3](#step-2-enable-youtube-data-api-v3)
4. [Step 3: Create API Key](#step-3-create-api-key)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Test the Integration](#step-5-test-the-integration)
7. [API Quotas and Limits](#api-quotas-and-limits)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Google Account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- InsightBoard project set up locally

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name: `InsightBoard` (or your preferred name)
5. Click "CREATE"
6. Wait for the project to be created (this may take a minute)
7. Select your new project from the dropdown

## Step 2: Enable YouTube Data API v3

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "YouTube Data API v3"
3. Click on "YouTube Data API v3"
4. Click the "ENABLE" button
5. Wait for the API to be enabled

## Step 3: Create API Key

### For Public Video Data (Recommended for Development)

1. Go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" > "API Key"
3. A dialog will appear with your API key
4. Click the copy icon to copy your API key
5. Click "CLOSE"

**Important**: Restrict your API key to prevent unauthorized use:
1. Click on your newly created API key
2. Under "API restrictions", select "YouTube Data API v3"
3. Click "SAVE"

### Optional: OAuth 2.0 for Channel Analytics

If you want to access your own channel's analytics (requires authentication):

1. Go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, click "CONFIGURE CONSENT SCREEN"
4. Choose "External" and click "CREATE"
5. Fill in the required fields:
   - App name: `InsightBoard`
   - User support email: Your email
   - Developer contact: Your email
6. Click "SAVE AND CONTINUE"
7. Skip optional scopes and click "SAVE AND CONTINUE"
8. Click "BACK TO DASHBOARD"
9. Go back to **Credentials** and click "CREATE CREDENTIALS" > "OAuth client ID"
10. Select "Web application"
11. Add authorized redirect URIs:
    - `http://localhost:3000/api/youtube/callback` (development)
    - `https://yourdomain.com/api/youtube/callback` (production)
12. Click "CREATE"
13. Copy your Client ID and Client Secret

## Step 4: Configure Environment Variables

1. Open `.env.local` in your project root
2. Add your API key:

```env
# YouTube API Configuration
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

3. (Optional) If using OAuth 2.0, also add:

```env
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/callback
```

4. Save the file
5. Restart your development server: `npm run dev`

## Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)

3. Sign up or login to your account

4. Go to the Analyzer page

5. Try analyzing a popular YouTube video:
   - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Or Video ID: `dQw4w9WgXcQ`

6. You should see real statistics from YouTube:
   - View count
   - Like count
   - Comment count
   - Video duration
   - Upload date
   - Channel name

If you see real data, the integration is working! 🎉

## API Quotas and Limits

### Free Tier Quota
- **Daily Quota**: 10,000 units per day
- **Per-Request Cost**: 1 unit per video

### What This Means
- You can analyze up to 10,000 videos per day
- This is more than enough for most use cases

### Quota Usage
To check your quota usage:
1. Go to **APIs & Services** > **Quotas**
2. Search for "YouTube Data API v3"
3. View your daily quota usage

### Increasing Quota
If you need more quota:
1. Go to **APIs & Services** > **Quotas**
2. Click on "YouTube Data API v3"
3. Click "EDIT QUOTAS"
4. Request higher limits
5. Google will review your request

## Troubleshooting

### "YouTube API is not configured"
**Problem**: The API key is not set in `.env.local`

**Solution**:
1. Check that `.env.local` exists in your project root
2. Verify `NEXT_PUBLIC_YOUTUBE_API_KEY` is set correctly
3. Restart your development server
4. Clear browser cache

### "Invalid API Key"
**Problem**: The API key is incorrect or invalid

**Solution**:
1. Go to Google Cloud Console
2. Verify the API key is correct
3. Check that YouTube Data API v3 is enabled
4. Ensure the API key has no restrictions or is restricted to YouTube Data API v3

### "Video not found"
**Problem**: The video ID is invalid or the video doesn't exist

**Solution**:
1. Verify the video ID is correct (11 characters)
2. Check that the video is public (private videos won't work)
3. Try with a different video

### "Quota exceeded"
**Problem**: You've exceeded your daily quota

**Solution**:
1. Wait until the next day (quota resets at midnight UTC)
2. Request higher quota limits from Google Cloud Console
3. Consider implementing caching to reduce API calls

### "Statistics disabled by uploader"
**Problem**: The video's statistics are hidden by the uploader

**Solution**:
- Some creators disable public statistics
- The API will return 0 for likes and comments
- This is a limitation of YouTube's privacy settings

### CORS Errors
**Problem**: Getting CORS errors when calling the API

**Solution**:
- Make sure you're calling `/api/youtube` (backend route)
- Don't call the Google API directly from the frontend
- The backend route handles CORS properly

## Best Practices

### 1. Secure Your API Key
- Never commit `.env.local` to version control
- Use `.gitignore` to exclude it
- Rotate your API key periodically
- Restrict API key to YouTube Data API v3 only

### 2. Implement Caching
- Cache video statistics to reduce API calls
- Implement a TTL (time-to-live) for cached data
- Example: Cache for 1 hour

### 3. Error Handling
- Always handle API errors gracefully
- Show user-friendly error messages
- Log errors for debugging

### 4. Rate Limiting
- Implement rate limiting on your backend
- Prevent users from making too many requests
- Use exponential backoff for retries

### 5. Monitor Usage
- Regularly check your quota usage
- Set up alerts for quota approaching limits
- Plan for scaling if needed

## Production Deployment

### Environment Variables
Set these in your production environment:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_production_api_key
YOUTUBE_CLIENT_ID=your_production_client_id
YOUTUBE_CLIENT_SECRET=your_production_client_secret
YOUTUBE_REDIRECT_URI=https://yourdomain.com/api/youtube/callback
```

### Security Checklist
- [ ] API key is restricted to YouTube Data API v3
- [ ] API key is not exposed in client-side code
- [ ] `.env.local` is in `.gitignore`
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Error messages don't expose sensitive info
- [ ] Logging is configured for debugging

## Additional Resources

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [YouTube Data API v3 Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
3. Check the browser console for error messages
4. Check the server logs for backend errors

---

**Last Updated**: 2024
**API Version**: YouTube Data API v3