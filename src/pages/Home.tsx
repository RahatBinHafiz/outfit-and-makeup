import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Palette,
  Wand2,
  Shirt,
  BookHeart,
  ArrowRight,
  Compass,
  Check,
  Heart,
  Layers,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ColorSwatch from '@/components/ui/ColorSwatch';
import DressColorSelector from '@/components/ColorMatcher/DressColorSelector';
import MakeupCombinationCard from '@/components/ColorMatcher/MakeupCombinationCard';
import { dressColors } from '@/data/dressColors';
import { matchDressColor } from '@/engine/colorEngine';
import { usePalettes } from '@/context/PaletteContext';
import { useWardrobe } from '@/context/WardrobeContext';

export default function Home() {
  const navigate = useNavigate();
  const { savedPalettes, savePalette, isSaved } = usePalettes();
  const { items: wardrobeItems } = useWardrobe();

  // Interactive dress color in hero / home section
  const [homeDressHexes, setHomeDressHexes] = useState<string[]>(['#6E1E2C']); // Burgundy preset

  const activeResult = useMemo(() => {
    return matchDressColor({ dressHexes: homeDressHexes }, 'your dress');
  }, [homeDressHexes]);

  const activePreset = dressColors.find(
    (c) => c.hex.toLowerCase() === homeDressHexes[0].toLowerCase()
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Welcoming Hero Section */}
      <section className="relative overflow-hidden bg-[#FFFDF5] border-b border-[#EAE7DD] pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525] shadow-xs">
                <Sparkles size={14} className="text-[#252525]" />
                <span>AI-Powered Personal Fashion & Beauty Consultant</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#252525] tracking-tight leading-[1.15]">
                Never wonder if your makeup{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#252525]">matches your dress</span>
                  <span className="absolute left-0 bottom-1.5 w-full h-3.5 bg-[#FFD84D] -z-0 rounded-sm" />
                </span>{' '}
                again.
              </h1>

              <p className="text-[#737373] text-base sm:text-lg leading-relaxed max-w-2xl">
                Suhana's Glamour answers your biggest styling questions in seconds. Discover which lipstick,
                eyeshadow palette, and blush complement your outfit, plus curated shoes, bags, and
                jewelry for every event.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link to="/create-my-look" className="w-full sm:w-auto">
                  <Button
                    id="hero-find-perfect-look-btn"
                    size="lg"
                    icon={<Wand2 size={18} />}
                    className="shadow-md w-full justify-center min-h-[48px]"
                  >
                    Find My Perfect Look
                  </Button>
                </Link>

                <Link to="/color-matcher" className="w-full sm:w-auto">
                  <Button
                    id="hero-open-matcher-btn"
                    variant="outline"
                    size="lg"
                    icon={<Palette size={18} />}
                    className="w-full justify-center min-h-[48px]"
                  >
                    Open Color Matcher Studio
                  </Button>
                </Link>
              </div>

              {/* Quick trust metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EAE7DD] max-w-lg">
                <div>
                  <span className="block font-display text-xl sm:text-2xl font-bold text-[#252525]">
                    28+
                  </span>
                  <span className="text-xs text-[#737373]">Curated Dress Tones</span>
                </div>
                <div>
                  <span className="block font-display text-xl sm:text-2xl font-bold text-[#252525]">
                    100%
                  </span>
                  <span className="text-xs text-[#737373]">Color Theory Based</span>
                </div>
                <div>
                  <span className="block font-display text-xl sm:text-2xl font-bold text-[#252525]">
                    3 Variations
                  </span>
                  <span className="text-xs text-[#737373]">Soft, Elegant & Bold</span>
                </div>
              </div>
            </div>

            {/* Hero Interactive Showcase Card */}
            <div className="lg:col-span-5">
              <Card className="bg-white border-[#EAE7DD] shadow-xl p-6 sm:p-7 relative">
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE7DD] mb-5">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-widest text-[#737373] block">
                      Live Preview Demonstration
                    </span>
                    <h2 className="font-display text-lg font-bold text-[#252525]">
                      {activePreset ? activePreset.name : 'Selected Dress'} Coordination
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFD84D] text-[#252525]">
                    Instant Match
                  </span>
                </div>

                {/* Dress Color Preview */}
                <div className="flex items-center gap-4 bg-[#FFFDF5] border border-[#EAE7DD] p-4 rounded-2xl mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl border border-black/10 shadow-sm shrink-0"
                    style={{ backgroundColor: homeDressHexes[0] }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#252525]">
                        {activePreset ? activePreset.name : 'Custom Shade'}
                      </p>
                      <span className="text-xs font-mono text-[#737373] bg-white px-2 py-0.5 rounded-full border border-[#EAE7DD]">
                        {homeDressHexes[0]}
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] mt-0.5">
                      {activeResult.harmonyAnalysis.temperatureVerdict.toUpperCase()} temperature ·{' '}
                      {activePreset?.description || 'Complementary harmony ready'}
                    </p>
                  </div>
                </div>

                {/* Recommended Lipstick preview */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#252525]">
                        Top Lipstick Shades
                      </span>
                      <span className="text-[11px] text-[#737373]">Tap to inspect</span>
                    </div>
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                      {activeResult.lipstick.slice(0, 4).map((item) => (
                        <ColorSwatch
                          key={item.shade.id}
                          hex={item.shade.hex}
                          name={item.shade.name}
                          reason={item.reason}
                          size="sm"
                          showHexLabel={false}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Coordinated Eyeshadow Bar */}
                  <div className="pt-3 border-t border-[#EAE7DD]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#252525] block mb-2">
                      Coordinated Eyeshadow Palette
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 p-2.5 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD]">
                      <ColorSwatch
                        hex={activeResult.eyeshadow[0].shade.hex}
                        name="Base"
                        size="mini"
                        showHexLabel={false}
                      />
                      <ColorSwatch
                        hex={activeResult.eyeshadow[1].shade.hex}
                        name="Crease"
                        size="mini"
                        showHexLabel={false}
                      />
                      <ColorSwatch
                        hex={activeResult.eyeshadow[2].shade.hex}
                        name="Lid"
                        size="mini"
                        showHexLabel={false}
                      />
                      <ColorSwatch
                        hex={activeResult.eyeshadow[3].shade.hex}
                        name="Shimmer"
                        size="mini"
                        showHexLabel={false}
                      />
                      <ColorSwatch
                        hex={activeResult.eyeshadow[4].shade.hex}
                        name="Outer V"
                        size="mini"
                        showHexLabel={false}
                      />
                    </div>
                  </div>

                  {/* Footwear & Jewelry hint */}
                  <div className="pt-3 border-t border-[#EAE7DD] flex items-center justify-between text-xs text-[#737373]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D]" />
                      <span>{activeResult.accessories[0].color.name} Shoes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EAE7DD]" />
                      <span>{activeResult.accessories[2].color.name}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/color-matcher?hex=${encodeURIComponent(homeDressHexes[0])}`}
                  className="mt-6 block"
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Explore Complete Color Guide
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Feature Showcase: Dedicated Dress-to-Makeup Matcher Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6" id="home-color-matcher-section">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#252525] bg-[#FFF9E6] px-3.5 py-1.5 rounded-full border border-[#FFD84D]/40">
            Flagship Interactive Tool
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#252525]">
            Dress-to-Makeup Color Matcher
          </h2>
          <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
            Select or customize your dress color below to watch your synchronized lipstick,
            eyeshadow, blush, and accessory swatches dynamically recalculate.
          </p>
        </div>

        {/* The Dress Color Selector */}
        <Card className="bg-white border-[#EAE7DD] p-6 sm:p-8 mb-8 shadow-sm">
          <h3 className="font-display text-xl font-bold text-[#252525] mb-2 flex items-center gap-2">
            <Palette className="text-[#FFD84D]" size={20} />
            Step 1: Choose or Pick Your Dress Color
          </h3>
          <p className="text-xs text-[#737373] mb-6">
            Choose from curated presets, search by name, input any HEX code, or use the color wheel.
          </p>

          <DressColorSelector
            selectedHexes={homeDressHexes}
            onChange={setHomeDressHexes}
            allowMultiple={true}
          />
        </Card>

        {/* Real-time Makeup Combinations Preview */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#252525]">
                Complete Makeup Combinations
              </h3>
              <p className="text-xs text-[#737373] mt-0.5">
                Three calibrated aesthetic harmonies for {homeDressHexes.join(' & ')}
              </p>
            </div>
            <Link to={`/color-matcher?hex=${encodeURIComponent(homeDressHexes[0])}`}>
              <Button variant="outline" size="sm" icon={<ArrowRight size={14} />}>
                View Detailed Studio Page
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeResult.combinations.map((combo) => (
              <MakeupCombinationCard
                key={combo.aesthetic}
                combination={combo}
                dressHexes={homeDressHexes}
                dressName={activePreset?.name || 'Custom Dress'}
                saved={isSaved(homeDressHexes, combo)}
                onSave={() =>
                  savePalette(
                    homeDressHexes,
                    combo,
                    `${combo.label} · ${activePreset?.name || homeDressHexes[0]}`,
                    activePreset?.name || 'Custom Dress'
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Popular Outfit & Makeup Inspiration Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <Card className="bg-[#FFFDF5] border-[#EAE7DD] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#737373] block mb-1">
                Curated Fashion Gallery
              </span>
              <h3 className="font-display text-2xl font-bold text-[#252525]">
                Popular Dress Colors & Instant Matches
              </h3>
              <p className="text-xs text-[#737373] mt-0.5">
                Tap any dress color to jump into the full styling studio with pre-loaded recommendations.
              </p>
            </div>
            <Link to="/color-matcher">
              <Button variant="secondary" size="md" icon={<Palette size={16} />}>
                All 28+ Colors
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {dressColors.slice(0, 16).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setHomeDressHexes([item.hex]);
                  navigate(`/color-matcher?hex=${encodeURIComponent(item.hex)}`);
                }}
                className="group flex flex-col items-center p-3 rounded-2xl bg-white border border-[#EAE7DD] hover:border-[#FFD84D] hover:shadow-sm transition-all text-center cursor-pointer active:scale-95"
              >
                <div
                  className="w-12 h-12 rounded-full border border-black/10 shadow-xs mb-2 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: item.hex }}
                />
                <span className="text-xs font-bold text-[#252525] truncate w-full">
                  {item.name}
                </span>
                <span className="text-[10px] text-[#737373] capitalize mt-0.5">
                  {item.family}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* 4. Quick Access to My Wardrobe, Lookbook & Style Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: My Wardrobe */}
          <Card className="bg-white hover:border-[#FFD84D] transition-colors p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9E6] border border-[#FFD84D]/40 flex items-center justify-center mb-4">
                <Shirt size={22} className="text-[#252525]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#252525] mb-2">
                My Digital Wardrobe
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed mb-4">
                Log the clothes you already own—by category, fabric, pattern, and occasion. Generate
                styled outfits and makeup palettes built straight from your closet.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE7DD] flex items-center justify-between">
              <span className="text-xs font-bold text-[#737373]">
                {wardrobeItems.length} items logged
              </span>
              <Link to="/wardrobe">
                <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>
                  Manage Wardrobe
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 2: My Lookbook */}
          <Card className="bg-white hover:border-[#FFD84D] transition-colors p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4BF] border border-[#FFD84D] flex items-center justify-center mb-4">
                <BookHeart size={22} className="text-[#252525]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#252525] mb-2">
                My Saved Lookbook
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed mb-4">
                Keep all your favorite dress-and-makeup combinations in one place. Rename, organize,
                filter by occasion, and share looks with friends.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE7DD] flex items-center justify-between">
              <span className="text-xs font-bold text-[#737373]">
                {savedPalettes.length} looks saved
              </span>
              <Link to="/lookbook">
                <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                  Open Lookbook
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 3: Interactive Color Studio */}
          <Card className="bg-white hover:border-[#FFD84D] transition-colors p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9E6] border border-[#FFD84D]/40 flex items-center justify-center mb-4">
                <Compass size={22} className="text-[#252525]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#252525] mb-2">
                Color Harmony Studio
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed mb-4">
                Dive into complementary, analogous, monochromatic, and triadic color theory. Test
                how contrasting accessories elevate neutral garments.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE7DD] flex items-center justify-between">
              <span className="text-xs font-bold text-[#737373]">Color Theory Tool</span>
              <Link to="/color-studio">
                <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>
                  Explore Studio
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
