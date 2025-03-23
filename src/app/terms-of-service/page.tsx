import React from 'react';
import Container from '@/components/Container';

export const metadata = {
  title: 'Terms of Service | PERM Analytics',
  description: 'Terms and conditions for using PERM Analytics - Learn about your rights and responsibilities.',
};

export default function TermsOfService() {
  return (
    <Container>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500">Last updated: March 21, 2024</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing permupdate.com, you agree to these Terms of Service and applicable laws and regulations. 
            If you disagree with any terms, please discontinue use immediately.
          </p>
          
          <h2>Use License</h2>
          <p>
            You are granted permission to access and view the information provided for personal, non-commercial 
            use only. This is a grant of a license, not a transfer of title, and under this license, you may not:
          </p>
          <ul>
            <li>Modify or copy materials;</li>
            <li>Use materials commercially;</li>
            <li>Attempt to reverse engineer any software on our website;</li>
            <li>&quot;mirror&quot; the materials on another server.</li>
          </ul>
          <p>
            Violation of these terms will result in automatic termination of this license.
          </p>
          
          <h2>Disclaimer of Accuracy</h2>
          <p>
            The information provided on permupdate.com is sourced from publicly available resources and manual 
            data entry. We make no warranties about its accuracy, completeness, or timeliness. Predictions and 
            data presented may not be fully accurate or reliable, and we assume no responsibility for errors or 
            inaccuracies.
          </p>
          
          <h2>Limitations</h2>
          <p>
            permupdate.com will not be liable for damages arising from the use or inability to use the materials 
            provided.
          </p>
          
          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction in which permupdate.com operates.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:info@permupdate.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              legal@permupdate.com
            </a>.
          </p>
        </div>
      </div>
    </Container>
  );
} 