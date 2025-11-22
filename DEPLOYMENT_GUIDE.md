# InsightBoard - Deployment Guide

Complete guide to deploy InsightBoard to production.

## Table of Contents
1. [Deployment Options](#deployment-options)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [Self-Hosted Deployment](#self-hosted-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Setup](#environment-setup)
6. [Post-Deployment Checklist](#post-deployment-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Deployment Options

| Option | Difficulty | Cost | Setup Time | Best For |
|--------|-----------|------|-----------|----------|
| **Vercel** | Easy | Free/Paid | 5 min | Quick deployment, auto-scaling |
| **Railway** | Easy | Free/Paid | 10 min | Simple hosting, good free tier |
| **Render** | Easy | Free/Paid | 10 min | Easy deployment, free tier |
| **AWS** | Medium | Varies | 30 min | Enterprise, high traffic |
| **DigitalOcean** | Medium | $5+/month | 20 min | VPS, full control |
| **Docker + VPS** | Hard | $5+/month | 45 min | Maximum control |

## Vercel Deployment (Recommended)

Vercel is the creator of Next.js and offers the easiest deployment experience.

### Step 1: Prepare Your Code

1. Make sure all changes are committed:
```bash
git add .
git commit -m "Ready for deployment"
```

2. Push to GitHub:
```bash
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 3: Import Project

1. Click "New Project"
2. Select your GitHub repository
3. Click "Import"

### Step 4: Configure Environment Variables

1. In the "Environment Variables" section, add:

```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_production_api_key
```

2. Click "Deploy"

### Step 5: Wait for Deployment

Vercel will automatically:
- Build your project
- Run tests
- Deploy to production
- Provide you with a URL

Your app will be live at: `https://your-project.vercel.app`

### Step 6: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### Vercel Advantages
✅ Free tier available
✅ Automatic deployments on git push
✅ Built-in SSL/HTTPS
✅ Auto-scaling
✅ Analytics included
✅ Easy environment variables
✅ Serverless functions
✅ CDN included

---

## Self-Hosted Deployment

Deploy on your own server for maximum control.

### Option A: DigitalOcean (Recommended for Self-Hosting)

#### Step 1: Create Droplet

1. Go to [digitalocean.com](https://digitalocean.com)
2. Click "Create" → "Droplets"
3. Choose:
   - Image: Ubuntu 22.04 LTS
   - Size: $5/month (1GB RAM, 1 vCPU)
   - Region: Closest to your users
4. Click "Create Droplet"
5. Wait for droplet to be created

#### Step 2: Connect to Server

```bash
# SSH into your server
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install npm packages
npm install -g npm@latest

# Install Git
apt install -y git

# Install Nginx (reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

#### Step 3: Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/your-username/insightboard.git
cd insightboard

# Install dependencies
npm install

# Build the project
npm run build
```

#### Step 4: Configure Environment Variables

```bash
# Create .env.local
nano .env.local
```

Add:
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_production_api_key
NODE_ENV=production
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

#### Step 5: Start Application with PM2

```bash
# Start the application
pm2 start npm --name "insightboard" -- start

# Save PM2 configuration
pm2 save

# Enable PM2 startup
pm2 startup
```

#### Step 6: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/insightboard
```

Add:
```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

```bash
# Enable the site
ln -s /etc/nginx/sites-available/insightboard /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### Step 7: Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your_domain.com -d www.your_domain.com

# Auto-renewal is enabled by default
```

#### Step 8: Verify Deployment

1. Open `https://your_domain.com` in browser
2. You should see your InsightBoard application
3. Test sign up and video analysis

### DigitalOcean Advantages
✅ Affordable ($5/month)
✅ Full control
✅ Good documentation
✅ Reliable uptime
✅ Easy scaling
✅ SSH access

---

## Docker Deployment

Deploy using Docker for consistency across environments.

### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

### Step 2: Create .dockerignore

Create `.dockerignore`:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.next
out
build
dist
.DS_Store
```

### Step 3: Build Docker Image

```bash
# Build the image
docker build -t insightboard:latest .

# Test locally
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key \
  insightboard:latest
```

### Step 4: Deploy to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag insightboard:latest your_username/insightboard:latest

# Push to Docker Hub
docker push your_username/insightboard:latest
```

### Step 5: Deploy to Server

```bash
# On your server
docker pull your_username/insightboard:latest

# Run container
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key \
  --name insightboard \
  --restart unless-stopped \
  your_username/insightboard:latest
```

---

## Environment Setup

### Production Environment Variables

Create `.env.production` with:

```env
# YouTube API
NEXT_PUBLIC_YOUTUBE_API_KEY=your_production_api_key

# Node Environment
NODE_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Optional: Sentry (Error Tracking)
SENTRY_AUTH_TOKEN=your_sentry_token
```

### Security Best Practices

1. **Never commit `.env.local`**
   - Already in `.gitignore`
   - Set environment variables on hosting platform

2. **Rotate API Keys**
   - Change API key every 90 days
   - Use separate keys for dev/prod

3. **Enable HTTPS**
   - All hosting platforms support SSL
   - Redirect HTTP to HTTPS

4. **Set Security Headers**
   - Add to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

---

## Post-Deployment Checklist

### Before Going Live

- [ ] Test all authentication flows
- [ ] Test video analysis with real API
- [ ] Test saving/loading videos
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Verify API key is working
- [ ] Test error handling
- [ ] Check performance metrics
- [ ] Verify HTTPS is enabled
- [ ] Test logout functionality

### After Deployment

- [ ] Monitor error logs
- [ ] Check API quota usage
- [ ] Monitor server performance
- [ ] Set up uptime monitoring
- [ ] Configure backups
- [ ] Set up email alerts
- [ ] Document deployment process
- [ ] Create runbook for common issues

### Monitoring Tools

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://www.pingdom.com)
- [StatusPage.io](https://www.statuspage.io)

**Error Tracking:**
- [Sentry](https://sentry.io) - Free tier available
- [Rollbar](https://rollbar.com)
- [LogRocket](https://logrocket.com)

**Analytics:**
- [Google Analytics](https://analytics.google.com)
- [Vercel Analytics](https://vercel.com/analytics)
- [Plausible](https://plausible.io)

---

## Monitoring & Maintenance

### Monitor API Quota

```bash
# Check YouTube API quota usage
# Go to Google Cloud Console → APIs & Services → Quotas
# Monitor daily usage to avoid hitting limits
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update major versions (be careful)
npm install package@latest
```

### Backup Strategy

**For Vercel:**
- Automatic backups included
- Code backed up in GitHub

**For Self-Hosted:**
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database (if using one)
# pg_dump dbname > $BACKUP_DIR/db_$DATE.sql

# Backup environment
cp .env.local $BACKUP_DIR/env_$DATE

# Upload to cloud storage
# aws s3 cp $BACKUP_DIR s3://your-bucket/backups/
```

### Performance Optimization

1. **Enable Caching**
   - Cache API responses
   - Use CDN for static assets

2. **Monitor Response Times**
   - API response time < 1s
   - Page load time < 2s

3. **Database Optimization**
   - Add indexes
   - Optimize queries
   - Archive old data

### Scaling

**When to Scale:**
- Traffic > 1000 requests/day
- API quota usage > 80%
- Response time > 2s

**Scaling Options:**
- Vercel: Automatic
- DigitalOcean: Upgrade droplet or add load balancer
- Docker: Use Kubernetes or Docker Swarm

---

## Troubleshooting Deployment

### Application Won't Start

```bash
# Check logs
pm2 logs insightboard

# Restart application
pm2 restart insightboard

# Check Node version
node --version

# Check npm packages
npm list
```

### API Key Not Working

```bash
# Verify environment variable is set
echo $NEXT_PUBLIC_YOUTUBE_API_KEY

# Check .env.local exists
cat .env.local

# Restart application
pm2 restart insightboard
```

### High Memory Usage

```bash
# Check memory
free -h

# Monitor processes
top

# Restart application
pm2 restart insightboard
```

### SSL Certificate Issues

```bash
# Check certificate expiration
openssl s_client -connect your_domain.com:443

# Renew certificate
certbot renew

# Check Nginx
nginx -t
systemctl restart nginx
```

---

## Cost Comparison

| Platform | Startup | Monthly | Notes |
|----------|---------|---------|-------|
| Vercel | Free | $0-20 | Recommended for most |
| Railway | Free | $5+ | Good free tier |
| Render | Free | $7+ | Easy deployment |
| DigitalOcean | Free | $5+ | Full control |
| AWS | Free | $10+ | Enterprise option |

---

## Next Steps

1. Choose deployment platform
2. Follow platform-specific instructions
3. Set up environment variables
4. Deploy application
5. Test all features
6. Set up monitoring
7. Configure custom domain
8. Enable SSL/HTTPS

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs)

---

**Last Updated**: 2024
**Status**: Ready for Production Deployment