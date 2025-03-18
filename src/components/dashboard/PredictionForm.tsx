import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getPrediction, type DatePrediction } from '@/services/permService';
import { executeRecaptcha } from '@/utils/recaptcha';

interface PredictionFormProps {
  type: 'date' | 'caseNumber';
}

export function PredictionForm({ type = 'date' }: PredictionFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [datePrediction, setDatePrediction] = useState<DatePrediction | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState('');

  const handleDatePrediction = async () => {
    if (!inputValue) {
      setPredictionError(`Please enter a ${type === 'date' ? 'submission date' : 'case number'}`);
      return;
    }
    
    setPredictionLoading(true);
    setPredictionError('');
    
    try {
      // Get reCAPTCHA token
      const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
      const token = await executeRecaptcha(recaptchaKey, 'prediction_form');
      
      if (!token) {
        throw new Error("Failed to verify you're human. Please try again.");
      }
      
      let submitDate = inputValue;
      
      // If this is a case number, parse the date from it
      if (type === 'caseNumber') {
        const caseNumberPattern = /G-\d+-(\d{5})-\d+/;
        const match = inputValue.match(caseNumberPattern);
        
        if (!match) {
          throw new Error('Invalid case number format. Expected format: G-100-XXXXX-XXXXXX');
        }
        
        const dayCode = match[1];
        const year = '20' + dayCode.substring(0, 2);
        const dayOfYear = parseInt(dayCode.substring(2), 10);
        
        // Convert day of year to date
        const date = new Date(parseInt(year, 10), 0); // January 1
        date.setDate(dayOfYear);
        
        // Format as YYYY-MM-DD for the API
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        submitDate = `${year}-${month}-${day}`;
      }
      
      // Pass the reCAPTCHA token to your backend
      const prediction = await getPrediction(submitDate, token);
      setDatePrediction(prediction);
    } catch (err) {
      let errorMessage = 'Failed to get prediction';
      
      // Safely handle different error formats
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setPredictionError(errorMessage);
      console.error('Error getting prediction:', err);
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        {type === 'date' ? 'Predict by Submission Date' : 'Predict by Case Number'}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {type === 'date' 
          ? 'Enter your PERM submission date to get an estimated completion date:' 
          : 'Enter your PERM case number (G-100-XXXXX-XXXXXX) to get an estimated completion date:'}
      </p>
      
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <label htmlFor={`input-${type}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {type === 'date' ? 'Submission Date' : 'Case Number'}
          </label>
          {type === 'date' ? (
            <input
              type="date"
              id="input-date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          ) : (
            <input
              type="text"
              id="input-caseNumber"
              placeholder="G-100-XXXXX-XXXXXX"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
          {predictionError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{predictionError}</p>}
        </div>
        
        <div className="w-full">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={handleDatePrediction}
            disabled={predictionLoading}
          >
            {predictionLoading ? 'Loading...' : 'Predict'}
          </button>
        </div>
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
  );
} 