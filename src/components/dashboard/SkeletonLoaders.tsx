import React from 'react';

export function MetricsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function ProcessTimeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}

export function BacklogChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
        <div className="h-80 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
} 