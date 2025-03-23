import React from 'react';
import Container from '@/components/Container';

export const metadata = {
  title: 'How It Works | PERM Analytics',
  description: 'Learn how our Timeline Estimator predicts PERM application processing times using employer name initials and submission dates.',
};

export default function HowItWorks() {
  return (
    <Container>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Timeline Estimator (How It Works)</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Our Timeline Estimator predicts the estimated processing time for your PERM application using a 
            combination of recent processing data and the specifics of your application.
          </p>

          <h2>Here&apos;s a simplified breakdown of our prediction logic:</h2>

          <h3>Employer&apos;s Name Initial (80% Influence):</h3>
          <p>
            Employers whose names begin with earlier letters (A-I) typically experience shorter processing times. 
            Companies starting with letters later in the alphabet (S-Z) often experience longer processing times.
          </p>
          <p>
            Example: An employer name beginning with &quot;A&quot; can be processed about 160 days faster than one beginning 
            with &quot;M&quot;. Conversely, one beginning with &quot;Z&quot; could take roughly 160 days longer than one starting with &quot;M&quot;.
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