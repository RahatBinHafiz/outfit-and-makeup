import React, { createContext, useContext, useEffect, useState } from 'react';
import { WardrobeItem, Occasion } from '@/types';

const STORAGE_KEY = 'stylesync_user_wardrobe_items';

const INITIAL_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'w-item-1',
    name: 'Burgundy Velvet Evening Gown',
    category: 'Gown',
    primaryColorHex: '#6E1E2C',
    pattern: 'Solid',
    fabric: 'Velvet',
    occasion: ['wedding', 'evening-formal', 'party'],
    style: 'Glamorous',
    notes: 'Floor length with subtle sweetheart neckline. Worn to annual galas.',
    dateAdded: '2026-08-10T14:30:00.000Z',
  },
  {
    id: 'w-item-2',
    name: 'Emerald Silk Banarasi Saree',
    category: 'Saree',
    primaryColorHex: '#0F6B4C',
    secondaryColorHex: '#D8AF3B',
    pattern: 'Embroidered',
    fabric: 'Silk',
    occasion: ['traditional', 'wedding'],
    style: 'Traditional',
    notes: 'Heirloom weave with rich golden zari borders.',
    dateAdded: '2026-08-14T09:15:00.000Z',
  },
  {
    id: 'w-item-3',
    name: 'Midnight Navy Tailored Blazer & Trouser',
    category: 'Jacket',
    primaryColorHex: '#1B2A4A',
    pattern: 'Solid',
    fabric: 'Wool',
    occasion: ['office', 'evening-formal'],
    style: 'Classic',
    notes: 'Sharp double-breasted cut with tortoiseshell buttons.',
    dateAdded: '2026-08-20T11:45:00.000Z',
  },
  {
    id: 'w-item-4',
    name: 'Blush Pink Chiffon Floral Maxi',
    category: 'Dress',
    primaryColorHex: '#F4C2CE',
    secondaryColorHex: '#8A9A86',
    pattern: 'Floral',
    fabric: 'Chiffon',
    occasion: ['everyday', 'date-night', 'wedding'],
    style: 'Boho',
    notes: 'Tiered skirt with delicate botanical peony print.',
    dateAdded: '2026-08-25T16:20:00.000Z',
  },
  {
    id: 'w-item-5',
    name: 'French Cream Satin Slip Dress',
    category: 'Dress',
    primaryColorHex: '#F3EDE2',
    pattern: 'Solid',
    fabric: 'Satin',
    occasion: ['date-night', 'party', 'everyday'],
    style: 'Modern Minimalist',
    notes: 'Bias-cut drape, versatile for daytime layering or evening heels.',
    dateAdded: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'w-item-6',
    name: 'Terracotta Linen Summer Abaya',
    category: 'Abaya',
    primaryColorHex: '#C25D30',
    pattern: 'Solid',
    fabric: 'Linen',
    occasion: ['everyday', 'office', 'traditional'],
    style: 'Classic',
    notes: 'Breathable structured linen with relaxed drape and wide cuffs.',
    dateAdded: '2026-09-05T13:10:00.000Z',
  },
];

interface WardrobeContextValue {
  items: WardrobeItem[];
  addItem: (item: Omit<WardrobeItem, 'id' | 'dateAdded'>) => WardrobeItem;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<WardrobeItem>) => void;
}

const WardrobeContext = createContext<WardrobeContextValue | undefined>(undefined);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_WARDROBE_ITEMS;
    } catch {
      return INITIAL_WARDROBE_ITEMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable
    }
  }, [items]);

  const addItem = (item: Omit<WardrobeItem, 'id' | 'dateAdded'>): WardrobeItem => {
    const newItem: WardrobeItem = {
      ...item,
      id: `wardrobe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      dateAdded: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<WardrobeItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  return (
    <WardrobeContext.Provider value={{ items, addItem, deleteItem, updateItem }}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
}
