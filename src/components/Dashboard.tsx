"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle, BarChart3 } from 'lucide-react';
import { fetchDashboardData, type DashboardData } from '@/services/permService';

// Import all of our components
import { MetricsCard } from './dashboard/MetricsCard';
import { ProcessTimeCard } from './dashboard/ProcessTimeCard';
import { DailyVolumeChart } from './dashboard/DailyVolumeChart';
import { WeeklyAverageChart } from './dashboard/WeeklyAverageChart';
import { WeeklyVolumeChart } from './dashboard/WeeklyVolumeChart';
import { MonthlyVolumeChart } from './dashboard/MonthlyVolumeChart';
import { MonthlyBacklogChart } from './dashboard/MonthlyBacklogChart';
import { PredictionForm } from './dashboard/PredictionForm';
import { MetricsCardSkeleton, ChartSkeleton, BacklogChartSkeleton } from './dashboard/SkeletonLoaders';

// Main Dashboard Component
const Dashboard = () => {
  const [timeRange, setTimeRange] = useState(30);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isDataFromPreviousDay = (asOfDate: string) => {
    const today = new Date().toISOString().split('T')[0];  // YYYY-MM-DD
    return asOfDate !== today;
  };

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
    <div className="space-y-8 dark:text-white">
      {/* Header with title and time range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">PERM Dashboard</h2>
        <div className="relative">
          <button
            onClick={toggleTimeOptions}
            className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-sm"
          >
            <span>Last {timeRange} days</span>
            {showTimeOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showTimeOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => changeTimeRange(7)}>Last 7 days</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => changeTimeRange(30)}>Last 30 days</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => changeTimeRange(90)}>Last 90 days</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => changeTimeRange(180)}>Last 180 days</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Dashboard data visualization section */}
      <div className="space-y-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                alternativeTitle="Yesterday's New Cases"
                showAlternativeTitle={isDataFromPreviousDay(dashboardData.metrics.processing_times.as_of_date)}
                value={dashboardData.metrics.new_cases}
                change={dashboardData.metrics.new_cases_change}
                bgColorClass="bg-blue-100 dark:bg-blue-900/30"
                icon={FileText}
                iconColor="text-blue-600 dark:text-blue-400"
              />
              
              <MetricsCard
                title="Today's Processed Cases"
                alternativeTitle="Yesterday's Processed Cases"
                showAlternativeTitle={isDataFromPreviousDay(dashboardData.metrics.processing_times.as_of_date)}
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
              <DailyVolumeChart data={dashboardData.daily_volume} />
              <WeeklyAverageChart data={dashboardData.weekly_averages} />
            </div>
            
            {/* Second row of charts - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <WeeklyVolumeChart data={dashboardData.weekly_volumes} />
              <MonthlyVolumeChart data={dashboardData.monthly_volumes} />
            </div>
            
            {/* Monthly Backlog Chart (full width) */}
            <MonthlyBacklogChart data={dashboardData.monthly_backlog} />
          </>
        )}
      </div>
      
      {/* Prediction Forms - Always visible and separate from loading state */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Timeline Estimator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PredictionForm type="date" />
          <PredictionForm type="caseNumber" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;