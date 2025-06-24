'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ClientWrapperProps {
  children: ReactNode;
}

// Dark mode context
let darkModeState: boolean | null = null;
let setDarkModeCallback: ((value: boolean) => void) | null = null;
let mobileMenuState: boolean = false;
let setMobileMenuCallback: ((value: boolean) => void) | null = null;

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Store state globally so other components can access it
  darkModeState = darkMode;
  setDarkModeCallback = setDarkMode;
  mobileMenuState = mobileMenuOpen;
  setMobileMenuCallback = setMobileMenuOpen;

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

  return <>{children}</>;
}

// Separate component for navigation controls
export function NavControls() {
  const toggleDarkMode = () => {
    if (setDarkModeCallback && darkModeState !== null) {
      const newMode = !darkModeState;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      localStorage.setItem('theme-mode-override', 'true');
      document.documentElement.classList.toggle('dark', newMode);
      setDarkModeCallback(newMode);
    }
  };

  const toggleMobileMenu = () => {
    if (setMobileMenuCallback) {
      setMobileMenuCallback(!mobileMenuState);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode} 
        className="p-2 bg-white/10 rounded-md hover:bg-white/20"
        aria-label={darkModeState ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkModeState ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleMobileMenu} 
        className="md:hidden p-2"
        aria-label={mobileMenuState ? "Close menu" : "Open menu"}
      >
        {mobileMenuState ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
      </button>
    </div>
  );
}

// Separate component for mobile menu
export function MobileMenu() {
  if (!mobileMenuState) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        <Link href="/how-it-works">
          <Button variant="ghost" className="w-full text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            Timeline Estimator
          </Button>
        </Link>
        <Link href="/about-perm-process">
          <Button variant="ghost" className="w-full text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            About PERM
          </Button>
        </Link>
      </div>
    </div>
  );
} 