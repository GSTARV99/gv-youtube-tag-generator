import React, { useState } from 'react';
import { TitleAnalysisResult, SeoSuggestionsResult } from '../../shared/types';
import { Search, Lightbulb, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface TitleAnalyzerCardProps {
  analysis?: TitleAnalysisResult;
  seoSuggestions?: SeoSuggestionsResult;
  onSelectTitleVariation?: (title: string) => void;
  onToast: (msg: string) => void;
}

export const TitleAnalyzerCard: React.FC<TitleAnalyzerCardProps> = ({
  analysis,
  seoSuggestions,
  onSelectTitleVariation,
  onToast,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);

  if (!analysis || !seoSuggestions) return null;

  const handleCopyVariation = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedTitleIndex(index);
      onToast('Title variation copied to clipboard!');
      setTimeout(() => setCopiedTitleIndex(null), 1800);
    }
  };

  return (
    <div id="analyzer" className="bg-white dark:bg-dark-900 rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-200/80 dark:border-slate-800 transition-all mt-6">
      {/* Header Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Title Keyword Analyzer & SEO Suggestions
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Optional Insight
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluate title clarity, keyword density, and descriptive strength.
            </p>
          </div>
        </div>
        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-fade-in">
          {/* Main Topic & Clarity Meter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detected Main Topic
              </span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white capitalize mt-1">
                {analysis.mainTopic || 'General Topic'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-950 border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Title Clarity Score
                </span>
                <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                  {analysis.clarityScore}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2.5">
                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${analysis.clarityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Keywords and Ambiguity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Extracted Keywords */}
            <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-dark-950/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                <Search className="w-3.5 h-3.5 text-brand-500" />
                <span>Important Detected Keywords</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.importantKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Ambiguous Words (if any) */}
            <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-dark-950/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Potentially Ambiguous Words</span>
              </div>
              {analysis.ambiguousWording.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.ambiguousWording.map((aw, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300"
                    >
                      {aw}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  No vague clickbait or ambiguous words detected.
                </span>
              )}
            </div>
          </div>

          {/* Descriptive Title Variations */}
          {seoSuggestions.titleVariations.length > 0 && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Descriptive Title Variations (Suggested)
              </span>
              <div className="space-y-2">
                {seoSuggestions.titleVariations.map((variation, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <span className="truncate">{variation}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {onSelectTitleVariation && (
                        <button
                          type="button"
                          onClick={() => onSelectTitleVariation(variation)}
                          className="px-2 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-lg transition-colors"
                        >
                          Use This
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCopyVariation(variation, idx)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title="Copy title"
                      >
                        {copiedTitleIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Alignment Tips */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              SEO Alignment Recommendations:
            </span>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700 dark:text-slate-300">
              {seoSuggestions.metadataAlignmentTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 italic">
              * Note: These are advisory suggestions. Tags and titles help categorize content, but viewer engagement and retention are YouTube's primary ranking factors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
