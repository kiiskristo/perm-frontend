import { fetchFromAPI } from './api';

// Types based on your existing Dashboard component
export interface DashboardData {
  daily_volume: { date: string; volume: number }[];
  weekly_averages: { day: string; average: number }[];
  weekly_volumes: { week: string; volume: number }[];
  monthly_volumes: { month: string; volume: number }[];
  monthly_backlog: {
    month: string;
    year: number;
    backlog: number;
    is_active: boolean;
    withdrawn: number;
    denied: number;
    rfi: number;
  }[];
  perm_cases: {
    daily_activity: {
      activity_data: {
        employer_first_letter: string;
        submit_month: number;
        certified_count: number;
      }[];
      most_active_letter: string;
      most_active_month: number;
      total_certified_cases: number;
      data_date: string;
    };
    latest_month_activity: {
      activity_data: {
        employer_first_letter: string;
        submit_month: number;
        certified_count: number;
        review_count: number;
      }[];
      most_active_letter: string;
      latest_active_month: number;
      total_certified_cases: number;
    };
  };
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
  employer_first_letter?: string;
  estimated_completion_date: string;
  upper_bound_date: string;
  estimated_days: number;
  remaining_days?: number;
  upper_bound_days: number;
  queue_analysis: {
    current_backlog: number;
    raw_queue_position?: number;
    adjusted_queue_position?: number;
    estimated_queue_position?: number;
    weekly_processing_rate: number;
    daily_processing_rate?: number;
    estimated_queue_wait_weeks: number;
    days_already_in_queue: number;
  };
  factors_considered: {
    queue_time?: number;
    days_remaining?: number;
    total_journey_days?: number;
    employer_name_letter?: string;
    base_processing_time?: number;
    total_time?: number;
  };
  confidence_level: number;  // This is a decimal (0.8 = 80%)
}

// Request body interface for prediction API
interface PredictionRequest {
  submit_date: string;
  employer_first_letter: string;
  case_number?: string;
}

// The API base URL - use environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch dashboard data with metrics and charts
 */
export async function fetchDashboardData(days = 30, dataType: 'certified' | 'processed' = 'certified'): Promise<DashboardData> {
  return fetchFromAPI<DashboardData>(`${API_URL}/data/dashboard?days=${days}&data_type=${dataType}`);
}

/**
 * Get estimated completion prediction for a PERM case
 */
export async function getPrediction(
  submitDate: string, 
  employerFirstLetter: string = '',
  caseNumber?: string
): Promise<DatePrediction> {
  const requestBody: PredictionRequest = { 
    submit_date: submitDate,
    employer_first_letter: employerFirstLetter
  };
  
  // Add case number if provided
  if (caseNumber) {
    requestBody.case_number = caseNumber;
  }
  
  return fetchFromAPI<DatePrediction>(`${API_URL}/predictions/from-date`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
} 