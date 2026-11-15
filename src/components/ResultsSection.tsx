import React, { useState, useMemo } from 'react';
import { TagItem, TagRelevance } from '../../shared/types';
import { TagChip } from './TagChip';
import {
  Copy,
  Check,
  Download,
  RotateCw,
  Plus,
  SlidersHorizontal,
  CheckCheck,
  FileText,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { copyToClipboard, downloadTxtFile } from '../utils/clipboard';

interface ResultsSectionProps {
  tags: TagItem[];
  setTags: React.Dispatch<React.SetStateAction<TagItem[]>>;
  hashtags: string[];
  engineUsed: 'ai' | 'fallback_nlp';
  onRegenerate: () => void;
  isRegenerating: boolean;
  onToast: (msg: string) => void;
  title: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  tags,
  setTags,
  hashtags,
  engineUsed,
  onRegenerate,
  isRegenerating,
  onToast,
  title,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | TagRelevance>('all');
  const [youtubeLimitMode, setYoutubeLimitMode] = useState<boolean>(false);
  const [newTagText, setNewTagText] = useState('');
  const [copiedType, setCopiedType] = useState<'comma' | 'newline' | null>(null);

  // Compute 500-char optimized tags if youtubeLimitMode is on
  const optimizedTags = useMemo(() => {
    if (!youtubeLimitMode) return tags;

    // Prioritize Highly relevant > Related > Broad
    const sorted = [...tags].sort((a, b) => {
      const weight = { 'Highly relevant': 3, 'Related': 2, 'Broad': 1 };
      return weight[b.relevance] - weight[a.relevance];
    });

    const accepted: TagItem[] = [];
    let currentStr = '';

    for (const tag of sorted) {
      const candidate = currentStr ? `${currentStr}, ${tag.text}` : tag.text;
      if (candidate.length <= 500) {
        accepted.push(tag);
        currentStr = candidate;
      }
    }
    return accepted;
  }, [tags, youtubeLimitMode]);

  const displayedTags = useMemo(() => {
    const base = youtubeLimitMode ? optimizedTags : tags;
    if (activeFilter === 'all') return base;
    return base.filter((t) => t.relevance === activeFilter);
  }, [tags, optimizedTags, youtubeLimitMode, activeFilter]);

  // Character stats for comma-separated string
  const currentTagsForCopy = youtubeLimitMode ? optimizedTags : tags;
  const commaSeparatedString = currentTagsForCopy.map((t) => t.text).join(', ');
  const newlineSeparatedString = currentTagsForCopy.map((t) => t.text).join('\n');
  const characterCount = commaSeparatedString.length;

  const handleCopyComma = async () => {
    const success = await copyToClipboard(commaSeparatedString);
    if (success) {
      setCopiedType('comma');
      onToast(`Copied ${currentTagsForCopy.length} tags (comma-separated)`);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const handleCopyNewline = async () => {
    const success = await copyToClipboard(newlineSeparatedString);
    if (success) {
      setCopiedType('newline');
      onToast(`Copied ${currentTagsForCopy.length} tags (line-by-line)`);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const content = `GV YouTube Tag Generator Export
Title: ${title}
Generated: ${new Date().toLocaleString()}
Character Count: ${characterCount} (Target: 500)
----------------------------------------
COMMA-SEPARATED TAGS:
${commaSeparatedString}

----------------------------------------
LINE-BY-LINE TAGS:
${newlineSeparatedString}

----------------------------------------
RECOMMENDED HASHTAGS:
${hashtags.join(' ')}
`;
    const filename = `youtube-tags-${title.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30) || 'video'}.txt`;
    downloadTxtFile(filename, content);
    onToast('Downloaded tags as .txt file');
  };

  const handleRemoveTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTag = (id: string, newText: string) => {
    setTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
    onToast(`Tag updated to "${newText}"`);
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagText.trim().toLowerCase();
    if (!clean) return;

    if (tags.some((t) => t.text === clean)) {
      onToast(`Tag "${clean}" already exists`);
      return;
    }

    const newTag: TagItem = {
      id: `custom-${Date.now()}`,
      text: clean,
      relevance: 'Highly relevant',
      source: 'user',
    };

    setTags((prev) => [newTag, ...prev]);
    setNewTagText('');
    onToast(`Added custom tag "${clean}"`);
  };

  const counts = {
    all: currentTagsForCopy.length,
    high: currentTagsForCopy.filter((t) => t.relevance === 'Highly relevant').length,
    related: currentTagsForCopy.filter((t) => t.relevance === 'Related').length,
    broad: currentTagsForCopy.filter((t) => t.relevance === 'Broad').length,
  };

  return (
    <div id="results" className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-8 animate-fade-in">
      <div className="bg-white dark:bg-dark-900 rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 transition-all">
        {/* Top Bar: Title, Count, Engine Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Generated Tags
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-900/60">
              {displayedTags.length} {displayedTags.length === 1 ? 'tag' : 'tags'}
            </span>

            {/* Engine indicator */}
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                engineUsed === 'ai'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              }`}
              title={
                engineUsed === 'ai'
                  ? 'Tags powered by secure server-side AI model'
                  : 'Tags generated by local linguistic multi-lingual NLP engine'
              }
            >
              {engineUsed === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
              <span>{engineUsed === 'ai' ? 'AI Optimized' : 'Multi-lingual NLP Engine'}</span>
            </span>
          </div>

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Tags'}</span>
          </button>
        </div>

        {/* YouTube 500-Character Constraint Controller */}
        <div className="py-4 my-2 px-4 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200/70 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={youtubeLimitMode}
              onClick={() => setYoutubeLimitMode(!youtubeLimitMode)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                youtubeLimitMode ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  youtubeLimitMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                YouTube-Ready 500-Character Mode
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {youtubeLimitMode
                  ? 'Automatically trims lower-priority tags to fit YouTube Studio limit cleanly.'
                  : 'Normal mode: show all generated tags without truncating to 500 characters.'}
              </p>
            </div>
          </div>

          {/* Character Progress Bar */}
          <div className="flex flex-col sm:items-end min-w-[200px]">
            <div className="flex items-center justify-between w-full text-xs font-bold mb-1">
              <span className="text-slate-500 dark:text-slate-400">Tag Field Length:</span>
              <span
                className={
                  characterCount > 500
                    ? 'text-rose-600 font-extrabold'
                    : characterCount > 450
                    ? 'text-amber-500 font-extrabold'
                    : 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                }
              >
                {characterCount} / 500 chars
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  characterCount > 500
                    ? 'bg-rose-500'
                    : characterCount > 450
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (characterCount / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: Copy All, Newline, TXT Download */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 pb-4">
          <button
            type="button"
            onClick={handleCopyComma}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
          >
            {copiedType === 'comma' ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'comma' ? 'Copied Comma-Separated!' : 'Copy Tags (Comma-Separated)'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyNewline}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors"
          >
            {copiedType === 'newline' ? <Check className="w-4 h-4 text-emerald-500" /> : <FileText className="w-4 h-4" />}
            <span>{copiedType === 'newline' ? 'Copied One Per Line!' : 'Copy One Per Line'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors"
            title="Download tags as TXT file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download .TXT</span>
          </button>
        </div>

        {/* Filter Pills and Add Custom Tag Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 pb-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('Highly relevant')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'Highly relevant'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              Highly Relevant ({counts.high})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('Related')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'Related'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
              }`}
            >
              Related ({counts.related})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('Broad')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'Broad'
                  ? 'bg-slate-700 text-white dark:bg-slate-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Broad ({counts.broad})
            </button>
          </div>

          {/* Add Custom Tag Form */}
          <form onSubmit={handleAddCustomTag} className="flex items-center gap-1.5">
            <input
              type="text"
              value={newTagText}
              onChange={(e) => setNewTagText(e.target.value)}
              placeholder="Add your own tag..."
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 w-36 sm:w-44"
            />
            <button
              type="submit"
              disabled={!newTagText.trim()}
              className="p-1.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors"
              title="Add custom tag"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Tags Chips Display */}
        <div className="flex flex-wrap gap-2 pt-2">
          {displayedTags.length > 0 ? (
            displayedTags.map((tag) => (
              <TagChip
                key={tag.id}
                tag={tag}
                onRemove={handleRemoveTag}
                onEdit={handleEditTag}
                onToast={onToast}
              />
            ))
          ) : (
            <div className="w-full text-center py-8 text-sm text-slate-400">
              No tags match the selected filter. Try selecting "All" or adding custom tags.
            </div>
          )}
        </div>

        {/* Educational Note on YouTube Studio */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>
            Tip: Click <strong>"Copy Tags (Comma-Separated)"</strong> and paste directly into the "Tags" box inside YouTube Studio.
          </span>
          <span className="font-semibold text-slate-400">
            {currentTagsForCopy.length} tags ready
          </span>
        </div>
      </div>
    </div>
  );
};
