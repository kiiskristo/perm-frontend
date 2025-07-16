// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        [key: string]: string | number | boolean | null;
      }
    ) => void;
  }
}

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: {
    [key: string]: string | number | boolean | null;
  }
) => {
  // Only track if gtag is available (client-side and GA loaded)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      // Add timestamp for better tracking
      timestamp: new Date().toISOString(),
    });
  }
};

// Ad blocker detection utility
export const detectAdBlocker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Method 1: Check if AdSense script actually loaded and is functional
    // When working: adsbygoogle is an object with 'loaded' property
    // When blocked: adsbygoogle is an array or doesn't have 'loaded' property
    const adSenseScriptLoaded = window.adsbygoogle !== undefined && 
                               typeof window.adsbygoogle === 'object' && 
                               !Array.isArray(window.adsbygoogle) &&
                               'loaded' in window.adsbygoogle && 
                               (window.adsbygoogle as Record<string, unknown>).loaded === true;
    
        // Method 2: Create test element (most reliable)
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
      const testBlocked = testAd.offsetHeight === 0 || testAd.offsetWidth === 0;
      document.body.removeChild(testAd);
      
      // Ad blocker detected if:
      // 1. AdSense script didn't load properly, OR
      // 2. Test element was blocked
      const isBlocked = !adSenseScriptLoaded || testBlocked;
      
      resolve(isBlocked);
    }, 200);
  });
};

// Track ad blocker status (with delay to let AdSense load)
export const trackAdBlockerStatus = async (delayMs: number = 5000) => {
  // Wait longer for AdSense to fully load before checking
  await new Promise(resolve => setTimeout(resolve, delayMs));
  
  try {
    const hasAdBlocker = await detectAdBlocker();
    
    trackEvent('ad_blocker_detected', {
      event_category: 'Ad Blocker',
      event_label: hasAdBlocker ? 'blocked' : 'allowed',
      ad_blocker_enabled: hasAdBlocker,
      user_agent: navigator.userAgent.substring(0, 100), // Truncate for GA limits
      custom_parameter_1: 'ad_blocker_check',
    });
    
    return hasAdBlocker;
  } catch (error) {
    console.error('[Analytics] Ad blocker detection failed:', error);
    return false;
  }
};

// Track ad performance (success/failure)
export const trackAdPerformance = (
  adSlot: string,
  loaded: boolean,
  error: boolean,
  loadTime?: number
) => {
  trackEvent('ad_performance', {
    event_category: 'Ad Performance',
    event_label: loaded ? 'loaded' : 'failed',
    ad_slot: adSlot,
    ad_loaded: loaded,
    ad_error: error,
    load_time_ms: loadTime || null,
    custom_parameter_1: 'ad_tracking',
  });
};

// Specific event tracking functions
export const trackPredictionUsage = (
  predictionType: 'date' | 'caseNumber',
  employerLetter: string,
  success: boolean,
  errorMessage?: string
) => {
  trackEvent('perm_prediction_used', {
    event_category: 'PERM Prediction',
    event_label: predictionType,
    prediction_type: predictionType,
    employer_letter: employerLetter.toUpperCase(),
    success: success,
    error_message: errorMessage || null,
    custom_parameter_1: `${predictionType}_prediction`,
  });
};

export const trackPredictionResult = (
  predictionType: 'date' | 'caseNumber',
  employerLetter: string,
  estimatedDays: number,
  confidenceLevel: number
) => {
  trackEvent('perm_prediction_result', {
    event_category: 'PERM Prediction',
    event_label: `${predictionType}_result`,
    prediction_type: predictionType,
    employer_letter: employerLetter.toUpperCase(),
    estimated_days: estimatedDays,
    confidence_level: Math.round(confidenceLevel * 100),
    custom_parameter_1: `${predictionType}_success`,
  });
};

export const trackCaseSearch = (
  companyName: string,
  resultsCount: number,
  dateRange: string
) => {
  trackEvent('case_search_performed', {
    event_category: 'Case Search',
    event_label: 'company_search',
    company_name: companyName,
    results_count: resultsCount,
    date_range: dateRange,
    custom_parameter_1: 'case_search',
  });
};

export const trackUpdatedCasesSearch = (
  searchDate: string,
  resultsCount: number
) => {
  trackEvent('updated_cases_search_performed', {
    event_category: 'Updated Cases Search',
    event_label: 'date_search',
    search_date: searchDate,
    results_count: resultsCount,
    custom_parameter_1: 'updated_cases_search',
  });
};

// Note: Page views are automatically tracked by GA4
// Custom page view tracking removed to avoid duplication 