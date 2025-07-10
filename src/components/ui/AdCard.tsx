'use client';

import { useEffect, useRef } from 'react';
import { trackAdPerformance } from '@/utils/analytics';

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
  const adInitialized = useRef(false);
  const adElementRef = useRef<HTMLModElement>(null);
  const startTime = useRef<number>(Date.now());



  useEffect(() => {
    // Only initialize the ad once
    if (adInitialized.current) {
      return;
    }

    // 🚀 OPTIMIZATION 1: Call push immediately (no setTimeout delay)
    try {
      if (adElementRef.current && !adInitialized.current) {
        adInitialized.current = true;
        
        // Push immediately to AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Check if ad loaded after reasonable delay
        setTimeout(() => {
          if (adElementRef.current) {
            const adDisplay = window.getComputedStyle(adElementRef.current).display;
            const adHeight = adElementRef.current.clientHeight;
            const loadTime = Date.now() - startTime.current;
            
            if (adDisplay !== 'none' && adHeight > 0) {
              // Track successful ad load
              trackAdPerformance(adSlot, true, false, loadTime);
            } else {
              // Track failed ad load (could be ad blocker or no fill)
              trackAdPerformance(adSlot, false, false, loadTime);
            }
          }
        }, 2000);
      }
    } catch (err) {
      // Track ad error
      const loadTime = Date.now() - startTime.current;
      trackAdPerformance(adSlot, false, true, loadTime);
    }

    // 🚀 OPTIMIZATION 2: Defensive fallback push for hydration/route changes
    const fallbackTimer = setTimeout(() => {
      if (adElementRef.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          // Silent fallback - errors tracked via main ad performance
        }
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [adSlot]);

  // 🚀 OPTIMIZATION 3: Always render ins immediately (no conditional rendering)
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

    </div>
  );
} 