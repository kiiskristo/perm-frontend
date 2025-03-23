import React from 'react';
import Container from '@/components/Container';

export const metadata = {
  title: 'FAQ | PERM Analytics',
  description: 'Frequently asked questions about PERM processing times, data sources, and prediction accuracy.',
};

// FAQ Schema for structured data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What determines how fast my PERM case gets processed?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Two main factors: 1) Employer Name Initial (80% impact) - Companies with earlier alphabet initials are processed faster. 2) Submission Date (20% impact) - The exact submission date within a month can slightly influence wait time."
    }
  }, {
    "@type": "Question",
    "name": "How accurate are these timeline estimates?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Our predictions incorporate recent processing data and statistical methods. They typically reflect real-world results with around 80% confidence, but they're estimations—not guarantees. Processing times can vary based on unforeseen factors at the DOL."
    }
  }, {
    "@type": "Question",
    "name": "Where does permupdate.com obtain its data?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "We primarily use publicly available data provided by the U.S. Department of Labor. Additionally, we manually gather daily updates from other publicly accessible websites to enhance accuracy and timeliness."
    }
  }, {
    "@type": "Question",
    "name": "Can I rely solely on permupdate.com's predictions?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No. Predictions provided by permupdate.com are purely informational. While we strive for accuracy, we are not a legal entity, and our information should not be used as definitive guidance or legal advice. Always consult official resources or a qualified attorney for final decision-making or immigration planning."
    }
  }]
};

export default function FAQ() {
  return (
    <Container>
      <div className="container mx-auto px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Frequently Asked Questions (FAQ)</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="space-y-8">
            <div>
              <h2>What determines how fast my PERM case gets processed?</h2>
              <p>Two main factors:</p>
              <ul>
                <li>
                  <strong>Employer Name Initial:</strong> Has the most significant impact (about 80%). 
                  Companies with earlier alphabet initials are generally processed faster.
                </li>
                <li>
                  <strong>Submission Date:</strong> Has a minor effect (about 20%). The exact date you 
                  submit within a month can slightly influence your wait time.
                </li>
              </ul>
            </div>

            <div>
              <h2>How accurate are these timeline estimates?</h2>
              <p>
                Our predictions incorporate recent processing data and statistical methods. While they typically 
                reflect real-world results with around 80% confidence, they&apos;re estimations—not guarantees. 
                Processing times can vary based on unforeseen factors at the DOL.
              </p>
            </div>

            <div>
              <h2>Where does permupdate.com obtain its data?</h2>
              <p>
                We primarily use publicly available data provided by the U.S. Department of Labor 
                (<a 
                  href="https://www.dol.gov/agencies/eta/foreign-labor/performance" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.dol.gov/agencies/eta/foreign-labor/performance
                </a>). 
                Additionally, we manually gather daily updates from other publicly accessible websites to enhance 
                accuracy and timeliness.
              </p>
            </div>

            <div>
              <h2>Can I rely solely on permupdate.com&apos;s predictions?</h2>
              <p>
                No. Predictions provided by permupdate.com are purely informational. While we strive for accuracy, 
                we are not a legal entity, and our information should not be used as definitive guidance or legal 
                advice. Always consult official resources or a qualified attorney for final decision-making or 
                immigration planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
} 