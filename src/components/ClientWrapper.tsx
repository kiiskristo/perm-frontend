'use client';

import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ClientWrapperProps {
  children: ReactNode;
}

// Create context for app state
interface AppContextType {
  darkMode: boolean | null;
  setDarkMode: (value: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the app context
function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
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

  const contextValue: AppContextType = {
    darkMode,
    setDarkMode,
    mobileMenuOpen,
    setMobileMenuOpen,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Separate component for navigation controls
export function NavControls() {
  const { darkMode, setDarkMode, mobileMenuOpen, setMobileMenuOpen } = useAppContext();

  const toggleDarkMode = () => {
    if (darkMode !== null) {
      const newMode = !darkMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      localStorage.setItem('theme-mode-override', 'true');
      document.documentElement.classList.toggle('dark', newMode);
      setDarkMode(newMode);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode} 
        className="p-2 bg-white/10 rounded-md hover:bg-white/20"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleMobileMenu} 
        className="md:hidden p-2"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
      </button>
    </div>
  );
}

// Separate component for mobile menu
export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useAppContext();

  if (!mobileMenuOpen) return null;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        <Link href="/how-it-works" onClick={closeMobileMenu}>
          <Button variant="ghost" className="w-full text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            Timeline Estimator
          </Button>
        </Link>
        <Link href="/about-perm-process" onClick={closeMobileMenu}>
          <Button variant="ghost" className="w-full text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
            About PERM
          </Button>
        </Link>
      </div>
    </div>
  );
} 