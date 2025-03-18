import { fetchFromAPI } from './api';

// Types based on your existing Dashboard component
export interface DashboardData {
  daily_volume: { date: string; volume: number }[];
  weekly_averages: { day: string; average: number }[];
  weekly_volumes: { week: string; volume: number }[];
  monthly_volumes: { month: string; volume: number }[];
  monthly_backlog: {
    month: string;
    backlog: number;
    is_active: boolean;
    withdrawn: number;
  }[];
  metrics: {
    new_cases: number;
    new_cases_change: number;
    processed_cases: number;
    processed_cases_change: number;
    current_backlog: number;
    processing_times: {
      lower_estimate_days: number;
      median_days: number;
      upper_estimate_days: number;
      as_of_date: string;
    }
  };
}

// Updated to match the latest API response
export interface DatePrediction {
  submit_date: string;
  estimated_completion_date: string;
  upper_bound_date: string;
  estimated_days: number;
  upper_bound_days: number;
  queue_analysis: {
    current_backlog: number;
    estimated_queue_position: number;
    weekly_processing_rate: number;
    estimated_queue_wait_weeks: number;
    days_already_in_queue: number;
  };
  factors_considered: {
    base_processing_time: number;
    queue_time: number;
    total_time: number;
  };
  confidence_level: number;  // This is a decimal (0.8 = 80%)
}

// The API base URL - use environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch dashboard data with metrics and charts
 */
export async function fetchDashboardData(days = 30): Promise<DashboardData> {
  return fetchFromAPI<DashboardData>(`${API_URL}/data/dashboard?days=${days}`);
}

/**
 * Get estimated completion prediction for a PERM case
 */
export async function getPrediction(
  submitDate: string, 
  recaptchaToken: string, 
  employerFirstLetter: string = ''
): Promise<DatePrediction> {
  return fetchFromAPI<DatePrediction>(`${API_URL}/predictions/from-date`, {
    method: 'POST',
    body: JSON.stringify({ 
      submit_date: submitDate,
      recaptcha_token: recaptchaToken,
      employer_first_letter: employerFirstLetter
    }),
  });
} 