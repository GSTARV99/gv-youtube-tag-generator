import React, { useState } from 'react';
import {
  Category,
  OutputLanguage,
  TargetAudience,
} from '../../shared/types';
import { Sparkles, AlertCircle, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';

interface GeneratorCardProps {
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
  category: Category;
  setCategory: (c: Category) => void;
  language: OutputLanguage;
  setLanguage: (l: OutputLanguage) => void;
  audience: TargetAudience;
  setAudience: (a: TargetAudience) => void;
  count: 10 | 20 | 30 | 40;
  setCount: (c: 10 | 20 | 30 | 40) => void;
  onGenerate: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const CATEGORIES: Category[] = [
  'Gaming',
  'Minecraft',
  'Education',
  'Technology',
  'Entertainment',
  'Vlogging',
  'Music',
  'Sports',
  'News',
  'Comedy',
  'Travel',
  'Fitness',
  'Food',
  'Other',
];

const LANGUAGES: OutputLanguage[] = [
  'Hindi',
  'English',
  'Hinglish',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Other',
];

const AUDIENCES: TargetAudience[] = ['India', 'Global', 'Custom'];
const TAG_COUNTS: (10 | 20 | 30 | 40)[] = [10, 20, 30, 40];

export const GeneratorCard: React.FC<GeneratorCardProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  language,
  setLanguage,
  audience,
  setAudience,
  count,
  setCount,
  onGenerate,
  isLoading,
  errorMessage,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div id="generator" className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      <div className="bg-white dark:bg-dark-900 rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 transition-all">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Title Input Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="video-title"
                className="block text-sm font-bold text-slate-800 dark:text-slate-100"
              >
                Video Title <span className="text-brand-500">*</span>
              </label>
              <span className={`text-xs ${title.length > 100 ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>
                {title.length}/100 chars
              </span>
            </div>

            <div className="relative">
              <input
                id="video-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your YouTube video title... (e.g., Minecraft Survival Series Episode 1 Hindi)"
                maxLength={150}
                className="w-full px-4 py-3.5 sm:py-4 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-base sm:text-lg transition-all pr-10 shadow-inner"
              />
              {title.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTitle('')}
                  aria-label="Clear title input"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-2.5 flex items-center gap-2 text-xs sm:text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Optional Video Description Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowDescription(!showDescription)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              <span>{showDescription ? 'Hide' : '+ Add'} Optional Video Description</span>
              {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDescription && (
              <div className="mt-2.5 animate-slide-up">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">
                    Provides extra context to generate more accurate long-tail keywords.
                  </span>
                  <span className="text-xs text-slate-400">{description.length}/1000</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste your video description or outline here for enhanced topic detection..."
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner resize-y"
                />
              </div>
            )}
          </div>

          {/* Configuration Grid: Category, Language, Audience, Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Category Dropdown */}
            <div>
              <label htmlFor="category-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Category
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Output Language Dropdown */}
            <div>
              <label htmlFor="language-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Output Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as OutputLanguage)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience Dropdown */}
            <div>
              <label htmlFor="audience-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Target Audience
              </label>
              <select
                id="audience-select"
                value={audience}
                onChange={(e) => setAudience(e.target.value as TargetAudience)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Tags Selector */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Number of Tags
              </span>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-dark-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {TAG_COUNTS.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setCount(cnt)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      count === cnt
                        ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prominent Generate Tags Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-rose-500 hover:from-brand-500 hover:to-rose-600 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 focus:outline-none focus:ring-4 focus:ring-brand-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.99] flex items-center justify-center gap-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Optimized Tags...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Generate Tags</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
