import { SavedHistoryItem } from '../../shared/types';

const STORAGE_KEY = 'gv_tag_history_v1';
const MAX_HISTORY_ITEMS = 20;

export function getLocalHistory(): SavedHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Failed to load local history from localStorage', error);
    return [];
  }
}

export function saveToLocalHistory(item: Omit<SavedHistoryItem, 'id' | 'timestamp'>): SavedHistoryItem {
  const current = getLocalHistory();
  const newItem: SavedHistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  // Remove duplicate entries with the exact same title if present
  const filtered = current.filter(h => h.title.toLowerCase().trim() !== item.title.toLowerCase().trim());
  const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save history item to localStorage', error);
  }

  return newItem;
}

export function deleteHistoryItem(id: string): SavedHistoryItem[] {
  const current = getLocalHistory();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete history item', error);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear local history', error);
  }
}
