import React, { ReactNode } from 'react';
import Link from 'next/link';
import Dashboard from './Dashboard';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/ui/Banner';
import ClientWrapper, { NavControls, MobileMenu } from './ClientWrapper';

interface ContainerProps {
  children?: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* News/Updates Banner */}
      <Banner 
        message="Our sync that should switch to next month, when it sees something was certified that month, did not work automatically, we had to switch manually to March in the morning. Now dashboard is updated, sorry for inconvenience. It takes a lot to run it fully automatically"
        type="info"
        dismissible={true}
        enabled={true}
        link={{
          text: "",
          href: ""
        }}
      />
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white dark:from-gray-800 dark:to-gray-700 relative">
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
        
        {/* Hero Section - Server Rendered */}
        <section className="py-10 px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">PERM Timeline Tracker</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Track your PERM processing times and get accurate timeline predictions with our advanced case tracking system.
          </p>
        </section>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children ? children : (
          <>
            {/* Dashboard Section - Client-side */}
            <ClientWrapper>
              <Dashboard />
            </ClientWrapper>
          </>
        )}
      </main>

      {/* Footer - Server Rendered */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PERM Timeline Tracker</h3>
            <p className="text-gray-400">
              Track your PERM labor certification timeline with our advanced processing time tracker and real-time predictions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about-perm-process" className="hover:text-white">About PERM Process</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white">Timeline Estimator</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">&copy; 2025 PERM Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 