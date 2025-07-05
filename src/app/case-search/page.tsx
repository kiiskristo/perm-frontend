'use client';

import React, { useState, useEffect, useRef } from 'react';
import Container from '@/components/Container';
import ClientWrapper from '@/components/ClientWrapper';
import { executeRecaptcha } from '@/utils/recaptcha';

interface CompanySearchResponse {
  companies: string[];
  total: number;
  query: string;
}

interface CaseResult {
  case_number: string;
  job_title: string;
  submit_date: string;
  employer_name: string;
  employer_first_letter: string;
}

interface CompanyCasesResponse {
  cases: CaseResult[];
  total: number;
  limit: number;
  offset: number;
  company_name: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

export default function CaseSearchPage() {
  const [companyQuery, setCompanyQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [startDate, setStartDate] = useState('2025-05-01');
  const [endDate, setEndDate] = useState('2025-06-30');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<CaseResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced company search
  useEffect(() => {
    if (companyQuery.length >= 3) {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
          const token = await executeRecaptcha(recaptchaKey, 'company_search');
          
          if (!token) {
            console.error('Failed to get reCAPTCHA token');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/company-search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: companyQuery,
              limit: 10,
              recaptcha_token: token
            }),
          });

          if (response.ok) {
            const data: CompanySearchResponse = await response.json();
            setSuggestions(data.companies);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error searching companies:', error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [companyQuery]);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setCompanyQuery(company);
    setShowSuggestions(false);
  };

  const searchCompanyCases = async (offset = 0) => {
    if (!selectedCompany) {
      setSearchError('Please select a company first');
      return;
    }

    if (offset === 0) {
      setIsSearching(true);
      setSearchResults([]);
      setCurrentOffset(0);
    } else {
      setIsLoadingMore(true);
    }
    
    setSearchError('');

    try {
      const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
      const token = await executeRecaptcha(recaptchaKey, 'company_cases');
      
      if (!token) {
        throw new Error("Failed to verify you're human. Please try again.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/company-cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: selectedCompany,
          start_date: startDate,
          end_date: endDate,
          limit: 50,
          offset: offset,
          recaptcha_token: token
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: CompanyCasesResponse = await response.json();
      
      if (offset === 0) {
        setSearchResults(data.cases);
      } else {
        setSearchResults(prev => [...prev, ...data.cases]);
      }
      
      setTotalResults(data.total);
      setCurrentOffset(offset + data.cases.length);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Failed to search cases');
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreResults = () => {
    if (currentOffset < totalResults && !isLoadingMore) {
      searchCompanyCases(currentOffset);
    }
  };

  const formatDate = (dateString: string) => {
    // Parse the date string manually to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    return date.toLocaleDateString();
  };

  return (
    <ClientWrapper>
      <Container>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Case Search</h1>
          
          <div className="mx-auto">
            {/* Search Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Company Name Input with Autocomplete */}
                <div className="relative">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    id="company"
                    value={companyQuery}
                    onChange={(e) => {
                      setCompanyQuery(e.target.value);
                      setSelectedCompany('');
                    }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Start typing company name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {suggestions.map((company, index) => (
                        <button
                          key={index}
                          onClick={() => handleCompanySelect(company)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min="2025-05-01"
                    max="2025-06-30"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min="2025-05-01"
                    max="2025-06-30"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-6">
                <button
                  onClick={() => searchCompanyCases(0)}
                  disabled={isSearching || !selectedCompany}
                  className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : 'Search Cases'}
                </button>
              </div>

              {/* Error Message */}
              {searchError && (
                <p className="mt-4 text-sm text-red-600 dark:text-red-400">{searchError}</p>
              )}
            </div>

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                  Search Results ({totalResults.toLocaleString()} total cases found)
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3">Case Number</th>
                        <th className="px-4 py-3">Job Title</th>
                        <th className="px-4 py-3">Submit Date</th>
                        <th className="px-4 py-3">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((case_item, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                          <td className="px-4 py-3 font-mono text-xs">{case_item.case_number}</td>
                          <td className="px-4 py-3">{case_item.job_title}</td>
                          <td className="px-4 py-3">{formatDate(case_item.submit_date)}</td>
                          <td className="px-4 py-3">{case_item.employer_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Load More Button */}
                {currentOffset < totalResults && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={loadMoreResults}
                      disabled={isLoadingMore}
                      className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                    >
                      {isLoadingMore ? 'Loading...' : `Load More (${totalResults - currentOffset} remaining)`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">About Case Search</h3>
              <ul className="text-blue-700 dark:text-blue-300 space-y-2">
                <li>• Search for PERM cases by company name and date range</li>
                <li>• Data is currently limited to May and June 2025 submissions to help new people find their case number</li>
                <li>• Results include case numbers, job titles, and submission dates</li>
                <li>• Use the autocomplete feature to find exact company names</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </ClientWrapper>
  );
} 