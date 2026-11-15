import React from 'react';
import { Target, BookOpen, ShieldAlert, Zap, Globe, Layers } from 'lucide-react';

export const SeoGuideSection: React.FC = () => {
  return (
    <section id="about" className="py-12 sm:py-16 bg-slate-50/70 dark:bg-dark-900/30 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Creator Guide & SEO Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            How YouTube Tags Really Impact Video SEO
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            A practical guide to understanding video metadata, search discovery, and the YouTube algorithm.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                The Role of YouTube Video Tags
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              According to YouTube Creator documentation, video tags are especially useful when the content of your video is commonly misspelled or has multiple colloquial names. While tags carry less ranking weight than your video title or thumbnail, they provide critical context to YouTube's search and recommendation crawlers during the initial indexing phase.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                The 500-Character Constraint
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              YouTube Studio limits your video tags field to 500 total characters (including commas and spaces). Stuffing irrelevant tags can trigger spam flags. Our <strong>GV YouTube Tag Generator</strong> includes a built-in 500-character optimizer that ranks tags by relevance and keeps your output neatly within the threshold without cutting tags mid-word.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Lingual & Hinglish Optimization
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Millions of viewers search using localized phrases such as "kaise kare", "hindi me", or native scripts like Devanagari (हिंदी). Using our <strong>YouTube Tags Generator Hindi</strong> and regional filters ensures your gaming, education, or tech videos connect with specific regional search queries across India and globally.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Avoiding Misleading Metadata
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Never copy tags of popular creators (e.g. MrBeast or CarryMinati) if they are not in your video. YouTube’s Community Guidelines explicitly penalize misleading metadata. Always use accurate tags, clear titles, and honest descriptions that represent your actual video content.
            </p>
          </div>
        </div>

        {/* Niche spotlights: Minecraft & Gaming */}
        <div className="bg-gradient-to-r from-brand-50 to-amber-50 dark:from-dark-900 dark:to-dark-950 rounded-3xl p-6 sm:p-8 border border-brand-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-brand-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Specialized Minecraft & Gaming Video SEO
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Gaming titles like "Minecraft Survival Series Episode 1" require a blend of broad identifiers (<code>minecraft</code>, <code>minecraft gameplay</code>), version specifics (<code>bedrock edition</code>, <code>mcpe</code>), and episode intent (<code>minecraft episode 1 hindi</code>, <code>survival guide</code>). Our dedicated gaming keyword engine recognizes game entities to construct balanced metadata portfolios for creators.
          </p>
        </div>
      </div>
    </section>
  );
};
