import { DressColor } from '@/types';
import { classifyWarmCool } from '@/utils/colorUtils';

const rawPresetColors: Array<Omit<DressColor, 'warmCool'>> = [
  {
    id: 'burgundy',
    name: 'Burgundy',
    hex: '#6E1E2C',
    family: 'Red & Berry',
    description: 'Deep, rich wine tone with luxurious evening elegance.',
    suggestedOccasions: ['wedding', 'evening-formal', 'party'],
  },
  {
    id: 'wine',
    name: 'Cabernet Wine',
    hex: '#4A1525',
    family: 'Red & Berry',
    description: 'Ultra-deep velvety red with dramatic mood.',
    suggestedOccasions: ['evening-formal', 'date-night'],
  },
  {
    id: 'ruby-red',
    name: 'Ruby Red',
    hex: '#B21E35',
    family: 'Red & Berry',
    description: 'Vibrant true crimson with romantic intensity.',
    suggestedOccasions: ['party', 'wedding', 'date-night'],
  },
  {
    id: 'maroon',
    name: 'Maroon',
    hex: '#58181F',
    family: 'Red & Berry',
    description: 'Classic earthy deep red, stately and traditional.',
    suggestedOccasions: ['traditional', 'wedding'],
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    hex: '#0F6B4C',
    family: 'Green',
    description: 'Regal jewel-tone green symbolizing prosperity and poise.',
    suggestedOccasions: ['wedding', 'evening-formal', 'party'],
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    hex: '#1E3F2E',
    family: 'Green',
    description: 'Deep pine shade with calming, timeless depth.',
    suggestedOccasions: ['office', 'evening-formal', 'everyday'],
  },
  {
    id: 'sage-green',
    name: 'Sage Green',
    hex: '#8A9A86',
    family: 'Green',
    description: 'Earthy botanical pastel, fresh and romantic.',
    suggestedOccasions: ['wedding', 'everyday', 'office'],
  },
  {
    id: 'olive',
    name: 'Warm Olive',
    hex: '#6B682D',
    family: 'Green',
    description: 'Mediterranean olive with warm golden undertones.',
    suggestedOccasions: ['office', 'everyday', 'party'],
  },
  {
    id: 'navy',
    name: 'Navy Blue',
    hex: '#1B2A4A',
    family: 'Blue',
    description: 'Timeless midnight blue, universally flattering and sharp.',
    suggestedOccasions: ['office', 'wedding', 'evening-formal'],
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    hex: '#244AB2',
    family: 'Blue',
    description: 'High-energy vivid sapphire with regal presence.',
    suggestedOccasions: ['party', 'wedding', 'traditional'],
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    hex: '#8BBFE5',
    family: 'Blue',
    description: 'Airy serene pastel that breathes lightness.',
    suggestedOccasions: ['everyday', 'office', 'wedding'],
  },
  {
    id: 'teal',
    name: 'Peacock Teal',
    hex: '#167B80',
    family: 'Blue',
    description: 'Rich ocean green-blue with eye-catching brilliance.',
    suggestedOccasions: ['party', 'traditional', 'wedding'],
  },
  {
    id: 'blush-pink',
    name: 'Blush Pink',
    hex: '#F4C2CE',
    family: 'Pink',
    description: 'Soft petal pink, delicate, feminine and tender.',
    suggestedOccasions: ['wedding', 'date-night', 'everyday'],
  },
  {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    hex: '#C08497',
    family: 'Pink',
    description: 'Sophisticated antique rose with muted grey undertones.',
    suggestedOccasions: ['wedding', 'office', 'date-night'],
  },
  {
    id: 'hot-pink',
    name: 'Fuchsia Glow',
    hex: '#E0317D',
    family: 'Pink',
    description: 'Vibrant electrifying pink for show-stopping style.',
    suggestedOccasions: ['party', 'traditional'],
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    hex: '#C8B6E2',
    family: 'Purple',
    description: 'Ethereal lilac-violet with soft daydream charm.',
    suggestedOccasions: ['wedding', 'everyday', 'date-night'],
  },
  {
    id: 'deep-purple',
    name: 'Royal Plum',
    hex: '#4A2154',
    family: 'Purple',
    description: 'Opulent dark amethyst with luxurious mystique.',
    suggestedOccasions: ['evening-formal', 'wedding'],
  },
  {
    id: 'mustard',
    name: 'Mustard Yellow',
    hex: '#D9A426',
    family: 'Yellow & Gold',
    description: 'Warm spicy saffron with vibrant vintage warmth.',
    suggestedOccasions: ['traditional', 'party', 'everyday'],
  },
  {
    id: 'butter-yellow',
    name: 'Butter Yellow',
    hex: '#FFE58F',
    family: 'Yellow & Gold',
    description: 'Sunny gentle pastel, luminous and cheerful.',
    suggestedOccasions: ['everyday', 'wedding'],
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    hex: '#C25D30',
    family: 'Orange & Rust',
    description: 'Sun-baked clay earth tone, grounded and chic.',
    suggestedOccasions: ['party', 'everyday', 'date-night'],
  },
  {
    id: 'coral',
    name: 'Warm Coral',
    hex: '#F0684C',
    family: 'Orange & Rust',
    description: 'Energizing sunset tone blending peach and vivid orange.',
    suggestedOccasions: ['party', 'wedding', 'everyday'],
  },
  {
    id: 'rust',
    name: 'Autumn Rust',
    hex: '#984323',
    family: 'Orange & Rust',
    description: 'Deep burnt sienna with warm autumnal richness.',
    suggestedOccasions: ['evening-formal', 'office', 'everyday'],
  },
  {
    id: 'classic-black',
    name: 'Obsidian Black',
    hex: '#18181A',
    family: 'Neutrals',
    description: 'The ultimate canvas of modern drama and chic minimalism.',
    suggestedOccasions: ['party', 'evening-formal', 'office', 'date-night'],
  },
  {
    id: 'ivory',
    name: 'Soft Ivory',
    hex: '#FAF6EE',
    family: 'Neutrals',
    description: 'Luminous warm off-white, bridal, graceful and pure.',
    suggestedOccasions: ['wedding', 'everyday', 'office'],
  },
  {
    id: 'champagne',
    name: 'Champagne Gold',
    hex: '#EAD7B2',
    family: 'Neutrals',
    description: 'Subtle metallic beige with glistening festive luxury.',
    suggestedOccasions: ['wedding', 'evening-formal', 'party'],
  },
  {
    id: 'charcoal',
    name: 'Slate Charcoal',
    hex: '#3E3E42',
    family: 'Neutrals',
    description: 'Refined architectural gray, sleek and contemporary.',
    suggestedOccasions: ['office', 'everyday', 'evening-formal'],
  },
  {
    id: 'cream',
    name: 'French Cream',
    hex: '#F3EDE2',
    family: 'Neutrals',
    description: 'Velvety neutral white that softens every complexion.',
    suggestedOccasions: ['wedding', 'office', 'everyday'],
  },
  {
    id: 'camel',
    name: 'Warm Camel',
    hex: '#B78252',
    family: 'Neutrals',
    description: 'Sophisticated luxury neutral, quiet wealth aesthetic.',
    suggestedOccasions: ['office', 'everyday'],
  },
];

export const dressColors: DressColor[] = rawPresetColors.map((c) => ({
  ...c,
  warmCool: classifyWarmCool(c.hex),
}));

export function findDressColorByHex(hex: string): DressColor | undefined {
  const norm = hex.trim().toLowerCase();
  return dressColors.find((c) => c.hex.toLowerCase() === norm);
}

export function searchDressColors(query: string): DressColor[] {
  const q = query.trim().toLowerCase();
  if (!q) return dressColors;
  return dressColors.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.family.toLowerCase().includes(q) ||
      c.hex.toLowerCase().includes(q)
  );
}
