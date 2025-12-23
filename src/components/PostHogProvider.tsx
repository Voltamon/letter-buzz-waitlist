import posthog from 'posthog-js';
import { createContext, useContext, useEffect, ReactNode } from 'react';

interface PostHogProviderProps {
  children: ReactNode;
}

const PostHogContext = createContext<typeof posthog | null>(null);

export const PostHogProvider = ({ children }: PostHogProviderProps) => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST;

    if (apiKey && host) {
      posthog.init(apiKey, {
        person_profiles: 'identified_only', // Only create profiles for identified users
        capture_pageview: true, // Automatically capture pageviews
        capture_pageleave: true, // Capture when users leave pages
        // Use reverse proxy in production to avoid ad-blockers
        // In production, use custom domain with /ingest path
        // In development, use the configured PostHog host
        api_host: import.meta.env.PROD ? 'https://letterbuzz.news/ingest' : host,
        ui_host: 'https://us.i.posthog.com',
        loaded: (posthog) => {
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
