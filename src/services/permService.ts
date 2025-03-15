import { fetchFromAPI } from './api';

// Types based on your existing Dashboard component
export interface DashboardData {
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

// Updated to match the real API response
export interface DatePrediction {
  submit_date: string;
  estimated_completion_date: string;  // Changed from predicted_completion
  upper_bound_date: string;
  estimated_days: number;
  upper_bound_days: number;
  factors_considered: {
    current_backlog: number;
    base_processing_time: number;
  };
  confidence_level: number;  // This is a decimal (0.8 = 80%)
}

/**
 * Fetch dashboard data with metrics and charts
 */
export async function fetchDashboardData(days = 30): Promise<DashboardData> {
  return fetchFromAPI<DashboardData>(`/api/data/dashboard?days=${days}`);
}

/**
 * Get estimated completion prediction for a PERM case
 */
export async function getPrediction(submitDate: string): Promise<DatePrediction> {
  return fetchFromAPI<DatePrediction>('/api/predictions/from-date', {
    method: 'POST',
    body: JSON.stringify({ submit_date: submitDate }),
  });
} 