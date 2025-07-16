'use client';

import { Button } from '@/components/ui/button';

export function CTAButton() {
  const scrollToEstimator = () => {
    // Scroll to the dashboard first to show analytics and ads
    const dashboardElement = document.querySelector('[data-timeline-estimator]');
    if (dashboardElement) {
      dashboardElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll down a bit to show dashboard content
      window.scrollTo({ top: 800, behavior: 'smooth' });
    }
  };

  return (
    <Button 
      onClick={scrollToEstimator}
      className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      Calculate Your PERM Timeline →
    </Button>
  );
} 