# InsightBoard - Quick Start Guide

Get InsightBoard up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Google account

## Step 1: Install Dependencies (1 minute)

```bash
npm install
```

## Step 2: Get YouTube API Key (2 minutes)

### Option A: Quick Setup (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it "InsightBoard" and click "Create"
4. Wait for creation to complete
5. Go to **APIs & Services** → **Library**
6. Search for "YouTube Data API v3"
7. Click on it and press "ENABLE"
8. Go to **APIs & Services** → **Credentials**
9. Click "CREATE CREDENTIALS" → "API Key"
10. Copy your API key

### Option B: Detailed Setup

See [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md) for step-by-step instructions with screenshots.

## Step 3: Configure Environment (1 minute)

1. Create `.env.local` file in project root:

```bash
# Windows (Command Prompt)
echo NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here > .env.local

# macOS/Linux
echo "NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here" > .env.local
```

2. Replace `your_api_key_here` with your actual API key

## Step 4: Run Development Server (1 minute)

```bash
npm run dev
```

You should see:
```
> next dev

  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
```

## Step 5: Test the Application (1 minute)

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up"
3. Create an account:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
4. Click "Sign Up"
5. You'll be redirected to the Analyzer
6. Enter a YouTube video ID: `dQw4w9WgXcQ`
7. Click "Analyze Video"
8. You should see real YouTube statistics! 🎉

## Common Issues

### "YouTube API is not configured"

**Solution**: 
1. Check `.env.local` exists in project root
2. Verify `NEXT_PUBLIC_YOUTUBE_API_KEY` is set correctly
3. Restart development server: `npm run dev`

### "Video not found"

**Solution**:
1. Verify video ID is correct (11 characters)
2. Ensure video is public (not private)
3. Try with: `dQw4w9WgXcQ`

### Port 3000 already in use

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

## Next Steps

### Learn More
- Read [README.md](./README.md) for full documentation
- Check [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md) for detailed API setup
- See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for developer info

### Customize
- Change colors in `src/app/globals.css`
- Modify components in `src/components/`
- Add new features in `src/app/`

### Deploy
- Push to GitHub
- Connect to [Vercel](https://vercel.com)
- Add environment variables
- Deploy with one click

## Project Structure

```
insightboard/
├── src/
│   ├── app/              # Pages and API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── store/            # State management
├── .env.local            # Your API key (don't commit!)
├── package.json          # Dependencies
└── README.md             # Full documentation
```

## Key Features

✅ User authentication (sign up/login)
✅ Real YouTube video statistics
✅ Interactive charts and analytics
✅ Save favorite videos
✅ Responsive dark theme
✅ Production-ready code

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## API Quotas

- **Free Tier**: 10,000 units per day
- **Cost per Video**: 1 unit
- **Daily Limit**: Analyze up to 10,000 videos per day

## Support

- 📖 [Full Documentation](./README.md)
- 🔧 [API Setup Guide](./YOUTUBE_API_SETUP.md)
- 👨‍💻 [Developer Guide](./API_INTEGRATION_GUIDE.md)
- 🐛 [Troubleshooting](./YOUTUBE_API_SETUP.md#troubleshooting)

## What's Next?

1. ✅ Get API key
2. ✅ Configure environment
3. ✅ Run development server
4. ✅ Test with a video
5. 🚀 Deploy to production

---

**You're all set! Happy analyzing! 🎬**