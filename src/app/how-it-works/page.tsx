import React from 'react';
import Container from '@/components/Container';

export const metadata = {
  title: 'How It Works | PERM Analytics',
  description: 'Learn how our Timeline Estimator predicts PERM application processing times using employer name initials and submission dates.',
};

// Article Schema for structured data
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "How PERM Analytics Timeline Estimator Works",
  "description": "Learn how our Timeline Estimator predicts PERM application processing times using employer name initials and submission dates.",
  "author": {
    "@type": "Organization",
    "name": "PERM Analytics"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PERM Analytics",
    "url": "https://permupdate.com"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://permupdate.com/how-it-works"
  }
};

export default function HowItWorks() {
  return (
    <Container>
      <div className="container mx-auto px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Timeline Estimator (How It Works)</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Our Timeline Estimator predicts the estimated processing time for your PERM application using a 
            combination of recent processing data and the specifics of your application.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Current Processing Times</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              PERM applications are currently taking <strong>490-500+ days</strong> to process. This timeline varies 
              based on your submission month and employer name initial within that month.
            </p>
          </div>

          <h2>Here&apos;s a simplified breakdown of our prediction logic:</h2>

          <h3>Employer&apos;s Name Initial (80% Influence):</h3>
          <p>
            Within each submission month, the Department of Labor processes applications alphabetically by employer name. 
            Companies whose names begin with earlier letters (A-I) are processed before those starting with later letters (S-Z).
          </p>
          <p>
            Example: Within the same submission month, an employer name beginning with &quot;A&quot; might be processed 
            a few days to a few weeks earlier than one beginning with &quot;Z&quot;, depending on DOL processing speed 
            and the volume of cases in that month.
          </p>

          <h3>Submission Date (20% Influence):</h3>
          <p>
            The day of the month when your application is submitted has a minor effect. This may impact processing 
            times by approximately 30-40 days.
          </p>

          <h3>Real Processing Speeds &amp; Buffer:</h3>
          <p>
            Our estimator uses the actual processing speed observed from the last three weeks and adds a 15% buffer 
            to provide realistic upper-bound estimates.
          </p>

          <h3>Confidence Level:</h3>
          <p>
            Our estimates come with about an 80% confidence level, meaning they&apos;re reliable, but not guaranteed.
          </p>

          <h3>Timeline Estimation Tool</h3>
          <p>
            Our timeline estimator uses statistical analysis and historical processing data to provide 
            accurate predictions for PERM case completion dates. The algorithm calculates your queue position 
            based on submission date and employer name initial, then applies current processing rates 
            to estimate when your labor certification might be approved.
          </p>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-6">
            <p className="italic">
              Simply enter your case number (starting with G-100-) or submission date to get an estimated 
              processing timeline.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
} 