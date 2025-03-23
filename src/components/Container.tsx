'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Dashboard from './Dashboard';
import { Clock, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContainerProps {
  children?: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect System Preference and User Preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userPreference = localStorage.getItem('theme');
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (userPreference === 'dark' || (!userPreference && systemPreference)) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    }
  }, []);

  // Toggle dark mode and force override system settings
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      localStorage.setItem('theme-mode-override', 'true'); // Mark override
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white dark:from-gray-800 dark:to-gray-700">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Clock className="h-8 w-8" />
            <span className="text-2xl font-bold">PERM Analytics</span>
          </Link>

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

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle - Add aria-label */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 bg-white/10 rounded-md hover:bg-white/20"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>

            {/* Mobile Menu Toggle - Add aria-label for accessibility */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Menu */}
        <div
          className={`md:hidden flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-40 py-4' : 'max-h-0 py-0'
          }`}
        >
          <Link href="/how-it-works">
            <Button variant="ghost" className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
              Timeline Estimator
            </Button>
          </Link>
          <Link href="/about-perm-process">
            <Button variant="ghost" className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
              About PERM
            </Button>
          </Link>
        </div>
        
        {/* Hero Section */}
        <section className="py-10 px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">PERM Processing Timeline Analytics</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Track and predict PERM labor certification processing times with our intelligent analytics tools and case tracker.
          </p>
        </section>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children || <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PERM Analytics</h3>
            <p className="text-gray-400">
              Track your PERM labor certification timeline with accurate predictions and real-time analytics.
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