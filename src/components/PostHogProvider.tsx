import posthog from 'posthog-js';
import { createContext, useContext, useEffect, ReactNode } from 'react';

interface PostHogProviderProps {
  children: ReactNode;
}

const PostHogContext = createContext<typeof posthog | null>(null);

export const PostHogProvider = ({ children }: PostHogProviderProps) => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;

    if (apiKey) {
      // @ts-ignore - Using internal PostHog config options to fix Vercel trailing slash issue
      posthog.init(apiKey, {
        person_profiles: 'identified_only', // Only create profiles for identified users
        capture_pageview: true, // Automatically capture pageviews
        capture_pageleave: true, // Capture when users leave pages
        // Use reverse proxy in production to avoid ad-blockers
        // In production, use custom domain with /ingest path
        // In development, use the configured PostHog host
        api_host: 'https://letterbuzz.news/ingest',
        ui_host: 'https://us.i.posthog.com',
        // CRITICAL: Disable trailing slashes to work with Vercel rewrites
        // PostHog v1.310.1 adds trailing slashes by default which causes 404 with Vercel
        _capture_metrics: true,
        _capture_performance: true,
        advanced_disable_decide: false,
        // Override internal paths to remove trailing slashes
        loaded: (posthog) => {
          // Override the endpoint paths to not include trailing slashes
          // @ts-ignore - Accessing internal PostHog API
          if (posthog._send_request) {
            // @ts-ignore - Overriding internal method
            const originalSendRequest = posthog._send_request.bind(posthog);
            // @ts-ignore - Custom implementation
            posthog._send_request = function (url, data, options, callback) {
              // Remove trailing slash from URL if present
              const cleanUrl = url.replace(/\/$/, '');
              return originalSendRequest(cleanUrl, data, options, callback);
            };
          }

          if (import.meta.env.DEV) {
            console.log('PostHog initialized successfully');
          }
        },
      });
    } else {
      if (import.meta.env.DEV) {
        console.warn('PostHog API key or host not found. Analytics will not be tracked.');
      }
    }

    // Cleanup function
    return () => {
      posthog.reset();
    };
  }, []);

  return (
    <PostHogContext.Provider value={posthog}>
      {children}
    </PostHogContext.Provider>
  );
};

// Custom hook to use PostHog
export const usePostHog = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error('usePostHog must be used within PostHogProvider');
  }
  return context;
};
