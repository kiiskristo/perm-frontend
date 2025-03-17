"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, ChevronUp, Clock, ArrowRight } from 'lucide-react';
import { fetchDashboardData, getPrediction, type DashboardData, type DatePrediction } from '@/services/permService';

// Main Dashboard Component
const Dashboard = () => {
  const [timeRange, setTimeRange] = useState(30);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Date prediction state
  const [submitDate, setSubmitDate] = useState('');
  const [datePrediction, setDatePrediction] = useState<DatePrediction | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setDatePredictionError] = useState('');

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

  // Handle date prediction submission
  const handleDatePrediction = async () => {
    if (!submitDate) {
      setDatePredictionError('Please enter a submission date');
      return;
    }
    
    setPredictionLoading(true);
    setDatePredictionError('');
    
    try {
      const prediction = await getPrediction(submitDate);
      setDatePrediction(prediction);
    } catch (err) {
      setDatePredictionError(err instanceof Error ? err.message : 'Failed to get prediction');
      console.error('Error getting prediction:', err);
    } finally {
      setPredictionLoading(false);
    }
  };

  const toggleTimeOptions = () => {
    setShowTimeOptions(!showTimeOptions);
  };

  const changeTimeRange = (days: number) => {
    setTimeRange(days);
    setShowTimeOptions(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-8">
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
      
      {/* Dashboard content */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Key Metrics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">New Cases</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold dark:text-white">{dashboardData.metrics.new_cases}</p>
                <div className={`flex items-center text-sm ${dashboardData.metrics.new_cases_change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {dashboardData.metrics.new_cases_change >= 0 ? '+' : ''}{dashboardData.metrics.new_cases_change}%
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Processed Cases</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold dark:text-white">{dashboardData.metrics.processed_cases}</p>
                <div className={`flex items-center text-sm ${dashboardData.metrics.processed_cases_change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {dashboardData.metrics.processed_cases_change >= 0 ? '+' : ''}{dashboardData.metrics.processed_cases_change}%
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Current Backlog</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold dark:text-white">{dashboardData.metrics.current_backlog}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Average Process Time</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold dark:text-white">
                  {dashboardData.metrics.processing_times.median_days} days
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Range: {dashboardData.metrics.processing_times.lower_estimate_days}-{dashboardData.metrics.processing_times.upper_estimate_days} days
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  As of {new Date(dashboardData.metrics.processing_times.as_of_date).toLocaleDateString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts */}
      {dashboardData && (
        <>
          {/* First row of charts - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Case Volume */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Daily Case Volume</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardData.daily_volume}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${value} cases`, 'Volume']}
                    />
                    <Line type="monotone" dataKey="volume" stroke="#3B82F6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Weekly Average Processing - Restored */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Weekly Average Processing</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.weekly_averages}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${value} cases`, 'Average']}
                    />
                    <Bar dataKey="average" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Second row of charts - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Weekly Case Volume */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Weekly Case Volume</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.weekly_volumes}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 12 }} 
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${value} cases`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Monthly Volume Trend */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Monthly Volume Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardData.monthly_volumes}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${value} cases`, 'Volume']}
                    />
                    <Line type="monotone" dataKey="volume" stroke="#8B5CF6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Third row - Monthly Backlog (full width) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Monthly Backlog</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={(() => {
                    // Find the first active month and compute this ONCE
                    const firstActiveIndex = dashboardData.monthly_backlog.findIndex(item => item.is_active);
                    // If there's an active month, show from that month onward
                    return firstActiveIndex >= 0
                      ? dashboardData.monthly_backlog.slice(firstActiveIndex)
                      : dashboardData.monthly_backlog.slice(-12);
                  })()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45} 
                    textAnchor="end"
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString()} 
                  />
                  <Tooltip 
                    formatter={(value) => value.toLocaleString()} 
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="backlog" 
                    name="Backlog"
                  >
                    {(() => {
                      const firstActiveIndex = dashboardData.monthly_backlog.findIndex(item => item.is_active);
                      const dataArray = firstActiveIndex >= 0
                        ? dashboardData.monthly_backlog.slice(firstActiveIndex)
                        : dashboardData.monthly_backlog.slice(-12);
                      
                      return dataArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.is_active ? "#3b82f6" : "#93c5fd"} />
                      ));
                    })()}
                  </Bar>
                  <Bar 
                    dataKey="withdrawn" 
                    name="Withdrawn" 
                  >
                    {(() => {
                      const firstActiveIndex = dashboardData.monthly_backlog.findIndex(item => item.is_active);
                      const dataArray = firstActiveIndex >= 0
                        ? dashboardData.monthly_backlog.slice(firstActiveIndex)
                        : dashboardData.monthly_backlog.slice(-12);
                      
                      // Only show withdrawn for non-active months
                      return dataArray.map((entry, index) => (
                        <Cell 
                          key={`cell-withdrawn-${index}`} 
                          fill={entry.is_active ? "transparent" : "#ef4444"}
                        />
                      ));
                    })()}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active Month</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-300 mr-1"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Processed Month</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Withdrawn (processed months only)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Case Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Predictor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">PERM Timeline Predictor</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Enter your PERM submission date to get an estimated completion date:
          </p>
          
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <label htmlFor="submitDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Submission Date
              </label>
              <input
                type="date"
                id="submitDate"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={submitDate}
                onChange={(e) => setSubmitDate(e.target.value)}
              />
              {predictionError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{predictionError}</p>}
            </div>
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              onClick={handleDatePrediction}
              disabled={predictionLoading}
            >
              {predictionLoading ? 'Loading...' : 'Predict'}
            </button>
          </div>
          
          {datePrediction && (
            <div className="mt-4 p-4 border border-blue-100 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-900/40">
              <p className="text-sm text-gray-600 dark:text-gray-300">Estimated PERM completion date:</p>
              <p className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                {new Date(datePrediction.estimated_completion_date).toLocaleDateString()}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Submit Date</p>
                  <p className="text-sm font-medium dark:text-gray-200">
                    {new Date(datePrediction.submit_date).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight size={20} className="text-blue-400 mx-2" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completion Date</p>
                  <p className="text-sm font-medium dark:text-gray-200">
                    {new Date(datePrediction.estimated_completion_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Confidence level: {Math.round(datePrediction.confidence_level * 100)}%
                </p>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Estimated: {datePrediction.estimated_days} days
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Worst case: {datePrediction.upper_bound_days} days
                  </p>
                </div>
                
                {/* Queue Analysis Section */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Queue Analysis:</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Backlog:</p>
                      <p className="text-sm font-medium dark:text-gray-300">{datePrediction.queue_analysis.current_backlog.toLocaleString()} cases</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Est. Queue Position:</p>
                      <p className="text-sm font-medium dark:text-gray-300">{datePrediction.queue_analysis.estimated_queue_position.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Weekly Processing:</p>
                      <p className="text-sm font-medium dark:text-gray-300">{datePrediction.queue_analysis.weekly_processing_rate.toLocaleString()} cases</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Est. Queue Wait:</p>
                      <p className="text-sm font-medium dark:text-gray-300">{datePrediction.queue_analysis.estimated_queue_wait_weeks.toFixed(1)} weeks</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Days Already in Queue:</p>
                      <p className="text-sm font-medium dark:text-gray-300">{datePrediction.queue_analysis.days_already_in_queue} days</p>
                    </div>
                  </div>
                </div>
                
                {/* Time Breakdown */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Processing Time Breakdown:</p>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-blue-500 dark:text-blue-400">
                          Days passed: {datePrediction.queue_analysis.days_already_in_queue} days
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-purple-500 dark:text-purple-400">
                          Queue Time: {datePrediction.factors_considered.queue_time} days
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                      <div 
                        style={{ width: `${(datePrediction.queue_analysis.days_already_in_queue / datePrediction.estimated_days) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                      <div 
                        style={{ width: `${(datePrediction.factors_considered.queue_time / datePrediction.estimated_days) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                      Total: {datePrediction.estimated_days} days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;