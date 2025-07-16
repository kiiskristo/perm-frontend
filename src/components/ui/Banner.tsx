'use client';

import React, { useState } from 'react';
import { X, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface BannerProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  enabled?: boolean;
  link?: {
    text: string;
    href: string;
    newTab: boolean;
  };
}

export function Banner({ 
  message, 
  type = 'info', 
  dismissible = true,
  enabled = true,
  link 
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!enabled || !isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className={`border-b ${getColors()}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {message}
                {link && link.text && link.href && (
                  <a 
                    href={link.href}
                    className="underline hover:no-underline font-semibold"
                    target={link.newTab ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                  >
                    {link.text}
                  </a>
                )}
              </p>
            </div>
          </div>
          
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="ml-4 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 