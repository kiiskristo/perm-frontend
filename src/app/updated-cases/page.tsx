'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import ClientWrapper from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';
import { executeRecaptcha } from '@/utils/recaptcha';
import { AdCard } from '@/components/ui/AdCard';
import { trackUpdatedCasesSearch } from '@/utils/analytics';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw } from 'lucide-react';

interface UpdatedPermCase {
  case_number: string;
  job_title: string;
  submit_date: string;
  employer_name: string;
  employer_first_letter: string;
  status: string;
  updated_at: string;
}

interface UpdatedCasesResponse {
  cases: UpdatedPermCase[];
  total: number;
  limit: number;
  offset: number;
  target_date: string;
  timezone_note: string;
}

export default function UpdatedCasesPage() {
  // Set today as default date in local timezone
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().split('T')[0];
  const [targetDate, setTargetDate] = useState(localToday);
  const [cases, setCases] = useState<UpdatedPermCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCases, setTotalCases] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [serverTargetDate, setServerTargetDate] = useState('');

  const casesPerPage = 50;

  const searchUpdatedCases = async (page: number = 1) => {
    if (!targetDate.trim()) {
      setError('Please enter a date to search for updated cases.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get reCAPTCHA token
      const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
      const recaptchaToken = await executeRecaptcha(recaptchaKey, 'updatedcases');

      if (!recaptchaToken) {
        setError('Failed to verify reCAPTCHA. Please try again.');
        setLoading(false);
        return;
      }

      const offset = (page - 1) * casesPerPage;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/updated-cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_date: targetDate,
          limit: casesPerPage,
          offset: offset,
          recaptcha_token: recaptchaToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

            const data: UpdatedCasesResponse = await response.json();
      setCases(data.cases);
      setTotalCases(data.total);
      setCurrentPage(page);
      setSearchPerformed(true);
      
      // Store the server's target_date to avoid timezone issues in display
      setServerTargetDate(data.target_date);

      // Track successful search (only for initial search, not pagination)
      if (page === 1) {
        trackUpdatedCasesSearch(data.target_date, data.total);
      }

      if (data.cases.length === 0) {
        setError(`No PERM cases were updated on ${targetDate}. Try a different date.`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching for cases.');
      setCases([]);
      setTotalCases(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchUpdatedCases(1);
  };

  const totalPages = Math.ceil(totalCases / casesPerPage);

  const formatDate = (dateString: string) => {
    // Backend returns simple date string, just format it directly
    const [year, month, day] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  };



  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CERTIFIED':
        return 'text-green-600 bg-green-50';
      case 'DENIED':
        return 'text-red-600 bg-red-50';
      case 'WITHDRAWN':
        return 'text-orange-600 bg-orange-50';
      case 'PENDING':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ClientWrapper>
      <Container showHero={false}>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Updated Cases by Date</h1>

          <div className="mx-auto">
            {/* Search Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Search for all PERM cases that were updated on a specific date. This includes status changes,
                  certifications, denials, and other case updates.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                  <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Update Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="targetDate"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      min="2025-07-01"
                      max={localToday}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                      placeholder="Select date..."
                      required
                    />
                  </div>
                </div>



                <Button
                  type="submit"
                  disabled={loading || !targetDate.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Searching...
                    </>
                  ) : (
                    'Search Updated Cases'
                  )}
                </Button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              )}
            </div>
            
            <AdCard adSlot="2964232736" />

            {/* Results */}
            {searchPerformed && cases.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Search Results ({totalCases.toLocaleString()} cases updated on {formatDate(serverTargetDate)})
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    All timestamps are shown in Eastern Time (ET)
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Case Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Employer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Submit Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {cases.map((permCase, index) => (
                        <tr key={`${permCase.case_number}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                            {permCase.case_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {permCase.job_title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            <div className="max-w-xs truncate" title={permCase.employer_name}>
                              {permCase.employer_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(permCase.submit_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(permCase.status)}`}>
                              {permCase.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Mobile: Stack vertically */}
                    <div className="flex flex-col space-y-3 sm:hidden">
                      <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
                        Showing {((currentPage - 1) * casesPerPage) + 1} to {Math.min(currentPage * casesPerPage, totalCases)} of {totalCases.toLocaleString()} cases
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          onClick={() => searchUpdatedCases(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          variant="outline"
                          size="sm"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                          {currentPage} of {totalPages}
                        </span>
                        <Button
                          onClick={() => searchUpdatedCases(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          variant="outline"
                          size="sm"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Desktop: Side by side */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing {((currentPage - 1) * casesPerPage) + 1} to {Math.min(currentPage * casesPerPage, totalCases)} of {totalCases.toLocaleString()} cases
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => searchUpdatedCases(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          variant="outline"
                          size="sm"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          onClick={() => searchUpdatedCases(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          variant="outline"
                          size="sm"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </ClientWrapper>
  );
} 