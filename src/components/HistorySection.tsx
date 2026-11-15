import React, { useState } from 'react';
import { SavedHistoryItem } from '../../shared/types';
import { History, Trash2, ArrowUpRight, Copy, Check, AlertCircle } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface HistorySectionProps {
  history: SavedHistoryItem[];
  onLoadItem: (item: SavedHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onToast: (msg: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
  onToast,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (history.length === 0) return null;

  const handleCopyTags = async (item: SavedHistoryItem) => {
    const text = item.tags.map((t) => t.text).join(', ');
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(item.id);
      onToast(`Copied ${item.tags.length} tags from history`);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      <div className="bg-white dark:bg-dark-900 rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-200/80 dark:border-slate-800 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Recent Generation History
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {history.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Saved locally on your device (cleared when browser cache is deleted).
              </p>
            </div>
          </div>

          <div>
            {showClearConfirm ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="text-xs text-rose-500 font-semibold hidden sm:inline">Clear all?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                    onToast('History cleared');
                  }}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-500 transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-dark-950/40 px-2 rounded-xl transition-colors"
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-sm">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {item.language} • {item.tags.length} tags • {formatTime(item.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xl">
                  {item.tags.slice(0, 5).map((t) => t.text).join(', ')}
                  {item.tags.length > 5 ? '...' : ''}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyTags(item)}
                  title="Copy tags"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLoadItem(item)}
                  title="Load tags into generator"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  title="Delete entry"
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
