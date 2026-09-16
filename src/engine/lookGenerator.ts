import { Aesthetic, CompleteLook, Occasion, UndertoneOption } from '@/types';
import { matchDressColor } from '@/engine/colorEngine';

const HAIRSTYLE_MATRIX: Record<Aesthetic, Record<Occasion, string>> = {
  soft: {
    everyday: 'Tousled air-dried waves with face-framing natural pieces',
    office: 'Low polished ponytail wrapped with a subtle silk hairband',
    party: 'Textured half-up twist with loose romantic tendrils',
    wedding: 'Soft romantic low chignon adorned with fresh baby’s breath or pearl pins',
    'date-night': 'Voluminous bouncy blowout with a soft side parting',
    traditional: 'Braided low bun wrapped with jasmine flowers or delicate gold lace',
    'evening-formal': 'Relaxed French twist with wispy temple tendrils',
  },
  elegant: {
    everyday: 'Glossy sleek low bun with a clean center part',
    office: 'Architectural structured French twist or neat ballerina bun',
    party: 'Hollywood glam waves cascading over one shoulder',
    wedding: 'Intricate crown braid updo or sculptural sleek chignon',
    'date-night': 'Half-up crown with sleek reflective shine and softly curled ends',
    traditional: 'Classic coiled braided bun accented with a statement maang tikka or gold comb',
    'evening-formal': 'Sleek sculpted high bun with glass-hair finish',
  },
  bold: {
    everyday: 'High snatch ponytail with sleek flyaways tamed',
    office: 'Sharp glass-hair blunt bob or high structured knot',
    party: 'Big disco-volumized bouncy curls or wet-look pushed back styling',
    wedding: 'Dramatic sculpted high updo with architectural tendrils',
    'date-night': 'Sleek deep-side swept liquid hair with crystal hair clips',
    traditional: 'Crown-braided statement bun featuring ornate hair jewelry and golden pins',
    'evening-formal': 'Ultra-sleek waist-length ponytail or modern wet-look combed back',
  },
};

const OUTFIT_STYLING_NOTES: Record<Aesthetic, (category: string, occasion: string) => string> = {
  soft: (category, occasion) =>
    `Style your ${category.toLowerCase()} with airy, fluid layering. Pair with delicate whisper-thin jewelry and minimalist footwear to keep the look effortless for ${occasion}.`,
  elegant: (category, occasion) =>
    `Enhance the silhouette of your ${category.toLowerCase()} with balanced proportions: a structured coat or stole, curated heirloom jewelry, and polished footwear tailored for ${occasion}.`,
  bold: (category, occasion) =>
    `Elevate your ${category.toLowerCase()} into a showpiece: introduce contrasting high-gloss textures, statement jewelry, and dramatic heels to command the room at ${occasion}.`,
};

const STYLING_TIPS_BY_AESTHETIC: Record<Aesthetic, string[]> = {
  soft: [
    'Opt for satin and velvet textures in your fabrics that naturally catch soft light.',
    'Keep your accessories minimalist — one focal piece (like drop pearl earrings) is plenty.',
    'Blush placement high on the cheekbones lifts the face without heavy contouring.',
    'If wearing a hijab or scarf, choose breathable georgette or modal in soft neutral cream or dusty rose.',
  ],
  elegant: [
    'Use the rule of visual contrast: if your dress has intricate embroidery, choose clean jewelry; if simple, wear a statement necklace.',
    'Ensure your hemline and shoe height harmonize so fabric floats gracefully when walking.',
    'Coordinate the undertone of your bag hardware with your jewelry (warm gold or cool silver).',
    'Set your lipstick with a matching lip liner to maintain clean symmetry all evening.',
  ],
  bold: [
    'Don’t shy away from deliberate color-blocking: pairing complementary accessories adds runway flair.',
    'Balance a dramatic smoky eye or bold lip with clean, luminous skin prep and sculpted cheekbones.',
    'Incorporate tactile luxury: patent pumps, a jeweled box clutch, or metallic belt to catch flash photography.',
    'Add an illuminating mist across the décolletage and shoulders for evening glow.',
  ],
};

export interface CreateLookOptions {
  dressHexes: string[];
  occasion: Occasion;
  aesthetic: Aesthetic;
  undertone?: UndertoneOption;
  dressCategory?: string;
  dressLabel?: string;
}

export function generateCompleteLook(options: CreateLookOptions): CompleteLook {
  const {
    dressHexes,
    occasion,
    aesthetic,
    undertone = 'unspecified',
    dressCategory = 'Dress',
    dressLabel = 'your dress',
  } = options;

  const baseResult = matchDressColor(
    { dressHexes, occasion, aesthetic, undertone, category: dressCategory },
    dressLabel
  );

  const matchedCombo =
    baseResult.combinations.find((c) => c.aesthetic === aesthetic) ||
    baseResult.combinations[0];

  const shoes =
    baseResult.accessories.find((a) => a.color.category === 'shoes') ||
    baseResult.accessories[0];
  const handbag =
    baseResult.accessories.find((a) => a.color.category === 'handbag') ||
    baseResult.accessories[1];
  const jewelry =
    baseResult.accessories.find((a) => a.color.category === 'jewelry') ||
    baseResult.accessories[2];
  const belt = baseResult.accessories.find((a) => a.color.category === 'belt');
  const hijabOrScarf = baseResult.accessories.find(
    (a) => a.color.category === 'hijab-scarf'
  );

  const hairstyle =
    HAIRSTYLE_MATRIX[aesthetic]?.[occasion] ||
    'Elegant soft waves with polished styling';

  const occasionFitNote = OUTFIT_STYLING_NOTES[aesthetic](dressCategory, occasion);
  const stylingTips = STYLING_TIPS_BY_AESTHETIC[aesthetic];

  return {
    ...baseResult,
    combinations: baseResult.combinations,
    hairstyle,
    shoes,
    handbag,
    jewelry,
    belt,
    hijabOrScarf,
    stylingTips,
    occasionFitNote,
  };
}

export function generateAllVariations(
  dressHexes: string[],
  occasion: Occasion,
  undertone: UndertoneOption = 'unspecified',
  dressCategory = 'Dress',
  dressLabel = 'your dress'
): Record<Aesthetic, CompleteLook> {
  const aesthetics: Aesthetic[] = ['soft', 'elegant', 'bold'];
  const res = {} as Record<Aesthetic, CompleteLook>;

  aesthetics.forEach((aes) => {
    res[aes] = generateCompleteLook({
      dressHexes,
      occasion,
      aesthetic: aes,
      undertone,
      dressCategory,
      dressLabel,
    });
  });

  return res;
}
