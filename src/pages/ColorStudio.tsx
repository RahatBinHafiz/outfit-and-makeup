import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Info,
  RotateCcw,
  Palette,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';
import {
  hexToHsl,
  hslToHex,
  getHarmonyColors,
  classifyTemperature,
  calculateLuminance,
} from '@/utils/colorUtils';
import { harmonyRules } from '@/data/colorHarmony';
import { dressColors } from '@/data/dressColors';

export default function ColorStudio() {
  const navigate = useNavigate();
  const [baseHex, setBaseHex] = useState<string>('#6E1E2C'); // Burgundy default

  const hsl = useMemo(() => hexToHsl(baseHex), [baseHex]);
  const temp = useMemo(() => classifyTemperature(baseHex), [baseHex]);
  const luminance = useMemo(() => calculateLuminance(baseHex), [baseHex]);

  // Harmonies
  const complementary = useMemo(() => getHarmonyColors(baseHex, 'complementary'), [baseHex]);
  const analogous = useMemo(() => getHarmonyColors(baseHex, 'analogous'), [baseHex]);
  const monochromatic = useMemo(() => getHarmonyColors(baseHex, 'monochromatic'), [baseHex]);
  const triadic = useMemo(() => getHarmonyColors(baseHex, 'triadic'), [baseHex]);

  const handleTestInMatcher = () => {
    navigate(`/color-matcher?hex=${encodeURIComponent(baseHex)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525]">
          <Compass size={14} className="text-[#252525]" />
          <span>Color Theory & Harmony Exploration</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
          Interactive Color Harmony Studio
        </h1>
        <p className="text-[#737373] text-sm sm:text-base max-w-2xl leading-relaxed">
          Master the exact mathematical color relationships fashion designers and celebrity makeup
          artists use: complementary contrasts, analogous flows, and monochromatic depth.
        </p>
      </div>

      {/* Interactive Base Color Wheel & Diagnostics */}
      <Card className="bg-white border-[#EAE7DD] p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Base Swatch & Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-3xl border border-black/10 shadow-md shrink-0 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: baseHex }}
              >
                <input
                  type="color"
                  value={baseHex}
                  onChange={(e) => setBaseHex(e.target.value.toUpperCase())}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Click to change base color"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#737373] block">
                  Interactive Base Color
                </span>
                <h3 className="font-display text-2xl font-bold text-[#252525]">{baseHex}</h3>
                <p className="text-xs text-[#737373] mt-0.5">
                  Tap color box to pick any tone, or select from curated presets below.
                </p>
              </div>
            </div>

            {/* Curated Presets Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {dressColors.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setBaseHex(c.hex)}
                  className="shrink-0 w-8 h-8 rounded-full border border-black/10 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Color Physics Diagnostics */}
          <div className="lg:col-span-6 bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#252525] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#FFD84D]" />
              Hue & Lightness Diagnostics
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-[#EAE7DD]">
                <span className="text-[10px] text-[#737373] uppercase font-bold block">
                  Temperature
                </span>
                <span className="text-sm font-bold text-[#252525] capitalize">{temp}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EAE7DD]">
                <span className="text-[10px] text-[#737373] uppercase font-bold block">
                  Hue Angle
                </span>
                <span className="text-sm font-bold text-[#252525]">{hsl.h}°</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EAE7DD]">
                <span className="text-[10px] text-[#737373] uppercase font-bold block">
                  Luminance
                </span>
                <span className="text-sm font-bold text-[#252525]">
                  {Math.round(luminance * 100)}%
                </span>
              </div>
            </div>

            <Button
              onClick={handleTestInMatcher}
              variant="primary"
              size="sm"
              className="w-full mt-2"
              icon={<ArrowRight size={14} />}
              iconPosition="right"
            >
              Test This Hue in Dress-to-Makeup Matcher
            </Button>
          </div>
        </div>
      </Card>

      {/* The 4 Core Harmony Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Complementary (180 deg opposite) */}
        <Card className="bg-white border-[#EAE7DD] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DD]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFD84D] bg-[#252525] px-2 py-0.5 rounded-md">
                180° Direct Contrast
              </span>
              <h3 className="font-display text-xl font-bold text-[#252525] mt-1">
                Complementary Harmony
              </h3>
            </div>
            <span className="text-xs text-[#737373] font-medium">Opposite on color wheel</span>
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            Opposite colors intensify each other. When paired with your dress, a complementary
            eyeshadow shimmer or lipstick accent creates a vibrant, eye-catching focal point.
          </p>
          <div className="flex items-center gap-3 bg-[#FFFDF5] p-4 rounded-2xl border border-[#EAE7DD]">
            <ColorSwatch hex={baseHex} name="Base Tone" size="sm" showHexLabel={false} />
            <span className="text-xs font-bold text-[#737373]">+</span>
            <ColorSwatch
              hex={complementary[1]}
              name="Complement"
              size="sm"
              showHexLabel={false}
            />
          </div>
        </Card>

        {/* 2. Analogous (+/- 30 deg adjacent) */}
        <Card className="bg-white border-[#EAE7DD] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DD]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#252525] bg-[#FFF4BF] px-2 py-0.5 rounded-md">
                ±30° Adjacent Flow
              </span>
              <h3 className="font-display text-xl font-bold text-[#252525] mt-1">
                Analogous Harmony
              </h3>
            </div>
            <span className="text-xs text-[#737373] font-medium">Neighboring hues</span>
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            Hues that sit directly beside each other on the color wheel create a serene, effortlessly
            cohesive gradient that never clashes.
          </p>
          <div className="flex items-center gap-3 bg-[#FFFDF5] p-4 rounded-2xl border border-[#EAE7DD]">
            <ColorSwatch hex={analogous[0]} name="Adjacent 1" size="sm" showHexLabel={false} />
            <ColorSwatch hex={baseHex} name="Base Tone" size="sm" showHexLabel={false} />
            <ColorSwatch hex={analogous[1]} name="Adjacent 2" size="sm" showHexLabel={false} />
          </div>
        </Card>

        {/* 3. Monochromatic (Varied lightness & saturation) */}
        <Card className="bg-white border-[#EAE7DD] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DD]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#252525] bg-[#FFF9E6] px-2 py-0.5 rounded-md">
                Luminance Shift
              </span>
              <h3 className="font-display text-xl font-bold text-[#252525] mt-1">
                Monochromatic Harmony
              </h3>
            </div>
            <span className="text-xs text-[#737373] font-medium">Single hue family</span>
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            Uses lighter tints and deeper shades of the exact same hue. Clean, architectural, and
            quintessentially high-fashion.
          </p>
          <div className="flex items-center gap-3 bg-[#FFFDF5] p-4 rounded-2xl border border-[#EAE7DD]">
            <ColorSwatch hex={monochromatic[0]} name="Light Tint" size="sm" showHexLabel={false} />
            <ColorSwatch hex={baseHex} name="Base Tone" size="sm" showHexLabel={false} />
            <ColorSwatch hex={monochromatic[1]} name="Deep Shade" size="sm" showHexLabel={false} />
          </div>
        </Card>

        {/* 4. Triadic (120 deg triangle) */}
        <Card className="bg-white border-[#EAE7DD] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DD]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#252525] bg-[#FFF4BF] px-2 py-0.5 rounded-md">
                120° Balanced Triangle
              </span>
              <h3 className="font-display text-xl font-bold text-[#252525] mt-1">
                Triadic Harmony
              </h3>
            </div>
            <span className="text-xs text-[#737373] font-medium">Equilateral wheel spacing</span>
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            Three hues evenly spaced around the color wheel. Delivers vibrant energy while preserving
            deliberate visual balance when one color dominates.
          </p>
          <div className="flex items-center gap-3 bg-[#FFFDF5] p-4 rounded-2xl border border-[#EAE7DD]">
            <ColorSwatch hex={baseHex} name="Base Tone" size="sm" showHexLabel={false} />
            <ColorSwatch hex={triadic[1]} name="Triad 1" size="sm" showHexLabel={false} />
            <ColorSwatch hex={triadic[2]} name="Triad 2" size="sm" showHexLabel={false} />
          </div>
        </Card>
      </div>

      {/* Stylist Color Cheat Sheet */}
      <Card className="bg-[#FFFDF5] border-[#EAE7DD] p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-xl font-bold text-[#252525] flex items-center gap-2">
          <Info size={18} className="text-[#FFD84D]" />
          Stylist Rules of Thumb for Wardrobe Color Coordination
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#737373] leading-relaxed">
          <div className="p-4 bg-white rounded-2xl border border-[#EAE7DD]">
            <strong className="text-[#252525] block mb-1">Rule of Two Focal Points</strong>
            If your dress features vibrant saturated color, choose only ONE makeup feature (eyes OR
            lips) to be bold. Let the other remain neutral or satin.
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#EAE7DD]">
            <strong className="text-[#252525] block mb-1">Temperature Bridge</strong>
            Warm-toned dresses (burgundy, olive, mustard) pair seamlessly with warm terracotta or peach
            cheeks and gold jewelry. Cool dresses (emerald, navy) thrive with berry hues and silver.
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#EAE7DD]">
            <strong className="text-[#252525] block mb-1">Texture Over Exact Match</strong>
            Never attempt to wear lipstick that exactly matches the sheen of your fabric. Velvet
            dresses love satin lips; glossy silks shine with velvet-matte makeup.
          </div>
        </div>
      </Card>
    </div>
  );
}
