'use client';

import { useEffect, useState, useRef } from 'react';

// Declare the adsbygoogle type for window
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdCardProps {
  adSlot: string;
  adClient?: string;
  className?: string;
}

export function AdCard({ 
  adSlot, 
  adClient = "ca-pub-9390909578965799",
  className = ""
}: AdCardProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const adInitialized = useRef(false);
  const adElementRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only initialize the ad once
    if (adInitialized.current) {
      return;
    }

    const timer = setTimeout(() => {
      try {
        // Check if the ad element exists and hasn't been initialized
        if (adElementRef.current && !adInitialized.current) {
          // Mark as initialized before pushing to prevent duplicate calls
          adInitialized.current = true;
          
          // Push the ad to AdSense
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          
          // Check if ad loaded after a short delay
          setTimeout(() => {
            if (adElementRef.current) {
              const adDisplay = window.getComputedStyle(adElementRef.current).display;
              const adHeight = adElementRef.current.clientHeight;
              
              // Ad loaded if it's visible and has height
              if (adDisplay !== 'none' && adHeight > 0) {
                setAdLoaded(true);
              } else {
                setAdError(true);
              }
            }
          }, 1000);
        }
      } catch (err) {
        console.error('AdSense error:', err);
        setAdError(true);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [adSlot]); // Only depend on adSlot, not on other state changes

  // Don't render anything if ad failed to load or hasn't loaded yet
  if (adError || !adLoaded) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <ins 
        ref={adElementRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
} 