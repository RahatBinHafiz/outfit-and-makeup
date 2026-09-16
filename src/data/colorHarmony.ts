export type HarmonyType =
  | 'analogous'
  | 'complementary'
  | 'monochromatic'
  | 'neutral'
  | 'triadic';

export interface HarmonyRule {
  type: HarmonyType;
  label: string;
  subtitle: string;
  description: string;
  fashionPhilosophy: string;
  hueOffsets: number[];
  tolerance: number;
}

export const harmonyRules: HarmonyRule[] = [
  {
    type: 'analogous',
    label: 'Analogous Harmony',
    subtitle: 'Adjacent hues (30° apart)',
    description:
      'Combines shades that sit directly beside one another on the color wheel. This creates a visually soothing, cohesive aesthetic with subtle, fluid color transitions.',
    fashionPhilosophy:
      'Ideal for chic daytime outfits, romantic wedding guest dresses, and graceful floral ensembles where you want gentle cohesion rather than jarring contrast.',
    hueOffsets: [-30, 0, 30],
    tolerance: 25,
  },
  {
    type: 'complementary',
    label: 'Complementary Harmony',
    subtitle: 'Opposite hues (180° apart)',
    description:
      'Pairs colors positioned directly opposite each other on the 360° color wheel. Each hue intensifies the perceived vibrancy of the other, generating electric optical energy.',
    fashionPhilosophy:
      'Creates show-stopping evening wear and high-fashion editorial presence. For example, pairing navy with warm terracotta or emerald green with berry wine.',
    hueOffsets: [180],
    tolerance: 30,
  },
  {
    type: 'monochromatic',
    label: 'Monochromatic Harmony',
    subtitle: 'Unified hue across light & dark',
    description:
      'Explores multiple tints, tones, and shades of a single base hue. It produces a seamless, elongated visual line with understated luxury.',
    fashionPhilosophy:
      'The secret weapon of Parisian and quiet-luxury styling. A burgundy dress paired with rose-tinted blush and deep berry lipstick feels regal and curated.',
    hueOffsets: [0],
    tolerance: 12,
  },
  {
    type: 'triadic',
    label: 'Triadic Harmony',
    subtitle: 'Evenly spaced trio (120° apart)',
    description:
      'Selects three colors equidistant on the wheel (120° intervals). It offers rich visual balance with diverse color families without clashing.',
    fashionPhilosophy:
      'Perfect for colorful traditional wear (sarees, lehengas, festive kaftans) and vibrant festival attire where joyful multi-hued harmony is desired.',
    hueOffsets: [120, 240],
    tolerance: 20,
  },
  {
    type: 'neutral',
    label: 'Neutral & Tonal Balance',
    subtitle: 'Foundational earth & mineral tones',
    description:
      'Anchors any vibrant or patterned dress with low-saturation creams, tans, slates, and chocolates. Provides visual breathing room and high elegance.',
    fashionPhilosophy:
      'The safest and most reliable pairing for bold dresses. When your dress is doing the talking, neutral makeup and accessories let the garment shine.',
    hueOffsets: [],
    tolerance: 360,
  },
];
