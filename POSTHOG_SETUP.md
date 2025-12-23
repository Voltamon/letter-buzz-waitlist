# PostHog Analytics Setup Guide

This document explains how to configure PostHog analytics for the LetterBuzz-Waitlist website.

## Overview

PostHog is integrated with:
- ✅ Automatic pageview tracking
- ✅ Reverse proxy configuration for production (prevents ad-blockers)
- ✅ Environment-based configuration
- ✅ React context provider for easy access throughout the app

## Local Development Setup

1. **Copy the environment example file:**
   ```bash
   copy .env.example .env.local
   ```

2. **Get your PostHog credentials:**
   - Sign up at [posthog.com](https://posthog.com) if you haven't already
   - Go to Project Settings in your PostHog dashboard
   - Copy your **Project API Key**

3. **Update `.env.local` with your credentials:**
   ```env
   VITE_POSTHOG_API_KEY=phc_your_actual_api_key_here
   VITE_POSTHOG_HOST=https://app.posthog.com
   ```
   
   *Note: If you're self-hosting PostHog, use your self-hosted URL for VITE_POSTHOG_HOST*

4. **Start the development server:**
   ```bash
   bun run dev
   ```

5. **Verify it's working:**
   - Open your browser console
   - You should see: `PostHog initialized successfully`
   - Check the Network tab for requests to `/ingest/batch`

## Production Deployment (Vercel)

### Setting Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - **Name:** `VITE_POSTHOG_API_KEY`
     - **Value:** Your PostHog API key (starts with `phc_`)
   - **Name:** `VITE_POSTHOG_HOST`
     - **Value:** `https://app.posthog.com` (or your self-hosted URL)

### Reverse Proxy Configuration

The `vercel.json` file is already configured with reverse proxy rewrites that:
- Route all analytics requests through `/ingest/*` 
- Forward them to PostHog's servers
- Prevent ad-blockers from blocking analytics

**No additional configuration needed!** The reverse proxy works automatically when deployed to Vercel.

## Using PostHog in Your Code

### Tracking Custom Events

You can track custom events anywhere in your React components:

```tsx
import { usePostHog } from '@/components/PostHogProvider';

function MyComponent() {
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture('button_clicked', {
      button_name: 'signup',
      location: 'hero_section'
    });
  };

  return <button onClick={handleClick}>Sign Up</button>;
}
```

### Identifying Users

When a user signs up or logs in:

```tsx
const handleLogin = (userId: string, email: string) => {
  posthog.identify(userId, {
    email: email,
    plan: 'free'
  });
};
```

### Page View Tracking

Page views are **automatically tracked** - no additional code needed!

## Troubleshooting

### PostHog not initializing in development
- Check that `.env.local` exists and contains valid credentials
- Verify the API key starts with `phc_`
- Check browser console for error messages

### No events showing in production
- Verify environment variables are set in Vercel
- Check that `vercel.json` is deployed (it should be in your repository)
- Look for 404 errors in the browser Network tab

### Events blocked by ad-blocker
- In production, events should use `/ingest/` path (visible in Network tab)
- If still blocked, the reverse proxy might not be working - check `vercel.json` is properly deployed

## Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog React Integration](https://posthog.com/docs/libraries/react)
- [Vercel Rewrites Documentation](https://vercel.com/docs/projects/project-configuration#rewrites)
