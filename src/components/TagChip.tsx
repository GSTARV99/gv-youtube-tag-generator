import React, { useState } from 'react';
import { TagItem, TagRelevance } from '../../shared/types';
import { Copy, Check, X, Edit2, CheckCircle2 } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface TagChipProps {
  tag: TagItem;
  onRemove: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onToast: (msg: string) => void;
}

const RELEVANCE_STYLES: Record<TagRelevance, { badge: string; border: string; bg: string }> = {
  'Highly relevant': {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
  },
  'Related': {
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800/60',
    bg: 'bg-sky-50/40 dark:bg-sky-950/20',
  },
  'Broad': {
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-800',
    bg: 'bg-white dark:bg-dark-900',
  },
};

export const TagChip: React.FC<TagChipProps> = ({ tag, onRemove, onEdit, onToast }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tag.text);

  const style = RELEVANCE_STYLES[tag.relevance] || RELEVANCE_STYLES['Related'];

  const handleCopy = async () => {
    const success = await copyToClipboard(tag.text);
    if (success) {
      setCopied(true);
      onToast(`Copied "${tag.text}" to clipboard`);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim().toLowerCase();
    if (trimmed && trimmed !== tag.text) {
      onEdit(tag.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditText(tag.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all hover:shadow-sm ${style.border} ${style.bg}`}
    >
      {isEditing ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-28 sm:w-36 px-1.5 py-0.5 text-xs rounded bg-white dark:bg-dark-950 border border-brand-500 text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSaveEdit}
            title="Save changes"
            className="p-0.5 text-emerald-600 hover:text-emerald-700"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditText(tag.text);
              setIsEditing(false);
            }}
            title="Cancel"
            className="p-0.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          <span className="text-slate-800 dark:text-slate-200 select-all">{tag.text}</span>

          {/* Relevance pill */}
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${style.badge}`}>
            {tag.relevance === 'Highly relevant' ? 'High' : tag.relevance}
          </span>

          {/* Actions: Copy, Edit, Remove */}
          <div className="flex items-center gap-0.5 ml-1">
            <button
              type="button"
              onClick={handleCopy}
              title={`Copy "${tag.text}"`}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Edit tag"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(tag.id)}
              title="Remove tag"
              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
