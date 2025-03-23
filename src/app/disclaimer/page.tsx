import React from 'react';
import Container from '@/components/Container';

export const metadata = {
  title: 'Disclaimer | PERM Analytics',
  description: 'Important disclaimers about the use of PERM Analytics and its data sources.',
};

export default function Disclaimer() {
  return (
    <Container>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Disclaimer</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500">Last updated: March 21, 2024</p>

          <h2>General Disclaimer</h2>
          <p>
            The content provided on permupdate.com is for informational purposes only and should not be construed 
            as legal or professional advice. We are not a legal firm, and our information should not be treated 
            as legal guidance. Information is obtained from the U.S. Department of Labor 
            (<a href="https://www.dol.gov/agencies/eta/foreign-labor/performance" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              https://www.dol.gov/agencies/eta/foreign-labor/performance
            </a>) and other publicly available sources. Predictions and data provided on our site might not be 
            perfect or fully correct, and we do not accept responsibility for inaccuracies or errors.
          </p>
          
          <h2>External Links</h2>
          <p>
            permupdate.com may include links to external websites. We are not responsible for the accuracy, 
            relevance, or completeness of information contained on external sites.
          </p>
          
          <h2>No Liability</h2>
          <p>
            Under no circumstances will permupdate.com or its affiliates be liable for any loss or damage 
            resulting from reliance on information provided on this website.
          </p>
          
          <h2>Changes to Disclaimer</h2>
          <p>
            This disclaimer may be updated periodically. Users should review this page regularly to stay 
            informed about any changes.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Disclaimer, please contact us at{' '}
            <a href="mailto:info@permupdate.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              info@permupdate.com
            </a>.
          </p>
        </div>
      </div>
    </Container>
  );
} 