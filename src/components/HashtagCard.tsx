import React, { useState } from 'react';
import { Hash, Copy, Check, Info } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface HashtagCardProps {
  hashtags: string[];
  onToast: (msg: string) => void;
}

export const HashtagCard: React.FC<HashtagCardProps> = ({ hashtags, onToast }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!hashtags || hashtags.length === 0) return null;

  const handleCopyAll = async () => {
    const text = hashtags.join(' ');
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedAll(true);
      onToast('All hashtags copied to clipboard!');
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopySingle = async (tag: string, index: number) => {
    const success = await copyToClipboard(tag);
    if (success) {
      setCopiedIndex(index);
      onToast(`Copied ${tag}`);
      setTimeout(() => setCopiedIndex(null), 1800);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-200/80 dark:border-slate-800 transition-all mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Relevant YouTube Hashtags
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {hashtags.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste these 3–5 hashtags into your video description.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 transition-colors shadow-sm"
        >
          {copiedAll ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copiedAll ? 'Copied All!' : 'Copy All Hashtags'}</span>
        </button>
      </div>

      {/* Hashtag Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {hashtags.map((ht, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleCopySingle(ht, idx)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-purple-600 dark:text-purple-400 font-semibold text-xs sm:text-sm hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all"
          >
            <span>{ht}</span>
            {copiedIndex === idx ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400 opacity-60 hover:opacity-100" />
            )}
          </button>
        ))}
      </div>

      {/* Distinction explanation banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-dark-950/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Important distinction:
          </span>{' '}
          YouTube <strong className="text-purple-600 dark:text-purple-400">Hashtags</strong> (prefixed with #) are placed inside your video description and appear above your video title as clickable topic links. Normal <strong className="text-brand-500">Video Tags</strong> are hidden metadata configured in YouTube Studio under "Show More" &gt; "Tags".
        </div>
      </div>
    </div>
  );
};
