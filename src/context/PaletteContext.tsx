import React, { createContext, useContext, useEffect, useState } from 'react';
import { MakeupCombination, Occasion, SavedPalette } from '@/types';

const STORAGE_KEY = 'stylesync_saved_lookbook_palettes';

const DEFAULT_SAMPLE_SAVED: SavedPalette[] = [
  {
    id: 'sample-burgundy-party',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    name: 'Burgundy Gala & Rose Gold Lip',
    dressHexes: ['#6E1E2C'],
    dressName: 'Burgundy Velvet Gown',
    occasion: 'wedding',
    tags: ['Evening', 'Velvet', 'Romantic'],
    combination: {
      label: 'Elegant & Balanced',
      aesthetic: 'elegant',
      lipstick: {
        id: 'l-taupe-rose',
        name: 'Rose Taupe Nude',
        hex: '#AD7B72',
        family: 'nude',
        warmCool: 'neutral',
        intensity: 0.32,
      },
      blush: {
        id: 'b-soft-rose',
        name: 'Petal Rose',
        hex: '#DE8B95',
        family: 'rose',
        warmCool: 'cool',
        intensity: 0.36,
      },
      eyeshadow: {
        base: { id: 'e-soft-linen', name: 'Soft Linen', hex: '#F3E8D3', family: 'base', warmCool: 'warm', intensity: 0.12 },
        crease: { id: 'e-mauve-smoke', name: 'Smoky Mauve', hex: '#825867', family: 'crease', warmCool: 'cool', intensity: 0.6 },
        lid: { id: 'e-rose-quartz-lid', name: 'Rose Quartz', hex: '#E0B5B9', family: 'lid', warmCool: 'cool', intensity: 0.28 },
        shimmer: { id: 'e-rose-gold-shimmer', name: 'Starlight Rose Gold', hex: '#DCA28F', family: 'shimmer', warmCool: 'warm', intensity: 0.4 },
        outerCorner: { id: 'e-aubergine-outer', name: 'Midnight Plum', hex: '#3C1B33', family: 'outer-corner', warmCool: 'cool', intensity: 0.92 },
      },
      eyeliner: 'Satin deep plum gel liner with a delicate kitten flick',
      mascara: 'Volumizing clean black mascara lifting from the base',
      description: 'A poised pairing balancing luminous Rose Quartz eyelids with sculpted Petal Rose cheeks.',
      proTips: [
        'Blend the crease shade in windshield wiper motions for a seamless fade.',
        'Line lips with a matching pencil one shade deeper before applying lipstick.',
      ],
    },
  },
  {
    id: 'sample-emerald-traditional',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    name: 'Emerald Saree Festive Look',
    dressHexes: ['#0F6B4C', '#D8AF3B'],
    dressName: 'Emerald Silk Saree w/ Gold Zari',
    occasion: 'traditional',
    tags: ['Festive', 'Traditional', 'Gold Accents'],
    combination: {
      label: 'Bold & Glamorous',
      aesthetic: 'bold',
      lipstick: {
        id: 'l-crimson-royale',
        name: 'Crimson Royale',
        hex: '#A71C26',
        family: 'red',
        warmCool: 'warm',
        intensity: 0.82,
      },
      blush: {
        id: 'b-terracotta-glow',
        name: 'Terracotta Sun',
        hex: '#C86B4B',
        family: 'terracotta',
        warmCool: 'warm',
        intensity: 0.52,
      },
      eyeshadow: {
        base: { id: 'e-warm-sand', name: 'Warm Sand', hex: '#E0CBB0', family: 'base', warmCool: 'warm', intensity: 0.22 },
        crease: { id: 'e-warm-cacao', name: 'Warm Cacao', hex: '#7A5239', family: 'crease', warmCool: 'warm', intensity: 0.58 },
        lid: { id: 'e-champagne-silk-lid', name: 'Champagne Silk', hex: '#EADBB8', family: 'lid', warmCool: 'warm', intensity: 0.24 },
        shimmer: { id: 'e-gold-leaf-shimmer', name: '24K Gold Leaf', hex: '#D9AF3A', family: 'shimmer', warmCool: 'warm', intensity: 0.45 },
        outerCorner: { id: 'e-deep-emerald-outer', name: 'Deep Forest Pine', hex: '#163324', family: 'outer-corner', warmCool: 'cool', intensity: 0.88 },
      },
      eyeliner: 'Crisp jet-black winged liquid liner with graphic flick',
      mascara: 'Dramatic false-lash effect mascara with layered curl',
      description: 'Show-stopping look anchoring high-impact Crimson Royale lips with molten gold shimmer.',
      proTips: [
        'Set your bold lip with a single-ply tissue dust of translucent powder.',
        'Add a touch of gold highlighter to the cupid’s bow.',
      ],
    },
  },
];

interface PaletteContextValue {
  savedPalettes: SavedPalette[];
  savePalette: (
    dressHexes: string[],
    combination: MakeupCombination,
    name?: string,
    dressName?: string,
    occasion?: Occasion,
    tags?: string[]
  ) => SavedPalette;
  removePalette: (id: string) => void;
  renamePalette: (id: string, newName: string) => void;
  isSaved: (dressHexes: string[], combination: MakeupCombination) => boolean;
}

const PaletteContext = createContext<PaletteContextValue | undefined>(undefined);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_SAMPLE_SAVED;
    } catch {
      return DEFAULT_SAMPLE_SAVED;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPalettes));
    } catch {
      // Ignore storage errors
    }
  }, [savedPalettes]);

  const isSaved = (dressHexes: string[], combination: MakeupCombination) => {
    const hexKey = dressHexes.join(',').toUpperCase();
    return savedPalettes.some(
      (p) =>
        p.combination.aesthetic === combination.aesthetic &&
        p.combination.lipstick.name === combination.lipstick.name &&
        p.dressHexes.join(',').toUpperCase() === hexKey
    );
  };

  const savePalette = (
    dressHexes: string[],
    combination: MakeupCombination,
    name?: string,
    dressName?: string,
    occasion?: Occasion,
    tags?: string[]
  ): SavedPalette => {
    const existing = savedPalettes.find(
      (p) =>
        p.combination.aesthetic === combination.aesthetic &&
        p.combination.lipstick.name === combination.lipstick.name &&
        p.dressHexes.join(',').toUpperCase() === dressHexes.join(',').toUpperCase()
    );
    if (existing) return existing;

    const newPalette: SavedPalette = {
      id: `look-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      name: name || `${combination.label} Look · ${dressHexes[0]}`,
      dressHexes,
      dressName: dressName || 'Custom Outfit',
      combination,
      occasion,
      tags: tags || [combination.label, occasion || 'party'],
    };

    setSavedPalettes((prev) => [newPalette, ...prev]);
    return newPalette;
  };

  const removePalette = (id: string) => {
    setSavedPalettes((prev) => prev.filter((p) => p.id !== id));
  };

  const renamePalette = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setSavedPalettes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName.trim() } : p))
    );
  };

  return (
    <PaletteContext.Provider
      value={{ savedPalettes, savePalette, removePalette, renamePalette, isSaved }}
    >
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalettes() {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePalettes must be used within a PaletteProvider');
  }
  return context;
}
