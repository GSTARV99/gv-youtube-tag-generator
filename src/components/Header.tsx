import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Sparkles, Hash, BookOpen, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-dark-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo('hero')}
              className="group flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-rose-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-black tracking-tighter text-lg">GV</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                  GV <span className="text-brand-500">Tags</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                  YouTube Tag Generator
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollTo('hero')}
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('generator')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              Tag Generator
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              About
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              FAQ
            </button>
          </nav>

          {/* Right Action: Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-1 bg-white/95 dark:bg-dark-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg animate-fade-in">
          <button
            onClick={() => scrollTo('hero')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('generator')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Tag Generator
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            About YouTube SEO
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </button>
        </div>
      )}
    </header>
  );
};
