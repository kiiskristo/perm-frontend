// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        [key: string]: any;
      }
    ) => void;
  }
}

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: {
    [key: string]: any;
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

// Note: Page views are automatically tracked by GA4
// Custom page view tracking removed to avoid duplication 