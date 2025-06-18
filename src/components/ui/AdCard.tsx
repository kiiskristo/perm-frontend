'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Push the ad to AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Check if ad loaded after a short delay
        setTimeout(() => {
          const adElement = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);
          if (adElement) {
            const adDisplay = window.getComputedStyle(adElement).display;
            const adHeight = adElement.clientHeight;
            
            // Ad loaded if it's visible and has height
            if (adDisplay !== 'none' && adHeight > 0) {
              setAdLoaded(true);
            } else {
              setAdError(true);
            }
          }
        }, 1000);
        
      } catch (err) {
        console.error('AdSense error:', err);
        setAdError(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [adSlot]);

  // Don't render anything if ad failed to load or hasn't loaded yet
  if (adError || !adLoaded) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <ins 
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