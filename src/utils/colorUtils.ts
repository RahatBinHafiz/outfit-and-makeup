import { WarmCool } from '@/types';

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export function normalizeHex(hex: string): string {
  const clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    return `#${clean.split('').map((c) => c + c).join('')}`.toUpperCase();
  }
  if (clean.length === 6) {
    return `#${clean}`.toUpperCase();
  }
  return '#FFFFFF';
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToHsl(hex: string): HSL {
  let [r, g, b] = hexToRgb(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/** Shortest circular distance between two hues (0-180 deg) */
export function hueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/** Classify whether a color has warm, cool, or neutral characteristics */
export function classifyWarmCool(hex: string): WarmCool {
  const { h, s, l } = hexToHsl(hex);
  // Extremely low saturation or near black/white is considered neutral
  if (s < 10 || l < 8 || l > 93) return 'neutral';
  // Reds, warm pinks, oranges, warm yellows, yellow-greens are warm
  // True greens, cyans, blues, purples, cool pinks are cool
  const isWarm = (h >= 0 && h < 75) || (h >= 340 && h <= 360);
  const isCool = h >= 95 && h <= 290;
  if (isWarm) return 'warm';
  if (isCool) return 'cool';
  return 'neutral';
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const classifyTemperature = classifyWarmCool;
export const calculateLuminance = relativeLuminance;

export function getHarmonyColors(
  hex: string,
  type: 'complementary' | 'analogous' | 'monochromatic' | 'triadic'
): string[] {
  const { h, s, l } = hexToHsl(hex);
  switch (type) {
    case 'complementary':
      return [hex, hslToHex(h + 180, s, l)];
    case 'analogous':
      return [hslToHex(h - 30, s, l), hslToHex(h + 30, s, l)];
    case 'monochromatic':
      return [
        hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 25)),
        hslToHex(h, Math.min(95, s + 10), Math.max(15, l - 25)),
      ];
    case 'triadic':
      return [hex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)];
    default:
      return [hex];
  }
}


/** Returns readable foreground text color for any background */
export function readableTextColor(hex: string): string {
  return relativeLuminance(hex) > 0.45 ? '#252525' : '#FFFFFF';
}

/** Computes average hue and saturation for multi-colored patterned dresses */
export function averageDressHue(hexes: string[]): HSL {
  if (!hexes || hexes.length === 0) return { h: 0, s: 0, l: 50 };
  if (hexes.length === 1) return hexToHsl(hexes[0]);

  let x = 0;
  let y = 0;
  let sSum = 0;
  let lSum = 0;

  hexes.forEach((hex) => {
    const { h, s, l } = hexToHsl(hex);
    const rad = (h * Math.PI) / 180;
    x += Math.cos(rad);
    y += Math.sin(rad);
    sSum += s;
    lSum += l;
  });

  let h = (Math.atan2(y / hexes.length, x / hexes.length) * 180) / Math.PI;
  if (h < 0) h += 360;

  return {
    h: Math.round(h),
    s: Math.round(sSum / hexes.length),
    l: Math.round(lSum / hexes.length),
  };
}
