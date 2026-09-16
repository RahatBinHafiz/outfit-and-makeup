import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Palette,
  Sparkles,
  Layers,
  Heart,
  Eye,
  Smile,
  Gem,
  Check,
  Share2,
  Filter,
  SlidersHorizontal,
  Bookmark,
} from 'lucide-react';
import DressColorSelector from '@/components/ColorMatcher/DressColorSelector';
import PaletteSection from '@/components/ColorMatcher/PaletteSection';
import MakeupCombinationCard from '@/components/ColorMatcher/MakeupCombinationCard';
import ColorSwatch from '@/components/ui/ColorSwatch';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { dressColors } from '@/data/dressColors';
import { matchDressColor } from '@/engine/colorEngine';
import { Aesthetic, Occasion, UndertoneOption, MakeupIntensity } from '@/types';
import { usePalettes } from '@/context/PaletteContext';
import { useProfile } from '@/context/ProfileContext';

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'everyday', label: 'Everyday Chic' },
  { value: 'office', label: 'Office & Workwear' },
  { value: 'party', label: 'Party & Cocktail' },
  { value: 'wedding', label: 'Wedding & Reception' },
  { value: 'date-night', label: 'Romantic Date Night' },
  { value: 'traditional', label: 'Festive & Traditional' },
  { value: 'evening-formal', label: 'Black Tie & Gala' },
];

const CLOTHING_CATEGORIES = [
  'Evening Gown',
  'Cocktail Dress',
  'Saree',
  'Salwar Kameez',
  'Abaya / Kaftan',
  'Formal Suit',
  'Summer Sundress',
  'Blouse & Skirt',
  'Patterned / Printed Dress',
];

const UNDERTONES: { value: UndertoneOption; label: string; desc: string }[] = [
  { value: 'unspecified', label: 'No Preference', desc: 'Colors matched strictly to outfit' },
  { value: 'warm', label: 'Warm Undertone', desc: 'Golden, peachy, or olive skin undertone' },
  { value: 'cool', label: 'Cool Undertone', desc: 'Rosy, pink, or bluish skin undertone' },
  { value: 'neutral', label: 'Neutral Undertone', desc: 'Balanced mix of warm and cool' },
];

export default function ColorMatcher() {
  const [searchParams] = useSearchParams();
  const urlHex = searchParams.get('hex');
  const { profile } = useProfile();
  const { savePalette, isSaved } = usePalettes();

  // Multi-color dress selection
  const [dressHexes, setDressHexes] = useState<string[]>(
    urlHex ? [urlHex.toUpperCase()] : ['#6E1E2C']
  );

  // Optional contextual preferences
  const [category, setCategory] = useState<string>(CLOTHING_CATEGORIES[0]);
  const [occasion, setOccasion] = useState<Occasion>('party');
  const [undertone, setUndertone] = useState<UndertoneOption>(profile.defaultUndertone || 'unspecified');
  const [preferredAesthetic, setPreferredAesthetic] = useState<Aesthetic>('elegant');
  const [activeTab, setActiveTab] = useState<'all' | 'makeup' | 'combinations' | 'accessories'>('all');

  // Compute recommendation results
  const matchResults = useMemo(() => {
    return matchDressColor(
      {
        dressHexes,
        occasion,
        aesthetic: preferredAesthetic,
        undertone,
        category,
      },
      category
    );
  }, [dressHexes, occasion, preferredAesthetic, undertone, category]);

  const presetName = dressColors.find(
    (c) => c.hex.toLowerCase() === dressHexes[0].toLowerCase()
  )?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Studio Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525]">
          <Palette size={14} className="text-[#252525]" />
          <span>Interactive Color-Matching Studio</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
          Dress-to-Makeup Color Matcher
        </h1>
        <p className="text-[#737373] text-sm sm:text-base max-w-3xl leading-relaxed">
          Select or customize your dress color below. Our rule-based color intelligence engine
          harmonizes warm and cool color temperatures, complementary contrast, and balanced
          proportions to recommend tailored lipsticks, eyeshadow palettes, blushes, and accessories.
        </p>
      </div>

      {/* Step 1: Dress Color & Optional Preferences Controller */}
      <Card className="bg-white border-[#EAE7DD] p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="font-display text-xl font-bold text-[#252525] flex items-center gap-2 mb-1">
            <span className="w-7 h-7 rounded-full bg-[#FFD84D] text-[#252525] flex items-center justify-center text-xs font-bold">
              1
            </span>
            Select Dress Color & Pattern Palette
          </h2>
          <p className="text-xs text-[#737373]">
            Pick a single shade, or add multiple colors for prints, floras, and multi-colored dresses.
          </p>
        </div>

        <DressColorSelector
          selectedHexes={dressHexes}
          onChange={setDressHexes}
          allowMultiple={true}
        />

        {/* Optional Context Controls */}
        <div className="pt-6 border-t border-[#EAE7DD] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#252525]">
            <SlidersHorizontal size={14} className="text-[#FFD84D]" />
            <span>Refine Styling Context (Optional)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-[#252525] block mb-1.5">
                Clothing Category
              </label>
              <select
                id="matcher-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#EAE7DD] rounded-xl text-sm sm:text-xs font-semibold text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
              >
                {CLOTHING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div>
              <label className="text-xs font-semibold text-[#252525] block mb-1.5">Occasion</label>
              <select
                id="matcher-occasion-select"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as Occasion)}
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#EAE7DD] rounded-xl text-sm sm:text-xs font-semibold text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ.value} value={occ.value}>
                    {occ.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skin Undertone */}
            <div>
              <label className="text-xs font-semibold text-[#252525] block mb-1.5">
                Skin Undertone (Optional)
              </label>
              <select
                id="matcher-undertone-select"
                value={undertone}
                onChange={(e) => setUndertone(e.target.value as UndertoneOption)}
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#EAE7DD] rounded-xl text-sm sm:text-xs font-semibold text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
              >
                {UNDERTONES.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Aesthetic */}
            <div>
              <label className="text-xs font-semibold text-[#252525] block mb-1.5">
                Target Aesthetic
              </label>
              <select
                id="matcher-aesthetic-select"
                value={preferredAesthetic}
                onChange={(e) => setPreferredAesthetic(e.target.value as Aesthetic)}
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-white border border-[#EAE7DD] rounded-xl text-sm sm:text-xs font-semibold text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
              >
                <option value="soft">Soft & Natural</option>
                <option value="elegant">Elegant & Balanced</option>
                <option value="bold">Bold & Glamorous</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Prominent Active Dress Color Banner & Stylist Analysis */}
      <div className="bg-[#FFFDF5] border border-[#EAE7DD] rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="flex -space-x-4 shrink-0">
              {dressHexes.map((hex, i) => (
                <div
                  key={hex}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white shadow-md"
                  style={{ backgroundColor: hex, zIndex: 10 - i }}
                />
              ))}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#737373] block">
                Selected Dress Profile
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#252525]">
                {presetName || 'Custom Color'}
              </h3>
              <p className="text-xs font-mono text-[#737373] mt-0.5">
                {dressHexes.join(' · ')}
              </p>
            </div>
          </div>

          <div className="md:col-span-8 bg-white border border-[#EAE7DD] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={16} className="text-[#FFD84D]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#252525]">
                Color Harmony & Stylist Diagnostics
              </h4>
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">
              {matchResults.harmonyAnalysis.description} Recommendations are adjusted for{' '}
              <strong className="text-[#252525]">{occasion}</strong> wear.
            </p>
          </div>
        </div>
      </div>

      {/* Results Filter Navigation Tabs */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EAE7DD] touch-pan-x">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 min-h-[40px] flex items-center ${
            activeTab === 'all'
              ? 'bg-[#FFD84D] text-[#252525] shadow-xs'
              : 'text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
          }`}
        >
          All Color Palettes
        </button>
        <button
          onClick={() => setActiveTab('combinations')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 min-h-[40px] flex items-center ${
            activeTab === 'combinations'
              ? 'bg-[#FFD84D] text-[#252525] shadow-xs'
              : 'text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
          }`}
        >
          Complete Makeup Looks (3)
        </button>
        <button
          onClick={() => setActiveTab('makeup')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 min-h-[40px] flex items-center ${
            activeTab === 'makeup'
              ? 'bg-[#FFD84D] text-[#252525] shadow-xs'
              : 'text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
          }`}
        >
          Lipstick, Eyeshadow & Blush
        </button>
        <button
          onClick={() => setActiveTab('accessories')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 min-h-[40px] flex items-center ${
            activeTab === 'accessories'
              ? 'bg-[#FFD84D] text-[#252525] shadow-xs'
              : 'text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
          }`}
        >
          Accessories & Jewelry
        </button>
      </div>

      {/* SECTION E: Complete Makeup Combinations (Top feature) */}
      {(activeTab === 'all' || activeTab === 'combinations') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84D] bg-[#252525] px-2.5 py-0.5 rounded-md inline-block mb-1">
                Section E
              </span>
              <h2 className="font-display text-2xl font-bold text-[#252525]">
                Complete Coordinated Makeup Looks
              </h2>
              <p className="text-xs text-[#737373]">
                Three distinct aesthetics tailored to your {category.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matchResults.combinations.map((combo) => (
              <MakeupCombinationCard
                key={combo.aesthetic}
                combination={combo}
                dressHexes={dressHexes}
                dressName={presetName || 'Custom Outfit'}
                saved={isSaved(dressHexes, combo)}
                onSave={() =>
                  savePalette(
                    dressHexes,
                    combo,
                    `${combo.label} · ${presetName || dressHexes[0]}`,
                    presetName || 'Custom Outfit',
                    occasion
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTIONS A, B, C: Individual Makeup Palettes */}
      {(activeTab === 'all' || activeTab === 'makeup') && (
        <section className="space-y-8">
          {/* Section Header */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-1">
              Sections A, B & C
            </span>
            <h2 className="font-display text-2xl font-bold text-[#252525]">
              Visual Makeup Shade Palettes
            </h2>
            <p className="text-xs text-[#737373]">
              Ranked by color harmony, undertone affinity, and contrast balance. Tap any swatch to view
              the shade details and copy its HEX code.
            </p>
          </div>

          {/* Grid of Lipstick, Blush, and Eyeshadow Palettes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* A. Lipstick Palette */}
            <div className="lg:col-span-6">
              <PaletteSection
                title="A. Curated Lipstick Palette"
                subtitle="Nude, mauve, peach, coral, red, and terracotta shades"
                icon={<Smile size={18} className="text-[#FFD84D]" />}
                results={matchResults.lipstick}
                categoryBadge="8 Ranked Shades"
              />
            </div>

            {/* C. Blush Palette */}
            <div className="lg:col-span-6">
              <PaletteSection
                title="C. Complementary Blush Palette"
                subtitle="Peach, rose, pink, mauve, and terracotta cheek tones"
                icon={<Sparkles size={18} className="text-[#FFD84D]" />}
                results={matchResults.blush}
                categoryBadge="6 Cheek Tones"
              />
            </div>

            {/* B. Coordinated Eyeshadow Palette */}
            <div className="lg:col-span-12">
              <PaletteSection
                title="B. Coordinated Eyeshadow Palette"
                subtitle="Base & transition, crease, lid, metallic shimmer, and outer-corner smoke"
                icon={<Eye size={18} className="text-[#FFD84D]" />}
                results={matchResults.eyeshadow}
                categoryBadge="10 Eye Shades"
                eyeshadowLayout={true}
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION D: Accessories Palette */}
      {(activeTab === 'all' || activeTab === 'accessories') && (
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-1">
              Section D
            </span>
            <h2 className="font-display text-2xl font-bold text-[#252525]">
              Accessories Palette
            </h2>
            <p className="text-xs text-[#737373]">
              Curated shoe, handbag, jewelry, belt, and hijab/scarf tones matched to your dress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {matchResults.accessories.map((acc) => (
              <Card key={acc.color.id} className="bg-white p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#737373] capitalize">
                      {acc.color.category.replace('-', ' / ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        acc.color.relation === 'matching'
                          ? 'bg-[#FFF9E6] text-[#252525] border border-[#FFD84D]/40'
                          : acc.color.relation === 'contrasting'
                          ? 'bg-[#252525] text-[#FFD84D]'
                          : 'bg-[#FFFDF5] text-[#737373] border border-[#EAE7DD]'
                      }`}
                    >
                      {acc.color.relation}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <ColorSwatch
                      hex={acc.color.hex}
                      name={acc.color.name}
                      reason={acc.reason}
                      size="md"
                      showHexLabel={false}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#252525]">{acc.color.name}</h4>
                      <span className="text-xs font-mono text-[#737373]">{acc.color.hex}</span>
                      {acc.color.accentMaterial && (
                        <span className="block text-[11px] text-[#737373] italic">
                          {acc.color.accentMaterial}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#737373] bg-[#FFFDF5] p-2.5 rounded-xl border border-[#EAE7DD] mt-3 leading-relaxed">
                  {acc.reason}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
