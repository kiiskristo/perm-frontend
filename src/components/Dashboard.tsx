"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle } from 'lucide-react';
import { fetchDashboardData, type DashboardData } from '@/services/permService';

// Import all of our components
import { MetricsCard } from './dashboard/MetricsCard';
import { ProcessTimeCard } from './dashboard/ProcessTimeCard';
import { LastSyncCard } from './dashboard/LastSyncCard';
import { DailyVolumeChart } from './dashboard/DailyVolumeChart';
import { WeeklyAverageChart } from './dashboard/WeeklyAverageChart';
import { WeeklyVolumeChart } from './dashboard/WeeklyVolumeChart';
import { MonthlyVolumeChart } from './dashboard/MonthlyVolumeChart';
import { MonthlyBacklogChart } from './dashboard/MonthlyBacklogChart';
import { DailySyncLettersChart } from './dashboard/DailySyncLettersChart';
import { MostActiveMonthChart } from './dashboard/MostActiveMonthChart';
import { PredictionForm } from './dashboard/PredictionForm';
import { AdCard } from './ui/AdCard';
import { MetricsCardSkeleton, ProcessTimeCardSkeleton, ChartSkeleton, LetterChartSkeleton, BacklogChartSkeleton } from './dashboard/SkeletonLoaders';
import { trackAdBlockerStatus } from '@/utils/analytics';

// Main Dashboard Component
const Dashboard = () => {
  const [timeRange, setTimeRange] = useState(30);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isDataFromPreviousDay = (asOfDate: string) => {
    // Get today's date in ET timezone as YYYY-MM-DD
    const todayET = new Date().toLocaleDateString("en-US", {timeZone: "America/New_York"});
    const etDateParts = new Date(todayET);
    const todayStringET = `${etDateParts.getFullYear()}-${String(etDateParts.getMonth() + 1).padStart(2, '0')}-${String(etDateParts.getDate()).padStart(2, '0')}`;
    
    // Get the date part from the API response
    const apiDate = asOfDate.split('T')[0];
    
    return apiDate !== todayStringET;
  };

  // Track ad blocker status on dashboard load
  useEffect(() => {
    const checkAdBlocker = async () => {
      try {
        await trackAdBlockerStatus();
      } catch (error) {
        console.error('[Dashboard] Ad blocker detection failed:', error);
      }
    };
    
    checkAdBlocker();
  }, []); // Run once on component mount

  // Console message for developers
  useEffect(() => {
    console.log(
      '%c🚀 PERMupdate Developer Console',
      'color: #3b82f6; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%c💡 Got ideas for new features or want to discuss PERM analytics tech?',
      'color: #10b981; font-size: 14px;'
    );
    console.log(
      '%c📱 Join our Telegram group: https://t.me/+pka9Y1te1KwwNmY8',
      'color: #8b5cf6; font-size: 14px; font-weight: bold;'
    );
    console.log(
      '%c🔧 We love hearing from developers and data enthusiasts!',
      'color: #f59e0b; font-size: 12px;'
    );
  }, []); // Run once on component mount

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
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => changeTimeRange(365)}>Last 1 year</li>
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
              <ProcessTimeCardSkeleton />
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
            
            {/* PERM Cases Activity Charts - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <LetterChartSkeleton />
              <LetterChartSkeleton />
            </div>
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
                title="Today's Reviewed Cases (RFI, Denied, Certified)"
                alternativeTitle="Yesterday's Reviewed Cases (RFI, Denied, Certified)"
                showAlternativeTitle={isDataFromPreviousDay(dashboardData.metrics.processing_times.as_of_date)}
                value={dashboardData.metrics.new_cases}
                change={dashboardData.metrics.new_cases_change}
                bgColorClass="bg-blue-100 dark:bg-blue-900/30"
                icon={FileText}
                iconColor="text-blue-600 dark:text-blue-400"
              />
              
              <MetricsCard
                title="Today's Certified Cases"
                alternativeTitle="Yesterday's Certified Cases"
                showAlternativeTitle={isDataFromPreviousDay(dashboardData.metrics.processing_times.as_of_date)}
                value={dashboardData.metrics.processed_cases}
                change={dashboardData.metrics.processed_cases_change}
                bgColorClass="bg-green-100 dark:bg-green-900/30"
                icon={CheckCircle}
                iconColor="text-green-600 dark:text-green-400"
              />
              
              <LastSyncCard asOfDate={dashboardData.metrics.processing_times.as_of_date} />
              
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
            
            {/* PERM Cases Activity Charts */}
            {dashboardData.perm_cases && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <DailySyncLettersChart 
                  data={dashboardData.perm_cases.daily_activity.activity_data}
                  dataDate={dashboardData.perm_cases.daily_activity.data_date}
                />
                <MostActiveMonthChart 
                  data={dashboardData.perm_cases.latest_month_activity.activity_data}
                  mostActiveLetter={dashboardData.perm_cases.latest_month_activity.most_active_letter}
                  latestActiveMonth={dashboardData.perm_cases.latest_month_activity.latest_active_month}
                  totalCertifiedCases={dashboardData.perm_cases.latest_month_activity.total_certified_cases}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Ad Card before Timeline Estimator */}
      <AdCard adSlot="8024987722" />
      
      {/* Prediction Forms - Always visible and separate from loading state */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Timeline Estimator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PredictionForm type="caseNumber" />
          <PredictionForm type="date" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;