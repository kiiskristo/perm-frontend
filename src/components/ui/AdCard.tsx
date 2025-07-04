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
          
          console.log(`Initializing AdSense ad for slot: ${adSlot}`);
          
          // Push the ad to AdSense
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          
          // Check if ad loaded after a longer delay (AdSense can be slow)
          setTimeout(() => {
            if (adElementRef.current) {
              const adDisplay = window.getComputedStyle(adElementRef.current).display;
              const adHeight = adElementRef.current.clientHeight;
              
              console.log(`Ad slot ${adSlot} - Display: ${adDisplay}, Height: ${adHeight}`);
              
              // Ad loaded if it's visible and has height
              if (adDisplay !== 'none' && adHeight > 0) {
                setAdLoaded(true);
                console.log(`Ad slot ${adSlot} loaded successfully`);
              } else {
                console.log(`Ad slot ${adSlot} may not have loaded yet or failed to load`);
                // Don't set error - ads might still be loading
              }
            }
          }, 3000); // Increased timeout to 3 seconds
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

  // Always render the ad container - let AdSense handle the content
  return (
    <div className={`text-center ${className}`}>
      <ins 
        ref={adElementRef}
        className="adsbygoogle"
        style={{ display: 'block', margin: '0 auto' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-2">
          Ad Slot: {adSlot} | Loaded: {adLoaded ? 'Yes' : 'No'} | Error: {adError ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
} 