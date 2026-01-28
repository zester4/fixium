import { useState, useEffect, useCallback } from 'react';
import type { RepairGuide } from '@/types/repair';

const STORAGE_KEY = 'fixflow_repair_history';
const MAX_HISTORY_ITEMS = 20;

export interface RepairHistoryItem {
  id: string;
  guide: RepairGuide;
  completedAt: number;
  rating?: number;
}

export function useRepairHistory() {
  const [history, setHistory] = useState<RepairHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load repair history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveHistory = useCallback((items: RepairHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setHistory(items);
    } catch (error) {
      console.error('Failed to save repair history:', error);
    }
  }, []);

  const addRepair = useCallback((guide: RepairGuide, rating?: number) => {
    const newItem: RepairHistoryItem = {
      id: `repair-${Date.now()}`,
      guide,
      completedAt: Date.now(),
      rating,
    };

    const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(updated);
    return newItem;
  }, [history, saveHistory]);

  const removeRepair = useCallback((id: string) => {
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  const updateRating = useCallback((id: string, rating: number) => {
    const updated = history.map(item =>
      item.id === id ? { ...item, rating } : item
    );
    saveHistory(updated);
  }, [history, saveHistory]);

  return {
    history,
    addRepair,
    removeRepair,
    clearHistory,
    updateRating,
  };
}
