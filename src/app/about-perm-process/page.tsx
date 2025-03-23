import React from 'react';
import Container from '@/components/Container';

export const metadata = {
  title: 'About PERM Process | PERM Analytics',
  description: 'Learn about the Program Electronic Review Management (PERM) process and its key steps for labor certification.',
};

export default function AboutPERMProcess() {
  return (
    <Container>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">About PERM Process</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            The Program Electronic Review Management (PERM) process is a system established by the U.S. Department 
            of Labor (DOL) to certify that hiring a foreign worker for a specific position will not negatively 
            impact U.S. workers. Employers seeking to sponsor foreign nationals for permanent residency (green card) 
            typically must first obtain a certified PERM labor certification.
          </p>

          <h2>The process involves several key steps:</h2>
          
          <ul>
            <li>
              <strong>Job Advertisement:</strong> Employers must conduct a good-faith recruitment effort to find 
              qualified U.S. workers.
            </li>
            <li>
              <strong>Application Submission:</strong> Employers submit an ETA Form 9089 electronically to the DOL.
            </li>
            <li>
              <strong>Review & Certification:</strong> The DOL reviews applications. Certification is granted if 
              no qualified U.S. workers are found to fill the position.
            </li>
            <li>
              <strong>Approval or Audit:</strong> Some cases are selected for audits, requiring additional 
              documentation and extending timelines.
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
} 