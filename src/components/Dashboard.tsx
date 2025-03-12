"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronDown, ChevronUp, Clock, ArrowRight } from 'lucide-react';

// Dashboard data interfaces
interface DashboardData {
  daily_volume: { date: string; volume: number }[];
  weekly_averages: { day: string; average: number }[];
  weekly_volumes: { week: string; volume: number }[];
  monthly_volumes: { month: string; volume: number }[];
  metrics: {
    new_cases: number;
    new_cases_change: number;
    processed_cases: number;
    processed_cases_change: number;
    current_backlog: number;
  };
}

interface ExpectedTime {
  days: number;
  confidence: number;
}

interface DatePrediction {
  submit_date: string;
  predicted_completion: string;
  confidence: number;
}

// Mock API functions - in production, replace with actual API calls
const fetchDashboardData = async (days = 30): Promise<DashboardData> => {
  // Simulate API call
  console.log(`Fetching PERM dashboard data for ${days} days`);
  
  // Generate mock data
  const dailyVolume = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return {
      date: date.toISOString().split('T')[0],
      volume: Math.floor(Math.random() * 100) + 50,
    };
  });
  
  const weeklyAverages = [
    { day: 'Monday', average: Math.floor(Math.random() * 80) + 40 },
    { day: 'Tuesday', average: Math.floor(Math.random() * 80) + 40 },
    { day: 'Wednesday', average: Math.floor(Math.random() * 80) + 40 },
    { day: 'Thursday', average: Math.floor(Math.random() * 80) + 40 },
    { day: 'Friday', average: Math.floor(Math.random() * 80) + 40 },
    { day: 'Saturday', average: Math.floor(Math.random() * 40) + 10 },
    { day: 'Sunday', average: Math.floor(Math.random() * 40) + 10 },
  ];
  
  const weeklyVolumes = Array.from({ length: Math.ceil(days / 7) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i * 7));
    return {
      week: date.toISOString().split('T')[0],
      volume: Math.floor(Math.random() * 600) + 300,
    };
  });
  
  const monthlyVolumes = Array.from({ length: Math.ceil(days / 30) }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (Math.ceil(days / 30) - i - 1));
    return {
      month: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
      volume: Math.floor(Math.random() * 2500) + 1500,
    };
  });
  
  return {
    daily_volume: dailyVolume,
    weekly_averages: weeklyAverages,
    weekly_volumes: weeklyVolumes,
    monthly_volumes: monthlyVolumes,
    metrics: {
      new_cases: Math.floor(Math.random() * 100) + 50,
      new_cases_change: Math.floor(Math.random() * 40) - 20,
      processed_cases: Math.floor(Math.random() * 100) + 40,
      processed_cases_change: Math.floor(Math.random() * 40) - 20,
      current_backlog: Math.floor(Math.random() * 1000) + 500,
    }
  };
};

const fetchExpectedTime = async (): Promise<ExpectedTime> => {
  // Simulate API call
  return {
    days: Math.floor(Math.random() * 30) + 15,
    confidence: 80
  };
};

const predictFromDate = async (submitDate: string): Promise<DatePrediction> => {
  // Simulate API call
  const date = new Date(submitDate);
  const completionDate = new Date(date);
  completionDate.setDate(date.getDate() + Math.floor(Math.random() * 30) + 15);
  
  return {
    submit_date: submitDate,
    predicted_completion: completionDate.toISOString().split('T')[0],
    confidence: 75
  };
};

// Main Dashboard Component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [expectedTime, setExpectedTime] = useState<ExpectedTime | null>(null);
  const [dateToPredict, setDateToPredict] = useState(new Date().toISOString().split('T')[0]);
  const [datePrediction, setDatePrediction] = useState<DatePrediction | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData(timeRange);
        setDashboardData(data);
        
        const time = await fetchExpectedTime();
        setExpectedTime(time);
        
        // Initially predict from today
        const prediction = await predictFromDate(new Date().toISOString().split('T')[0]);
        setDatePrediction(prediction);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [timeRange]);
  
  const handleDatePrediction = async () => {
    try {
      const prediction = await predictFromDate(dateToPredict);
      setDatePrediction(prediction);
    } catch (error) {
      console.error("Error predicting from date:", error);
    }
  };
  
  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New PERM Cases</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData?.metrics?.new_cases ?? 0}</h2>
            </div>
            <div className={`flex items-center ${(dashboardData?.metrics?.new_cases_change ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(dashboardData?.metrics?.new_cases_change ?? 0) >= 0 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <span className="font-medium">{Math.abs(dashboardData?.metrics?.new_cases_change ?? 0)}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed Cases</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData?.metrics?.processed_cases ?? 0}</h2>
            </div>
            <div className={`flex items-center ${(dashboardData?.metrics?.processed_cases_change ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(dashboardData?.metrics?.processed_cases_change ?? 0) >= 0 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <span className="font-medium">{Math.abs(dashboardData?.metrics?.processed_cases_change ?? 0)}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Backlog</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData?.metrics?.current_backlog ?? 0}</h2>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, ((dashboardData?.metrics?.current_backlog ?? 0) / 2000) * 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Current processing capacity: ~{Math.round((dashboardData?.metrics?.processed_cases ?? 0) * 0.9)} cases/day</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col h-full justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Range</p>
            <div className="flex space-x-2 mt-2">
              {[30, 60, 90].map((days) => (
                <button
                  key={days}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeRange === days
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setTimeRange(days)}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Volume Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily PERM Case Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData?.daily_volume}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} cases`, 'Volume']}
                  labelFormatter={(value: string) => `Date: ${new Date(value).toLocaleDateString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#4f46e5" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Day of Week Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">PERM Average by Day of Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData?.weekly_averages}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} cases`, 'Average']}
                />
                <Bar dataKey="average" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Weekly Volume Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly PERM Case Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData?.weekly_volumes}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} cases`, 'Volume']}
                  labelFormatter={(value: string) => `Week of: ${new Date(value).toLocaleDateString()}`}
                />
                <Bar dataKey="volume" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Monthly Volume Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly PERM Case Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData?.monthly_volumes}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} cases`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#1e40af" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Prediction Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected Processing Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Clock size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">PERM Processing Timeline</h3>
          </div>
          
          <div className="text-center py-4">
            <div className="text-5xl font-bold text-blue-700 dark:text-blue-400">{expectedTime?.days ?? 0}</div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">days</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {expectedTime?.confidence ?? 0}% of PERM cases are completed within this timeframe
            </p>
            <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${expectedTime?.confidence ?? 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        {/* Date Predictor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Calendar size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">PERM Timeline Predictor</h3>
          </div>
          
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Case Submission Date
          </label>
          <div className="flex items-center mb-4">
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
              value={dateToPredict}
              onChange={(e) => setDateToPredict(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              onClick={handleDatePrediction}
            >
              Predict
            </button>
          </div>
          
          {datePrediction && (
            <div className="mt-4 p-4 border border-blue-100 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-900/40">
              <p className="text-sm text-gray-600 dark:text-gray-300">Estimated PERM completion date:</p>
              <p className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                {new Date(datePrediction.predicted_completion).toLocaleDateString()}
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
                    {new Date(datePrediction.predicted_completion).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Confidence level: {datePrediction.confidence}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;