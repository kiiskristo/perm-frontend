import React from 'react';
import Container from '@/components/Container';

export const metadata = {
  title: 'Privacy Policy | PERM Analytics',
  description: 'Privacy policy for PERM Analytics - Learn how we collect, use, and protect your information.',
};

export default function PrivacyPolicy() {
  return (
    <Container>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500">Last updated: March 21, 2025</p>

          <h2>Introduction</h2>
          <p>
            Welcome to permupdate.com (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). This Privacy Policy describes how we collect, use, 
            disclose, and safeguard your information when you visit our website.
          </p>
          
          <h2>Information Collection</h2>
          <p>We may collect:</p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Information voluntarily provided by users (e.g., email address).
            </li>
            <li>
              <strong>Non-Personal Data:</strong> Automatically collected via Google Analytics, including browser type, 
              IP address, pages visited, and time spent on pages.
            </li>
          </ul>
          
          <h2>Google Analytics</h2>
          <p>
            We utilize Google Analytics to analyze user behavior. Google Analytics uses cookies to collect data 
            anonymously, helping us improve user experience. Users can disable cookies via browser settings.
          </p>
          
          <h2>Use of Information</h2>
          <p>Information collected is used to:</p>
          <ul>
            <li>Enhance and personalize user experience</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Maintain and improve website functionality</li>
          </ul>
          
          <h2>Data Sources</h2>
          <p>
            Our data is sourced primarily from publicly available information provided by the U.S. Department 
            of Labor at: <a href="https://www.dol.gov/agencies/eta/foreign-labor/performance" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            https://www.dol.gov/agencies/eta/foreign-labor/performance</a>. Additional data is entered manually 
            from other publicly accessible websites.
          </p>
          
          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer user data to third parties.
          </p>
          
          <h2>Security</h2>
          <p>
            We employ reasonable security measures to protect your data from unauthorized access, alteration, 
            or disclosure.
          </p>
          
          <h2>Changes to Privacy Policy</h2>
          <p>
            This Privacy Policy may be updated periodically. Users are encouraged to frequently review this page 
            for any changes.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:info@permupdate.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              privacy@permupdate.com
            </a>.
          </p>
        </div>
      </div>
    </Container>
  );
} 