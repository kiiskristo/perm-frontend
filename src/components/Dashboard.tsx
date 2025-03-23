"use client";

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle, BarChart3 } from 'lucide-react';
import { fetchDashboardData, type DashboardData } from '@/services/permService';

// Import non-chart components eagerly
import { MetricsCard } from './dashboard/MetricsCard';
import { ProcessTimeCard } from './dashboard/ProcessTimeCard';
import { MetricsCardSkeleton, ChartSkeleton, BacklogChartSkeleton } from './dashboard/SkeletonLoaders';

// Lazy load chart components
const DailyVolumeChart = lazy(() => import('./dashboard/DailyVolumeChart').then(mod => ({ default: mod.DailyVolumeChart })));
const WeeklyAverageChart = lazy(() => import('./dashboard/WeeklyAverageChart').then(mod => ({ default: mod.WeeklyAverageChart })));
const WeeklyVolumeChart = lazy(() => import('./dashboard/WeeklyVolumeChart').then(mod => ({ default: mod.WeeklyVolumeChart })));
const MonthlyVolumeChart = lazy(() => import('./dashboard/MonthlyVolumeChart').then(mod => ({ default: mod.MonthlyVolumeChart })));
const MonthlyBacklogChart = lazy(() => import('./dashboard/MonthlyBacklogChart').then(mod => ({ default: mod.MonthlyBacklogChart })));
const PredictionForm = lazy(() => import('./dashboard/PredictionForm').then(mod => ({ default: mod.PredictionForm })));

// Main Dashboard Component
const Dashboard = () => {
  const [timeRange, setTimeRange] = useState(30);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError('');
      
      try {
        const data = await fetchDashboardData(timeRange);
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timeRange]);

  const toggleTimeOptions = () => {
    setShowTimeOptions(!showTimeOptions);
  };

  const changeTimeRange = (days: number) => {
    setTimeRange(days);
    setShowTimeOptions(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">PERM Analytics Dashboard</h1>
          
          <div className="relative">
            <button 
              onClick={toggleTimeOptions}
              className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm font-medium dark:text-white">Last {timeRange} Days</span>
              {showTimeOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showTimeOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-10">
                <ul>
                  {[7, 15, 30, 90, 180, 365].map(days => (
                    <li key={days}>
                      <button
                        onClick={() => changeTimeRange(days)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                      >
                        Last {days} Days
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <>
            {/* Key Metrics Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCardSkeleton />
              <MetricsCardSkeleton />
              <MetricsCardSkeleton />
              <MetricsCardSkeleton />
            </div>
            
            {/* First row of charts - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            
            {/* Second row of charts - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            
            {/* Monthly Backlog Chart (full width) */}
            <BacklogChartSkeleton />
          </>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-red-800 dark:text-red-400 font-medium">Error Loading Data</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
            <button 
              className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : dashboardData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Today's New Cases"
                value={dashboardData.metrics.new_cases}
                change={dashboardData.metrics.new_cases_change}
                bgColorClass="bg-blue-100 dark:bg-blue-900/30"
                icon={FileText}
                iconColor="text-blue-600 dark:text-blue-400"
              />
              
              <MetricsCard
                title="Today's Processed Cases"
                value={dashboardData.metrics.processed_cases}
                change={dashboardData.metrics.processed_cases_change}
                bgColorClass="bg-green-100 dark:bg-green-900/30"
                icon={CheckCircle}
                iconColor="text-green-600 dark:text-green-400"
              />
              
              <MetricsCard
                title="Current Backlog"
                value={dashboardData.metrics.current_backlog}
                bgColorClass="bg-orange-100 dark:bg-orange-900/30"
                icon={BarChart3}
                iconColor="text-orange-600 dark:text-orange-400"
              />
              
              <ProcessTimeCard
                medianDays={dashboardData.metrics.processing_times.median_days}
                lowerEstimate={dashboardData.metrics.processing_times.lower_estimate_days}
                upperEstimate={dashboardData.metrics.processing_times.upper_estimate_days}
                asOfDate={dashboardData.metrics.processing_times.as_of_date}
              />
            </div>
            
            {/* First row of charts - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<ChartSkeleton />}>
                <DailyVolumeChart data={dashboardData.daily_volume} />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <WeeklyAverageChart data={dashboardData.weekly_averages} />
              </Suspense>
            </div>
            
            {/* Second row of charts - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Suspense fallback={<ChartSkeleton />}>
                <WeeklyVolumeChart data={dashboardData.weekly_volumes} />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <MonthlyVolumeChart data={dashboardData.monthly_volumes} />
              </Suspense>
            </div>
            
            {/* Monthly Backlog Chart (full width) */}
            <Suspense fallback={<BacklogChartSkeleton />}>
              <MonthlyBacklogChart data={dashboardData.monthly_backlog} />
            </Suspense>
          </>
        )}
      </div>
      
      {/* Prediction Forms - Always visible and separate from loading state */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Timeline Estimator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse h-64"></div>}>
            <PredictionForm type="date" />
          </Suspense>
          <Suspense fallback={<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse h-64"></div>}>
            <PredictionForm type="caseNumber" />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;