import React from 'react';
import { Type, Sliders, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Video Title',
      desc: 'Type your YouTube video title or paste a draft headline. Add an optional description to uncover targeted long-tail phrases.',
      icon: Type,
      color: 'from-brand-500 to-rose-500',
    },
    {
      step: '02',
      title: 'Choose Language & Category',
      desc: 'Select your niche (Gaming, Education, Tech, Food, etc.) and target language (English, Hindi, Hinglish, Bengali, Tamil, etc.).',
      icon: Sliders,
      color: 'from-amber-500 to-rose-500',
    },
    {
      step: '03',
      title: 'Review, Edit & Copy',
      desc: 'Get highly relevant tags, optimize for the 500-character YouTube limit, customize individual tags, and copy with one click.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-slate-100/60 dark:bg-dark-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            How It Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Generate clean, topic-accurate YouTube tags and hashtags in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-white dark:bg-dark-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md shadow-brand-500/20`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
