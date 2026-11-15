import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Video } from 'lucide-react';

interface HeroProps {
  onSelectExample: (title: string, category?: string, language?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectExample }) => {
  const exampleTitles = [
    { title: 'Minecraft Survival Series Episode 1 Hindi', category: 'Minecraft', language: 'Hindi' },
    { title: 'How to Learn Python in 2025 Complete Roadmap', category: 'Education', language: 'English' },
    { title: 'BGMI Best Sensitivity Settings & 1v4 Clutch Guide', category: 'Gaming', language: 'Hinglish' },
    { title: 'Top 10 Street Food Places in Delhi Vlog', category: 'Food', language: 'Hindi' },
  ];

  return (
    <section id="hero" className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[300px] bg-gradient-to-tr from-brand-500/10 via-rose-500/10 to-amber-500/10 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* SaaS Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>YouTube Tag & Keyword Optimizer 2025</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5">
          Generate YouTube Tags <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            in Seconds
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Enter your video title and discover relevant tags, keywords, and hashtags to help organize and optimize your YouTube videos.
        </p>

        {/* Example Title Suggestions */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Try clicking an example title:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {exampleTitles.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectExample(item.title, item.category, item.language)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sm transition-all text-left"
              >
                <Video className="w-3 h-3 text-brand-500 flex-shrink-0" />
                <span className="truncate max-w-[220px] sm:max-w-none">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Short Privacy Notice */}
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/40 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Privacy Guaranteed: Your video title is processed securely and never stored or shared with advertisers.</span>
        </div>
      </div>
    </section>
  );
};
