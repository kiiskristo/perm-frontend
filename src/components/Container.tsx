'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import { Clock, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Container() {
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
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8" />
            <span className="text-2xl font-bold">PERM Analytics</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost" className="text-white dark:text-gray-200 hover:bg-white/20">
              Timeline Estimator
            </Button>
            <Button variant="ghost" className="text-white dark:text-gray-200 hover:bg-white/20">
              About PERM
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="p-2 bg-white/10 rounded-md hover:bg-white/20">
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
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
          <Button variant="ghost" className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            Timeline Estimator
          </Button>
          <Button variant="ghost" className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            About PERM
          </Button>
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
        <Dashboard />
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
              <li><a href="#" className="hover:text-white">About PERM Process</a></li>
              <li><a href="#" className="hover:text-white">Timeline Estimator</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Disclaimer</a></li>
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