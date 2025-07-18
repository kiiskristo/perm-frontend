'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/utils/analytics';

interface PollOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function PollOverlay({ isVisible, onClose, onComplete }: PollOverlayProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);

  if (!isVisible) return null;

  const handleQuestion1Answer = (answer: boolean) => {
    
    // Track first question response
    trackEvent('poll_question_1_answered', {
      event_category: 'User Poll',
      event_label: 'update_frequency',
      wants_twice_daily: answer,
      custom_parameter_1: 'poll_engagement',
    });

    if (answer) {
      setCurrentQuestion(2);
    } else {
      // If they don't want twice daily, complete the poll
      trackEvent('poll_completed', {
        event_category: 'User Poll', 
        event_label: 'poll_completion',
        wants_twice_daily: false,
        preferred_time: 'none',
        custom_parameter_1: 'poll_results',
      });
      onComplete();
    }
  };

  const handleQuestion2Answer = (time: string) => {
    // Track second question response and completion
    trackEvent('poll_question_2_answered', {
      event_category: 'User Poll',
      event_label: 'preferred_time',
      preferred_time: time,
      custom_parameter_1: 'poll_engagement',
    });

    trackEvent('poll_completed', {
      event_category: 'User Poll',
      event_label: 'poll_completion', 
      wants_twice_daily: true,
      preferred_time: time,
      custom_parameter_1: 'poll_results',
    });

    onComplete();
  };

  const handleClose = () => {
    // Track poll dismissal
    trackEvent('poll_dismissed', {
      event_category: 'User Poll',
      event_label: 'poll_dismissal',
      question_number: currentQuestion,
      custom_parameter_1: 'poll_engagement',
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mx-4 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        {currentQuestion === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Help Us Improve PERM Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Would you like PERM data to update twice per day instead of once daily?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleQuestion1Answer(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Yes, twice daily
              </Button>
              <Button
                onClick={() => handleQuestion1Answer(false)}
                variant="outline"
                className="flex-1"
              >
                No, once is fine
              </Button>
            </div>
          </div>
        )}

        {currentQuestion === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              When should the first update be?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If we update twice daily, what time should the first update happen? (Eastern Time)
            </p>
            <div className="grid grid-cols-1 gap-3">
              {['1 PM ET', '2 PM ET', '3 PM ET'].map((time) => (
                <Button
                  key={time}
                  onClick={() => handleQuestion2Answer(time)}
                  variant="outline"
                  className="w-full hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400 text-center">
          Your feedback helps us improve the service for everyone
        </div>
      </div>
    </div>
  );
} 