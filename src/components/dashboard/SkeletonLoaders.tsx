import React from 'react';

export function SkeletonPulse() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 h-full w-full rounded-md"></div>
    </div>
  );
}

export function MetricsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export function BacklogChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
} 