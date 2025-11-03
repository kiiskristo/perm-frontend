import React, { ReactNode } from 'react';
import Link from 'next/link';
import Dashboard from './Dashboard';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/ui/Banner';
import ClientWrapper, { NavControls, MobileMenu } from './ClientWrapper';
import Chatbot from './Chatbot';

interface ContainerProps {
  children?: ReactNode;
  showHero?: boolean;
}

export default function Container({ children, showHero = true }: ContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* News/Updates Banner */}
      <Banner 
        message="We noticed confusement today about our updated cases page. We only sync data officially at 10PM EST time. Today we did some small runs just to check if the sync is working and if DOL started the process again. We do not have live data."
        type="info"
        dismissible={true}
        enabled={true}
      />
      <Banner 
        message="Perm process started again, July is the latest month! You can see daily updated cases "
        type="info"
        dismissible={true}
        enabled={true}
        link={{
          text: 'on our updated cases page',
          href: '/updated-cases',
          newTab: false
        }}
      />
      {/* Header */}
      <header className="bg-linear-to-r from-purple-600 to-blue-600 text-white dark:from-gray-800 dark:to-gray-700 relative">
        <ClientWrapper>
          <div className="relative">
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Clock className="h-8 w-8" />
                <span className="text-2xl font-bold">PERM Analytics</span>
              </Link>

              {/* Right side navigation - Desktop Navigation + Controls */}
              <div className="flex items-center space-x-6">
                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-6">
                  <Link href="/how-it-works">
                    <Button variant="ghost" className="text-white dark:text-gray-200 hover:bg-white/20">
                      Timeline Estimator
                    </Button>
                  </Link>
                  <Link href="/about-perm-process">
                    <Button variant="ghost" className="text-white dark:text-gray-200 hover:bg-white/20">
                      About PERM
                    </Button>
                  </Link>
                </div>

                {/* Client-side Navigation Controls */}
                <NavControls />
              </div>
            </nav>
            
            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </ClientWrapper>
        
        {/* Hero Section - Server Rendered */}
        {showHero && (
          <section className="py-10 px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">PERM Timeline Tracker</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Track your PERM processing times and get accurate timeline predictions with our advanced case tracking system.
            </p>
          </section>
        )}
      </header>

      <main className="grow container mx-auto px-4 py-8">
        {children ? children : (
          <>
            {/* Dashboard Section - Client-side */}
            <ClientWrapper>
              <Dashboard />
            </ClientWrapper>
          </>
        )}
      </main>

      {/* SEO Content Section - Server Rendered */}
      {!children && (
        <section className="bg-gray-50 dark:bg-gray-800/50 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto prose prose-gray dark:prose-invert">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Understanding PERM Labor Certification Processing Times</h2>
              
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  <strong>Current Reality:</strong> PERM applications are taking 462-478 days to process as of 2025.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">What is PERM Labor Certification?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    The Program Electronic Review Management (PERM) is the system used by the U.S. Department of Labor 
                    to process applications for permanent labor certification. This certification is required for most 
                    employment-based green card applications, ensuring that hiring foreign workers will not adversely 
                    affect U.S. workers&apos; wages and working conditions.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Processing Time Factors</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    PERM processing times vary significantly based on several factors. The Department of Labor processes 
                    applications by submission month first, then alphabetically by employer name within each month. 
                    For example, if you submit in May 2025, DOL will process all May 2025 cases, but companies with 
                    names starting with earlier letters (A-I) will be processed before those starting with later letters (S-Z).
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Current Processing Trends</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our dashboard provides real-time insights into PERM processing trends, including daily volume 
                    changes, weekly processing rates, and monthly backlogs. This data helps employers and immigration 
                    attorneys better understand current processing patterns and estimate timelines for pending applications.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Timeline Estimation Tool</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our timeline estimator uses statistical analysis and historical processing data to calculate 
                    accurate predictions for PERM case completion dates. The algorithm determines your queue position 
                    based on submission date and employer name initial, then applies current processing rates and 
                    backlog data to estimate completion timelines.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">Key Benefits of PERM Tracking</h3>
                <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-2">
                  <li>Real-time processing data from the Department of Labor</li>
                  <li>Accurate timeline predictions based on historical patterns</li>
                  <li>Comprehensive analytics for immigration planning</li>
                  <li>Daily updates on case processing volumes and trends</li>
                  <li>Employer name alphabetical processing insights</li>
                  <li>Monthly backlog analysis and forecasting</li>
                </ul>
              </div>
              
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  <strong>Disclaimer:</strong> The information provided on this dashboard is for informational purposes only 
                  and should not be considered as legal advice. Processing times are estimates based on historical data 
                  and current trends. Actual processing times may vary due to various factors including case complexity, 
                  audit selection, and changes in Department of Labor procedures. Always consult with a qualified 
                  immigration attorney for specific legal guidance regarding your PERM application.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer - Server Rendered */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">PERM Timeline Tracker</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Track your PERM labor certification timeline with our advanced processing time tracker and real-time predictions.
              </p>
            </div>
            
            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about-perm-process" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                    About PERM Process
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                    Timeline Estimator
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400 text-sm">
              &copy; 2025 PERM Analytics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Chatbot Component */}
      <ClientWrapper>
        <Chatbot />
      </ClientWrapper>
    </div>
  );
} 