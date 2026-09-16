import {
  AccessorySwatchResult,
  Aesthetic,
  ColorMatchOptions,
  ColorMatchResult,
  EyeshadowLook,
  MakeupCombination,
  Shade,
  SwatchResult,
  UndertoneOption,
  WarmCool,
} from '@/types';
import { lipstickShades } from '@/data/lipstickShades';
import { eyeshadowShades } from '@/data/eyeshadowShades';
import { blushShades } from '@/data/blushShades';
import { accessoryColors } from '@/data/accessoryColors';
import {
  averageDressHue,
  classifyWarmCool,
  hexToHsl,
  hueDistance,
} from '@/utils/colorUtils';

interface ScoreContext {
  dressHue: number;
  dressSat: number;
  dressLight: number;
  dressWarmCool: WarmCool;
  undertone: UndertoneOption;
  aesthetic?: Aesthetic;
  category?: string;
  intensity?: string;
}

const AESTHETIC_INTENSITY_WEIGHTS: Record<Aesthetic, [number, number]> = {
  soft: [0.1, 0.45],
  elegant: [0.3, 0.7],
  bold: [0.55, 1.0],
};

function scoreShade(
  shade: Shade,
  ctx: ScoreContext,
  categoryType: 'lipstick' | 'eyeshadow' | 'blush'
): { score: number; harmony: 'analogous' | 'complementary' | 'monochromatic' | 'neutral' | 'triadic' } {
  const shadeHsl = hexToHsl(shade.hex);
  const dist = hueDistance(ctx.dressHue, shadeHsl.h);

  // 1. Determine harmony relationship
  let harmony: 'analogous' | 'complementary' | 'monochromatic' | 'neutral' | 'triadic' = 'neutral';
  let harmonyScore = 0.5;

  if (ctx.dressSat < 12 || shadeHsl.s < 14) {
    harmony = 'neutral';
    harmonyScore = 0.85; // Neutrals are always universally harmonious
  } else if (dist <= 15 && Math.abs(ctx.dressHue - shadeHsl.h) <= 15) {
    harmony = 'monochromatic';
    harmonyScore = 0.95;
  } else if (dist <= 40) {
    harmony = 'analogous';
    harmonyScore = 0.92 - dist / 100;
  } else if (dist >= 145 && dist <= 195) {
    harmony = 'complementary';
    harmonyScore = 0.9 - Math.abs(180 - dist) / 100;
  } else if ((dist >= 105 && dist <= 135) || (dist >= 225 && dist <= 255)) {
    harmony = 'triadic';
    harmonyScore = 0.78;
  } else {
    // Unharmonious dissonant spectrum
    harmonyScore = 0.35;
  }

  // 2. Temperature affinity (warm vs cool vs neutral)
  let tempScore = 0.6;
  if (shade.warmCool === 'neutral' || ctx.dressWarmCool === 'neutral') {
    tempScore = 0.88;
  } else if (shade.warmCool === ctx.dressWarmCool) {
    tempScore = 0.96;
  } else {
    // Deliberate cross-temperature contrast (e.g. warm terracotta with royal blue)
    tempScore = categoryType === 'blush' ? 0.42 : 0.62;
  }

  // 3. User skin undertone preference (optional nudge)
  let undertoneBonus = 0.5;
  if (ctx.undertone !== 'unspecified') {
    if (shade.warmCool === ctx.undertone || shade.warmCool === 'neutral') {
      undertoneBonus = 0.85;
    } else {
      undertoneBonus = 0.35;
    }
  }

  // 4. Aesthetic & Intensity fit
  let intensityScore = 0.7;
  if (ctx.aesthetic) {
    const [min, max] = AESTHETIC_INTENSITY_WEIGHTS[ctx.aesthetic];
    if (shade.intensity >= min && shade.intensity <= max) {
      intensityScore = 1.0;
    } else {
      const deviation = shade.intensity < min ? min - shade.intensity : shade.intensity - max;
      intensityScore = Math.max(0.15, 1.0 - deviation * 2.0);
    }
  }

  // 5. Contrast & Luminance Balance
  // Light dress pairs well with medium/deep shades for contrast; dark dresses shine with glowing/reflective points
  const lightnessGap = Math.abs(ctx.dressLight - shadeHsl.l);
  let contrastBonus = 0.6;
  if (ctx.dressLight > 75) {
    // Pastel/white dress needs enough shade presence to prevent washing out
    contrastBonus = shadeHsl.l < 65 ? 0.9 : 0.5;
  } else if (ctx.dressLight < 25) {
    // Dark dress benefits from vibrant or glowing accents
    contrastBonus = shadeHsl.s > 30 || shade.finish === 'shimmer' ? 0.88 : 0.65;
  } else {
    contrastBonus = Math.min(1.0, 0.5 + lightnessGap / 80);
  }

  const finalScore =
    harmonyScore * 0.35 +
    tempScore * 0.22 +
    intensityScore * 0.2 +
    contrastBonus * 0.13 +
    undertoneBonus * 0.1;

  return { score: finalScore, harmony };
}

function generateExplainableReason(
  shade: Shade,
  dressLabel: string,
  ctx: ScoreContext,
  harmony: 'analogous' | 'complementary' | 'monochromatic' | 'neutral' | 'triadic',
  type: 'lipstick' | 'eyeshadow' | 'blush'
): string {
  const tempWord =
    ctx.dressWarmCool === 'neutral'
      ? 'versatile neutral'
      : ctx.dressWarmCool === 'warm'
      ? 'warm, sunlit'
      : 'cool, poised';

  if (harmony === 'monochromatic') {
    return `${shade.name} shares the exact color family of ${dressLabel}, creating an elongated, luxurious monochromatic aesthetic that exudes effortless sophistication.`;
  }
  if (harmony === 'complementary') {
    return `${shade.name} sits opposite ${dressLabel} on the color wheel, creating dynamic artistic contrast that brings vibrant life to your ${type} without clashing.`;
  }
  if (harmony === 'analogous') {
    return `${shade.name} sits adjacent to the tone of ${dressLabel}, providing a seamless, fluid transition that feels natural and gracefully coordinated.`;
  }
  if (harmony === 'neutral') {
    return `${shade.name} provides clean, balanced neutral framing that allows the depth of ${dressLabel} to take center stage without visual competition.`;
  }
  return `${shade.name} harmonizes with the ${tempWord} undertone of ${dressLabel}, giving your ${type} balanced depth and refined polish.`;
}

function rankShades(
  pool: Shade[],
  ctx: ScoreContext,
  dressLabel: string,
  type: 'lipstick' | 'eyeshadow' | 'blush',
  count: number
): SwatchResult[] {
  return pool
    .map((shade) => {
      const { score, harmony } = scoreShade(shade, ctx, type);
      return {
        shade,
        score,
        harmonyType: harmony,
        reason: generateExplainableReason(shade, dressLabel, ctx, harmony, type),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

function pickCoordinatedEyeshadow(ctx: ScoreContext, dressLabel: string): EyeshadowLook {
  const byFamily = (family: string) => eyeshadowShades.filter((s) => s.family === family);

  const getTop = (family: string) =>
    rankShades(byFamily(family), ctx, dressLabel, 'eyeshadow', 1)[0]?.shade ||
    eyeshadowShades.find((s) => s.family === family)!;

  return {
    base: getTop('base'),
    crease: getTop('crease'),
    lid: getTop('lid'),
    shimmer: getTop('shimmer'),
    outerCorner: getTop('outer-corner'),
  };
}

function rankAccessories(ctx: ScoreContext, dressLabel: string): AccessorySwatchResult[] {
  const categories: Array<'shoes' | 'handbag' | 'jewelry' | 'belt' | 'hijab-scarf'> = [
    'shoes',
    'handbag',
    'jewelry',
    'belt',
    'hijab-scarf',
  ];

  return categories.map((cat) => {
    const candidates = accessoryColors.filter((a) => a.category === cat);
    const scored = candidates
      .map((item) => {
        const itemHsl = hexToHsl(item.hex);
        const dist = hueDistance(ctx.dressHue, itemHsl.h);
        const isNeutral = itemHsl.s < 12 || itemHsl.l < 15 || itemHsl.l > 88;

        let score = 0.5;
        let rel: 'matching' | 'contrasting' | 'neutral' = 'neutral';

        if (isNeutral) {
          rel = 'neutral';
          score = 0.88; // Neutrals like nude, ivory, black are timelessly safe
        } else if (dist <= 35) {
          rel = 'matching';
          score = 0.94 - dist / 100;
        } else if (dist >= 145) {
          rel = 'contrasting';
          score = 0.86 - Math.abs(180 - dist) / 120;
        } else {
          score = 0.4;
        }

        // Jewelry temperature matching: warm dresses love gold/brass, cool dresses love silver/platinum, pearls love all
        if (cat === 'jewelry') {
          if (item.name.toLowerCase().includes('pearl')) {
            score += 0.1;
          } else if (ctx.dressWarmCool === 'warm' && item.hex === '#D8AF3B') {
            score += 0.15; // 18k yellow gold bonus for warm dress
          } else if (ctx.dressWarmCool === 'cool' && item.hex === '#D2D6DC') {
            score += 0.15; // Silver bonus for cool dress
          }
        }

        return { item: { ...item, relation: rel }, score };
      })
      .sort((a, b) => b.score - a.score);

    const best = scored[0].item;
    let reason = '';
    if (best.relation === 'matching') {
      reason = `${best.name} mirrors the core palette of ${dressLabel}, pulling the complete look together seamlessly.`;
    } else if (best.relation === 'contrasting') {
      reason = `${best.name} brings high-contrast accent energy, drawing the eye as a statement piece against ${dressLabel}.`;
    } else {
      reason = `${best.name} acts as a sophisticated neutral anchor, balancing the outfit effortlessly.`;
    }

    return {
      color: best,
      reason,
    };
  });
}

function assembleCombination(
  aesthetic: Aesthetic,
  ctx: ScoreContext,
  dressLabel: string
): MakeupCombination {
  const localCtx: ScoreContext = { ...ctx, aesthetic };
  const lipPicks = rankShades(lipstickShades, localCtx, dressLabel, 'lipstick', 3);
  const blushPicks = rankShades(blushShades, localCtx, dressLabel, 'blush', 2);
  const eyeshadow = pickCoordinatedEyeshadow(localCtx, dressLabel);

  const lip = lipPicks[0].shade;
  const blush = blushPicks[0].shade;

  const metadataByAesthetic: Record<
    Aesthetic,
    {
      label: string;
      eyeliner: string;
      mascara: string;
      desc: string;
      tips: string[];
    }
  > = {
    soft: {
      label: 'Soft & Natural',
      eyeliner: 'Soft chocolate brown tightline gently smudged at outer lash root',
      mascara: 'Lengthening defined brown-black mascara for feathered lashes',
      desc: `A fresh, luminous makeup harmony highlighting your natural features with dewy ${blush.name.toLowerCase()} cheeks and a softly tinted ${lip.name.toLowerCase()} lip.`,
      tips: [
        'Apply lip color with a tapping fingertip for a soft-focus blurred edge.',
        'Dust the shimmer shade only on the high point of the brow bone and inner corner.',
        'Keep skin dewy with light cream blush and minimal translucent setting powder.',
      ],
    },
    elegant: {
      label: 'Elegant & Balanced',
      eyeliner: 'Satin espresso or deep plum gel liner with a delicate kitten flick',
      mascara: 'Volumizing clean black mascara lifting from the base',
      desc: `A poised, red-carpet-ready pairing balancing luminous ${eyeshadow.lid.name.toLowerCase()} eyelids with sculpted ${blush.name.toLowerCase()} and velvety ${lip.name.toLowerCase()}.`,
      tips: [
        'Blend the crease shade in windshield wiper motions for a seamless smoky fade.',
        'Line lips with a matching pencil one shade deeper before applying lipstick.',
        'Lightly press champagne shimmer onto the center of the mobile lid.',
      ],
    },
    bold: {
      label: 'Bold & Glamorous',
      eyeliner: 'Crisp jet-black winged liquid liner with graphic outer-v definition',
      mascara: 'Dramatic false-lash effect mascara with layered curl',
      desc: `A show-stopping look anchoring high-impact ${lip.name.toLowerCase()} lips with deepened ${eyeshadow.outerCorner.name.toLowerCase()} smoky eyes and defined cheekbones.`,
      tips: [
        'Set your bold lip with a single-ply tissue dust of translucent powder for transfer-proof wear.',
        'Deepen the outer eye corner with small circular buffing to prevent harsh lines.',
        'Add a touch of gold or silver highlighter to the cupid’s bow and bridge of the nose.',
      ],
    },
  };

  const meta = metadataByAesthetic[aesthetic];

  return {
    label: meta.label,
    aesthetic,
    lipstick: lip,
    eyeshadow,
    blush,
    eyeliner: meta.eyeliner,
    mascara: meta.mascara,
    description: meta.desc,
    proTips: meta.tips,
  };
}

export function matchDressColor(
  options: ColorMatchOptions,
  dressLabel = 'your dress'
): ColorMatchResult {
  const { dressHexes, occasion = 'party', aesthetic, undertone = 'unspecified' } = options;
  const avgHsl = averageDressHue(dressHexes);
  const dominantTemp = classifyWarmCool(dressHexes[0]);

  const ctx: ScoreContext = {
    dressHue: avgHsl.h,
    dressSat: avgHsl.s,
    dressLight: avgHsl.l,
    dressWarmCool: dominantTemp,
    undertone,
    aesthetic,
    category: options.category,
    intensity: options.intensity,
  };

  const lipstick = rankShades(lipstickShades, ctx, dressLabel, 'lipstick', 8);
  const eyeshadow = rankShades(eyeshadowShades, ctx, dressLabel, 'eyeshadow', 10);
  const blush = rankShades(blushShades, ctx, dressLabel, 'blush', 6);
  const accessories = rankAccessories(ctx, dressLabel);

  const combinations: MakeupCombination[] = (['soft', 'elegant', 'bold'] as Aesthetic[]).map((a) =>
    assembleCombination(a, ctx, dressLabel)
  );

  const harmonyDescription =
    dominantTemp === 'warm'
      ? `Your dress has a rich golden/warm base (${dressHexes[0]}). Recommended palettes lean into toasty terracottas, peaches, warm reds, and champagne glitters for natural radiance.`
      : dominantTemp === 'cool'
      ? `Your dress possesses a cool jewel or oceanic undertone (${dressHexes[0]}). Recommended palettes favor rose, plum, silver, and berry tones to enhance cool chromatic harmony.`
      : `Your dress is a versatile neutral tone (${dressHexes[0]}). You have freedom to pivot towards either warm bronzes or cool rosy berries depending on your mood and accessories.`;

  return {
    dressHexes,
    lipstick,
    eyeshadow,
    blush,
    accessories,
    combinations,
    dominantTemp,
    harmonyAnalysis: {
      title: `${dominantTemp.toUpperCase()} Undertone Harmony`,
      description: harmonyDescription,
      temperatureVerdict: dominantTemp,
    },
  };
}
