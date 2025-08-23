'use client';

import React from 'react';

interface SegmentedControlOption {
  value: string;
  label: string;
  description?: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedControl({ 
  options, 
  value, 
  onChange, 
  className = '',
  size = 'md'
}: SegmentedControlProps) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const containerSizeClasses = {
    sm: 'p-1',
    md: 'p-1',
    lg: 'p-1.5'
  };

  return (
    <div className={`flex bg-gray-100 dark:bg-gray-800 rounded-lg ${containerSizeClasses[size]} ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            flex-1 relative ${sizeClasses[size]} font-medium rounded-md transition-all duration-200 ease-in-out text-center
            ${value === option.value 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }
          `}
          title={option.description}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}