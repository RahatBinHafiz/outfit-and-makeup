import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wand2,
  Sparkles,
  Palette,
  Scissors,
  ShoppingBag,
  Sparkle,
  Shirt,
  Heart,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  SunMoon,
  CheckCircle2,
} from 'lucide-react';
import DressColorSelector from '@/components/ColorMatcher/DressColorSelector';
import ColorSwatch from '@/components/ui/ColorSwatch';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { generateAllVariations } from '@/engine/lookGenerator';
import { Aesthetic, Occasion, UndertoneOption, MakeupIntensity } from '@/types';
import { usePalettes } from '@/context/PaletteContext';
import { useProfile } from '@/context/ProfileContext';
import confetti from 'canvas-confetti';

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'wedding', label: 'Wedding & Reception' },
  { value: 'party', label: 'Party & Cocktail' },
  { value: 'evening-formal', label: 'Black Tie Gala' },
  { value: 'date-night', label: 'Romantic Date Night' },
  { value: 'office', label: 'Office & Workwear' },
  { value: 'traditional', label: 'Traditional & Festive' },
  { value: 'everyday', label: 'Everyday Chic' },
];

const CLOTHING_CATEGORIES = [
  'Evening Gown',
  'Cocktail Dress',
  'Silk Saree',
  'Salwar Kameez',
  'Modest Abaya',
  'Tailored Pantsuit',
  'Maxi Dress',
  'Blazer & Slip Dress',
];

export default function CreateMyLook() {
  const { profile } = useProfile();
  const { savePalette } = usePalettes();

  const [dressHexes, setDressHexes] = useState<string[]>(['#6E1E2C']);
  const [category, setCategory] = useState<string>(CLOTHING_CATEGORIES[0]);
  const [occasion, setOccasion] = useState<Occasion>('wedding');
  const [undertone, setUndertone] = useState<UndertoneOption>(profile.defaultUndertone || 'unspecified');
  const [intensity, setIntensity] = useState<MakeupIntensity>(profile.preferredIntensity || 'medium');
  const [modestOption, setModestOption] = useState<boolean>(profile.modestFashion || false);

  // Active variation tab: 'soft' | 'elegant' | 'bold'
  const [activeAesthetic, setActiveAesthetic] = useState<Aesthetic>('elegant');
  const [savedNotification, setSavedNotification] = useState(false);

  // Generate all 3 variations simultaneously
  const variations = useMemo(() => {
    return generateAllVariations(dressHexes, occasion, undertone, category, category);
  }, [dressHexes, occasion, undertone, category]);

  const currentLook = variations[activeAesthetic];
  const matchedCombo =
    currentLook.combinations.find((c) => c.aesthetic === activeAesthetic) ||
    currentLook.combinations[0];

  const handleSaveCurrentLook = () => {
    savePalette(
      dressHexes,
      matchedCombo,
      `${category} ${activeAesthetic.toUpperCase()} Look`,
      category,
      occasion,
      [activeAesthetic, occasion, category]
    );
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFD84D', '#FFF4BF', '#252525'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525]">
            <Wand2 size={14} className="text-[#252525]" />
            <span>Full Head-to-Toe Look Generator</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
            Create My Look
          </h1>
          <p className="text-[#737373] text-sm sm:text-base max-w-2xl leading-relaxed">
            Configure your outfit specifics, occasion, and silhouette. Receive a complete coordinated
            blueprint: outfit drape, hairstyle, full makeup, shoes, bag, jewelry, and styling tips.
          </p>
        </div>

        {/* Quick Link Card to Color Matcher */}
        <Link
          to={`/color-matcher?hex=${encodeURIComponent(dressHexes[0])}`}
          className="shrink-0 p-4 bg-[#FFF9E6] hover:bg-[#FFF4BF] border border-[#FFD84D] rounded-2xl flex items-center gap-3 transition-colors shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFD84D] flex items-center justify-center">
            <Palette size={20} className="text-[#252525]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#252525] block">
              Want more makeup swatches?
            </span>
            <span className="text-[11px] text-[#737373] flex items-center gap-1">
              Open Color Matcher Studio <ArrowRight size={12} />
            </span>
          </div>
        </Link>
      </div>

      {/* Input Configuration Card */}
      <Card className="bg-white border-[#EAE7DD] p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-[#252525] flex items-center gap-2">
          <Shirt size={20} className="text-[#FFD84D]" />
          Configure Your Outfit & Occasion Details
        </h2>

        {/* Dress Color Selector */}
        <DressColorSelector
          selectedHexes={dressHexes}
          onChange={setDressHexes}
          allowMultiple={true}
        />

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#EAE7DD]">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-[#252525] block mb-1.5">
              Clothing Silhouette
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAE7DD] rounded-xl text-xs font-semibold text-[#252525] focus:ring-2 focus:ring-[#FFD84D]"
            >
              {CLOTHING_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Occasion */}
          <div>
            <label className="text-xs font-semibold text-[#252525] block mb-1.5">Occasion</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as Occasion)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAE7DD] rounded-xl text-xs font-semibold text-[#252525] focus:ring-2 focus:ring-[#FFD84D]"
            >
              {OCCASIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skin Undertone */}
          <div>
            <label className="text-xs font-semibold text-[#252525] block mb-1.5">
              Skin Undertone
            </label>
            <select
              value={undertone}
              onChange={(e) => setUndertone(e.target.value as UndertoneOption)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAE7DD] rounded-xl text-xs font-semibold text-[#252525] focus:ring-2 focus:ring-[#FFD84D]"
            >
              <option value="unspecified">No Preference</option>
              <option value="warm">Warm / Golden</option>
              <option value="cool">Cool / Rosy</option>
              <option value="neutral">Neutral Balanced</option>
            </select>
          </div>

          {/* Modest Fashion Option */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-[#FFFDF5] border border-[#EAE7DD] rounded-xl hover:bg-[#FFF9E6]">
              <input
                type="checkbox"
                checked={modestOption}
                onChange={(e) => setModestOption(e.target.checked)}
                className="w-4 h-4 accent-[#FFD84D] rounded"
              />
              <span className="text-xs font-bold text-[#252525]">
                Include Hijab / Scarf Styling
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* 3 Styling Variations Segmented Control */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#737373] block">
              Styling Variations
            </span>
            <h2 className="font-display text-2xl font-bold text-[#252525]">
              Choose Your Styling Aesthetic
            </h2>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveCurrentLook}
            icon={<Heart size={14} />}
          >
            {savedNotification ? 'Saved to Lookbook!' : 'Save This Complete Look'}
          </Button>
        </div>

        {/* The 3 variation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Minimal and elegant */}
          <div
            onClick={() => setActiveAesthetic('soft')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              activeAesthetic === 'soft'
                ? 'bg-[#FFF9E6] border-[#FFD84D] shadow-sm'
                : 'bg-white border-[#EAE7DD] hover:border-[#FFD84D]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#252525]">
                Option 1: Minimal & Elegant
              </span>
              {activeAesthetic === 'soft' && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D]" />
              )}
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">
              Understated, chic, and radiant. Soft lip stains, whisper-thin jewelry, and effortless waves.
            </p>
          </div>

          {/* Option 2: Classic and balanced */}
          <div
            onClick={() => setActiveAesthetic('elegant')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              activeAesthetic === 'elegant'
                ? 'bg-[#FFF4BF] border-[#FFD84D] shadow-sm'
                : 'bg-white border-[#EAE7DD] hover:border-[#FFD84D]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#252525]">
                Option 2: Classic & Balanced
              </span>
              {activeAesthetic === 'elegant' && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D]" />
              )}
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">
              Timeless, poised, and polished. Balanced satin lips, sculpted chignon, and coordinated accents.
            </p>
          </div>

          {/* Option 3: Bold and glamorous */}
          <div
            onClick={() => setActiveAesthetic('bold')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              activeAesthetic === 'bold'
                ? 'bg-[#FFD84D]/25 border-[#FFD84D] shadow-sm'
                : 'bg-white border-[#EAE7DD] hover:border-[#FFD84D]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#252525]">
                Option 3: Bold & Glamorous
              </span>
              {activeAesthetic === 'bold' && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D]" />
              )}
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">
              Statement-making, dramatic, and luminous. High-impact crimson or berry lips and sharp wings.
            </p>
          </div>
        </div>
      </div>

      {/* Complete Look Blueprint Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Outfit Styling & Hairstyle */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Outfit Styling & Drape */}
          <Card className="bg-white border-[#EAE7DD] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE7DD]">
              <div className="w-8 h-8 rounded-xl bg-[#FFF9E6] border border-[#FFD84D]/40 flex items-center justify-center">
                <Shirt size={16} className="text-[#252525]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#252525]">
                  1. Outfit Styling & Silhouette
                </h3>
                <span className="text-[11px] text-[#737373] capitalize">
                  Calibrated for {category} at {occasion}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#737373] leading-relaxed bg-[#FFFDF5] p-4 rounded-xl border border-[#EAE7DD]">
              {currentLook.occasionFitNote}
            </p>

            {/* Layering & Drape Recommendation */}
            <div>
              <span className="text-xs font-bold text-[#252525] block mb-1">
                Recommended Layering & Drape
              </span>
              <p className="text-xs text-[#737373] leading-relaxed">
                {category.toLowerCase().includes('saree')
                  ? 'Pleat the pallu with sharp structured folds pinned with an antique gold brooch on the left shoulder.'
                  : category.toLowerCase().includes('abaya')
                  ? 'Layer with a fluid open kimono duster in complementary cream georgette for breezy volume.'
                  : 'Pair with an ivory or matching structured stole draped over forearms for effortless formality.'}
              </p>
            </div>
          </Card>

          {/* 3. Hairstyle Recommendation */}
          <Card className="bg-white border-[#EAE7DD] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE7DD]">
              <div className="w-8 h-8 rounded-xl bg-[#FFF9E6] border border-[#FFD84D]/40 flex items-center justify-center">
                <Scissors size={16} className="text-[#252525]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#252525]">
                  3. Recommended Hairstyle
                </h3>
                <span className="text-[11px] text-[#737373]">
                  Flattering neckline and occasion harmony
                </span>
              </div>
            </div>

            <div className="bg-[#FFF9E6] p-4 rounded-xl border border-[#FFD84D]/40">
              <p className="text-sm font-bold text-[#252525]">{currentLook.hairstyle}</p>
              <p className="text-xs text-[#737373] mt-1">
                Complements the neckline of your {category.toLowerCase()} without competing with
                earrings or collar details.
              </p>
            </div>
          </Card>

          {/* 4. Accessories Palette Breakdown */}
          <Card className="bg-white border-[#EAE7DD] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE7DD]">
              <div className="w-8 h-8 rounded-xl bg-[#FFF9E6] border border-[#FFD84D]/40 flex items-center justify-center">
                <ShoppingBag size={16} className="text-[#252525]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#252525]">
                  4. Accessories Palette
                </h3>
                <span className="text-[11px] text-[#737373]">
                  Shoes, Bag, Jewelry & Modest Scarf
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Shoes */}
              {currentLook.shoes && (
                <div className="p-3 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] flex items-center gap-3">
                  <ColorSwatch
                    hex={currentLook.shoes.color.hex}
                    name={currentLook.shoes.color.name}
                    size="sm"
                    showHexLabel={false}
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#737373] block">
                      Footwear
                    </span>
                    <span className="text-xs font-bold text-[#252525]">
                      {currentLook.shoes.color.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Handbag */}
              {currentLook.handbag && (
                <div className="p-3 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] flex items-center gap-3">
                  <ColorSwatch
                    hex={currentLook.handbag.color.hex}
                    name={currentLook.handbag.color.name}
                    size="sm"
                    showHexLabel={false}
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#737373] block">
                      Bag / Clutch
                    </span>
                    <span className="text-xs font-bold text-[#252525]">
                      {currentLook.handbag.color.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Jewelry */}
              {currentLook.jewelry && (
                <div className="p-3 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] flex items-center gap-3">
                  <ColorSwatch
                    hex={currentLook.jewelry.color.hex}
                    name={currentLook.jewelry.color.name}
                    size="sm"
                    showHexLabel={false}
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#737373] block">
                      Jewelry Metal
                    </span>
                    <span className="text-xs font-bold text-[#252525]">
                      {currentLook.jewelry.color.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Hijab / Scarf */}
              {modestOption && currentLook.hijabOrScarf && (
                <div className="p-3 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] flex items-center gap-3">
                  <ColorSwatch
                    hex={currentLook.hijabOrScarf.color.hex}
                    name={currentLook.hijabOrScarf.color.name}
                    size="sm"
                    showHexLabel={false}
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#737373] block">
                      Hijab / Scarf
                    </span>
                    <span className="text-xs font-bold text-[#252525]">
                      {currentLook.hijabOrScarf.color.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Complete Makeup Coordination & Pro Tips */}
        <div className="lg:col-span-6 space-y-6">
          {/* 2. Makeup Blueprint */}
          <Card className="bg-white border-[#EAE7DD] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DD]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF4BF] border border-[#FFD84D] flex items-center justify-center">
                  <Sparkles size={16} className="text-[#252525]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#252525]">
                    2. Coordinated Makeup Look
                  </h3>
                  <span className="text-[11px] text-[#737373] capitalize">
                    {matchedCombo.label} Aesthetic
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFD84D] text-[#252525]">
                {matchedCombo.aesthetic.toUpperCase()}
              </span>
            </div>

            {/* Lip & Blush Pair */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#EAE7DD] flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#737373] mb-1">
                  Lipstick
                </span>
                <ColorSwatch
                  hex={matchedCombo.lipstick.hex}
                  name={matchedCombo.lipstick.name}
                  reason={matchedCombo.lipstick.description}
                  size="md"
                  showHexLabel={true}
                />
                <span className="text-[10px] text-[#737373] mt-1 capitalize">
                  {matchedCombo.lipstick.finish || 'Satin'} Finish
                </span>
              </div>

              <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#EAE7DD] flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#737373] mb-1">
                  Blush Tone
                </span>
                <ColorSwatch
                  hex={matchedCombo.blush.hex}
                  name={matchedCombo.blush.name}
                  reason={matchedCombo.blush.description}
                  size="md"
                  showHexLabel={true}
                />
                <span className="text-[10px] text-[#737373] mt-1 capitalize">
                  {matchedCombo.blush.finish || 'Luminous'} Flush
                </span>
              </div>
            </div>

            {/* Eyeshadow 5-Shade Row */}
            <div className="p-4 bg-[#FFFDF5] rounded-2xl border border-[#EAE7DD]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#252525] block mb-2">
                5-Shade Eyeshadow Layout
              </span>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div>
                  <ColorSwatch
                    hex={matchedCombo.eyeshadow.base.hex}
                    name={matchedCombo.eyeshadow.base.name}
                    size="mini"
                    showHexLabel={false}
                  />
                  <span className="text-[10px] font-bold text-[#252525] block mt-1">Base</span>
                </div>
                <div>
                  <ColorSwatch
                    hex={matchedCombo.eyeshadow.crease.hex}
                    name={matchedCombo.eyeshadow.crease.name}
                    size="mini"
                    showHexLabel={false}
                  />
                  <span className="text-[10px] font-bold text-[#252525] block mt-1">Crease</span>
                </div>
                <div>
                  <ColorSwatch
                    hex={matchedCombo.eyeshadow.lid.hex}
                    name={matchedCombo.eyeshadow.lid.name}
                    size="mini"
                    showHexLabel={false}
                  />
                  <span className="text-[10px] font-bold text-[#252525] block mt-1">Lid</span>
                </div>
                <div>
                  <ColorSwatch
                    hex={matchedCombo.eyeshadow.shimmer.hex}
                    name={matchedCombo.eyeshadow.shimmer.name}
                    size="mini"
                    showHexLabel={false}
                  />
                  <span className="text-[10px] font-bold text-[#252525] block mt-1">Shimmer</span>
                </div>
                <div>
                  <ColorSwatch
                    hex={matchedCombo.eyeshadow.outerCorner.hex}
                    name={matchedCombo.eyeshadow.outerCorner.name}
                    size="mini"
                    showHexLabel={false}
                  />
                  <span className="text-[10px] font-bold text-[#252525] block mt-1">Outer V</span>
                </div>
              </div>
            </div>

            {/* Liner & Mascara */}
            <div className="text-xs space-y-1.5 p-3.5 bg-[#FFF9E6]/60 rounded-xl border border-[#FFD84D]/30">
              <p>
                <strong className="text-[#252525]">Eyeliner:</strong> {matchedCombo.eyeliner}
              </p>
              <p>
                <strong className="text-[#252525]">Mascara:</strong> {matchedCombo.mascara}
              </p>
            </div>
          </Card>

          {/* 5. Styling Tips & Day-to-Night Transition */}
          <Card className="bg-[#FFFDF5] border-[#EAE7DD] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE7DD]">
              <Lightbulb size={18} className="text-[#FFD84D]" />
              <h3 className="font-display text-lg font-bold text-[#252525]">
                5. Pro Styling & Transition Rules
              </h3>
            </div>

            {/* Pro tips list */}
            <ul className="space-y-2 text-xs text-[#737373]">
              {currentLook.stylingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#252525] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            {/* What to Avoid */}
            <div className="p-3 bg-white rounded-xl border border-red-200 text-xs text-red-900 flex items-start gap-2">
              <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong>What to avoid:</strong> Avoid matching every single accessory in the exact
                same fabric as your dress. Mix matte and gloss textures to keep the look alive.
              </div>
            </div>

            {/* Day to Night tip */}
            <div className="p-3 bg-[#FFF9E6] rounded-xl border border-[#FFD84D]/40 text-xs text-[#252525] flex items-start gap-2">
              <SunMoon size={16} className="text-[#252525] shrink-0 mt-0.5" />
              <div>
                <strong>Day-to-night transition:</strong> Start the afternoon with a sheer dab of
                lipstick and nude ballet flats. At sunset, deepen lips with a berry pencil, swap to
                stiletto pumps, and dust shimmer across the inner corners.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
