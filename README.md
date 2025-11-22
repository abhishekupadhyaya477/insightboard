# InsightBoard - YouTube Video Stats Analyzer

A modern web application for analyzing YouTube video statistics with user authentication and saved video management.

## Features

### 🔐 Authentication
- **Sign Up**: Create a new account with email and password
- **Login**: Secure login with credential validation
- **Session Management**: Persistent user sessions with localStorage

### 📊 Video Analysis
- **URL Support**: Analyze videos using YouTube URLs or video IDs
- **Video Metadata**: Display comprehensive video information including:
  - Title, channel name, and description
  - View count, likes, and comments
  - Duration and upload date
  - Thumbnail image
- **Interactive Charts**: 
  - Bar chart showing engagement metrics
  - Pie chart for engagement breakdown
- **Engagement Metrics**: Calculate like rate and comment rate percentages

### 💾 Video Management
- **Save Videos**: Save analyzed videos to your personal collection
- **View Saved Videos**: Browse all saved videos with quick stats
- **Remove Videos**: Delete videos from your collection
- **Persistent Storage**: All saved videos are stored per user

### 🎨 User Interface
- **Dark Theme**: Modern dark interface with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Tab Navigation**: Easy switching between analyzer and saved videos
- **Real-time Updates**: Instant feedback on user actions

## Tech Stack

- **Frontend**: React 19.2.0 with Next.js 16.0.3
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5.0.8
- **Charts**: Recharts 3.4.1
- **HTTP Client**: Axios 1.6.0
- **Language**: TypeScript 5

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Sign up page
│   ├── analyzer/page.tsx        # Main analyzer page
│   ├── dashboard/page.tsx       # Dashboard page
│   ├── api/                     # API routes
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── VideoForm.tsx            # Video input form
│   ├── VideoStats.tsx           # Video statistics display
│   ├── SavedVideos.tsx          # Saved videos list
│   └── ChartCard.tsx            # Chart card component
├── lib/
│   ├── auth.ts                  # Authentication utilities
│   ├── youtube.ts               # YouTube API utilities
│   └── db.ts                    # Database utilities
└── store/
    └── useAuth.ts               # Zustand auth store
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd insightboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating an Account
1. Click "Sign Up" on the home page
2. Enter your full name, email, and password
3. Confirm your password and submit
4. You'll be automatically logged in and redirected to the analyzer

### Analyzing a Video
1. Navigate to the "Analyzer" page
2. Enter a YouTube URL or video ID in the input field
3. Click "Analyze Video"
4. View the comprehensive statistics and charts
5. Click "Save Video" to add it to your collection

### Managing Saved Videos
1. Click the "Saved Videos" tab
2. View all your saved videos with quick stats
3. Click "View" to see full details
4. Click "Remove" to delete from your collection

### Logging Out
1. Click the "Logout" button in the navigation bar
2. You'll be redirected to the login page

## Data Storage

The application uses **localStorage** for data persistence:
- **User Data**: Stored in `users` key (for demo purposes)
- **Saved Videos**: Stored in `videos_<userId>` key per user
- **Session**: Current user stored in `user` key

**Note**: In production, implement a proper backend database (MongoDB, PostgreSQL, etc.)

## API Integration

### YouTube Data API v3 Integration ✅

The application now uses the **YouTube Data API v3** for real video statistics!

#### Quick Setup

1. **Get Your API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3
   - Create an API key

2. **Configure Environment Variables**:
   - Copy `.env.local` and add your API key:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

#### Detailed Setup Guide

For complete step-by-step instructions, see **[YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)**

This guide includes:
- Creating a Google Cloud project
- Enabling YouTube Data API v3
- Creating and restricting API keys
- Configuring environment variables
- Testing the integration
- Troubleshooting common issues
- API quotas and limits
- Production deployment checklist

#### What You Get

With the YouTube API integrated, you'll see:
- ✅ Real view counts
- ✅ Real like counts
- ✅ Real comment counts
- ✅ Accurate video duration
- ✅ Upload dates
- ✅ Channel names
- ✅ Video descriptions
- ✅ High-quality thumbnails

#### API Quotas

- **Free Tier**: 10,000 units per day
- **Cost per Video**: 1 unit
- **Daily Limit**: Analyze up to 10,000 videos per day

#### Security

- API key is restricted to YouTube Data API v3 only
- Backend route handles all API calls securely
- API key is never exposed to the client
- Environment variables are excluded from version control

## Features Roadmap

- [ ] Real YouTube API integration
- [ ] Advanced analytics (trending, growth charts)
- [ ] Video comparison tool
- [ ] Export statistics as PDF
- [ ] Share video analysis links
- [ ] User preferences and settings
- [ ] Dark/Light theme toggle
- [ ] Video search functionality
- [ ] Batch video analysis
- [ ] Email notifications

## Security Considerations

⚠️ **Current Implementation**: Uses localStorage for demo purposes only

For production:
1. **Backend Authentication**: Implement JWT or session-based auth
2. **Password Hashing**: Use bcrypt or similar for password storage
3. **API Security**: Protect YouTube API key on backend
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: Validate all user inputs on backend
6. **Rate Limiting**: Implement rate limiting on API endpoints
7. **CORS**: Configure proper CORS policies

## Troubleshooting

### Videos not saving?
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

### Can't login?
- Ensure you've signed up first
- Check email and password are correct
- Clear localStorage and try again

### Charts not displaying?
- Ensure Recharts is properly installed
- Check browser console for errors
- Verify video data is being fetched correctly

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@insightboard.com or open an issue on GitHub.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Charts library
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [YouTube Data API](https://developers.google.com/youtube/v3) - Video data source

---

**Made with ❤️ by InsightBoard Team**