export type WarmCool = 'warm' | 'cool' | 'neutral';

export type Aesthetic = 'soft' | 'elegant' | 'bold';

export type Occasion =
  | 'everyday'
  | 'office'
  | 'party'
  | 'wedding'
  | 'date-night'
  | 'traditional'
  | 'evening-formal';

export type UndertoneOption = 'warm' | 'cool' | 'neutral' | 'unspecified';

export type MakeupIntensity = 'light' | 'medium' | 'full';

export interface Shade {
  id: string;
  name: string;
  hex: string;
  family: string; // e.g. "nude", "pink", "coral", "red", "brown", "berry", "mauve", "peach"
  warmCool: WarmCool;
  /** 0 = very light/sheer, 1 = very deep/bold */
  intensity: number;
  finish?: 'matte' | 'satin' | 'gloss' | 'shimmer' | 'metallic';
  description?: string;
}

export interface DressColor {
  id: string;
  name: string;
  hex: string;
  family: string;
  warmCool: WarmCool;
  description?: string;
  suggestedOccasions?: Occasion[];
}

export type AccessoryCategory = 'shoes' | 'handbag' | 'jewelry' | 'belt' | 'hijab-scarf';

export interface AccessoryColor {
  id: string;
  name: string;
  hex: string;
  category: AccessoryCategory;
  relation: 'matching' | 'contrasting' | 'neutral';
  accentMaterial?: string;
}

export interface SwatchResult {
  shade: Shade;
  score: number;
  reason: string;
  harmonyType?: 'analogous' | 'complementary' | 'monochromatic' | 'neutral' | 'triadic';
}

export interface AccessorySwatchResult {
  color: AccessoryColor;
  reason: string;
}

export interface EyeshadowLook {
  base: Shade;
  crease: Shade;
  lid: Shade;
  shimmer: Shade;
  outerCorner: Shade;
}

export interface MakeupCombination {
  label: string;
  aesthetic: Aesthetic;
  lipstick: Shade;
  eyeshadow: EyeshadowLook;
  blush: Shade;
  eyeliner: string;
  mascara: string;
  description: string;
  proTips: string[];
}

export interface ColorMatchOptions {
  dressHexes: string[];
  occasion?: Occasion;
  aesthetic?: Aesthetic;
  undertone?: UndertoneOption;
  category?: string;
  intensity?: MakeupIntensity;
}

export interface ColorMatchResult {
  dressHexes: string[];
  lipstick: SwatchResult[];
  eyeshadow: SwatchResult[];
  blush: SwatchResult[];
  accessories: AccessorySwatchResult[];
  combinations: MakeupCombination[];
  dominantTemp: WarmCool;
  harmonyAnalysis: {
    title: string;
    description: string;
    temperatureVerdict: string;
  };
}

export interface CompleteLook extends ColorMatchResult {
  hairstyle: string;
  shoes: AccessorySwatchResult;
  handbag: AccessorySwatchResult;
  jewelry: AccessorySwatchResult;
  belt?: AccessorySwatchResult;
  hijabOrScarf?: AccessorySwatchResult;
  stylingTips: string[];
  occasionFitNote: string;
}

export interface SavedPalette {
  id: string;
  createdAt: string;
  name: string;
  dressHexes: string[];
  dressName?: string;
  combination: MakeupCombination;
  occasion?: Occasion;
  tags?: string[];
}

export type WardrobeCategory = 'Dress' | 'Gown' | 'Saree' | 'Salwar' | 'Top' | 'Bottom' | 'Jacket' | 'Abaya' | 'Skirt' | string;
export type WardrobePattern = 'Solid' | 'Floral' | 'Striped' | 'Polka Dot' | 'Abstract' | 'Embroidered' | 'Geometric' | string;
export type WardrobeFabric = 'Silk' | 'Cotton' | 'Chiffon' | 'Velvet' | 'Linen' | 'Satin' | 'Georgette' | 'Wool' | string;
export type WardrobeStyle = 'Classic' | 'Boho' | 'Modern Minimalist' | 'Traditional' | 'Glamorous' | 'Casual Chic' | string;

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  primaryColorHex: string;
  secondaryColorHex?: string;
  pattern: WardrobePattern;
  fabric: WardrobeFabric;
  occasion: Occasion[];
  style: WardrobeStyle;
  imageUrl?: string;
  notes?: string;
  dateAdded: string;
}

export interface UserProfile {
  name: string;
  preferredColors: string[];
  favoriteStyles: string[];
  preferredIntensity: MakeupIntensity;
  modestFashion: boolean;
  defaultUndertone: UndertoneOption;
}
