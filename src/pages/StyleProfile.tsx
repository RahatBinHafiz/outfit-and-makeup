import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Check,
  RotateCcw,
  Palette,
  Heart,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { dressColors } from '@/data/dressColors';
import { UndertoneOption, MakeupIntensity } from '@/types';

const FASHION_STYLES = [
  'Classic',
  'Modern Minimalist',
  'Glamorous',
  'Boho Chic',
  'Traditional / Heritage',
  'Vintage Elegance',
  'Streetwear Contemporary',
  'Romantic Soft',
];

export default function StyleProfile() {
  const { profile, updateProfile, togglePreferredColor, toggleFavoriteStyle, resetProfile } =
    useProfile();

  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525]">
          <User size={14} className="text-[#252525]" />
          <span>Personal Preferences & Identity</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
          Personal Style Profile
        </h1>
        <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
          Configure your style persona, favorite clothing palettes, makeup intensity, and modesty
          options. All Suhana's Glamour generators calibrate to your settings.
        </p>
      </div>

      {savedBanner && (
        <div className="p-4 bg-[#FFF9E6] border border-[#FFD84D] rounded-2xl flex items-center gap-2 text-xs font-bold text-[#252525] shadow-xs animate-in fade-in">
          <CheckCircle2 size={16} className="text-green-700" />
          <span>Your style preferences have been successfully updated!</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <Card className="bg-white border-[#EAE7DD] p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Profile Name */}
        <div>
          <label className="text-xs font-semibold text-[#252525] block mb-1">
            Display Name / Stylist Alias
          </label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="e.g. Sophia, Fashion Enthusiast"
            className="w-full max-w-md px-4 py-2.5 min-h-[44px] bg-[#FFFDF5] border border-[#EAE7DD] rounded-xl text-base sm:text-sm font-semibold text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
          />
        </div>

        {/* Skin Undertone Preference */}
        <div className="pt-6 border-t border-[#EAE7DD] space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#252525] block">
            Skin Undertone Setting
          </span>
          <p className="text-xs text-[#737373]">
            Optional guide to fine-tune blush and lipstick temperature compatibility:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'unspecified', label: 'No Preference', desc: 'Matched purely by fabric color' },
              { id: 'warm', label: 'Warm', desc: 'Golden, peach, olive veins' },
              { id: 'cool', label: 'Cool', desc: 'Rosy, pink, bluish veins' },
              { id: 'neutral', label: 'Neutral', desc: 'Balanced warm & cool' },
            ].map((u) => (
              <button
                key={u.id}
                onClick={() => updateProfile({ defaultUndertone: u.id as UndertoneOption })}
                className={`p-3.5 rounded-2xl border text-left transition-all touch-manipulation active:scale-[0.98] ${
                  profile.defaultUndertone === u.id
                    ? 'bg-[#FFF9E6] border-[#FFD84D] shadow-xs'
                    : 'bg-[#FFFDF5] border-[#EAE7DD] hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold text-[#252525] block mb-0.5">{u.label}</span>
                <span className="text-[11px] text-[#737373] leading-tight block">{u.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Makeup Intensity Preference */}
        <div className="pt-6 border-t border-[#EAE7DD] space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#252525] block">
            Preferred Makeup Intensity
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light & Sheer', desc: 'Tinted balms, soft brows, dewy skin' },
              { id: 'medium', label: 'Medium & Polished', desc: 'Satin lips, crease contour, balanced blush' },
              { id: 'full', label: 'Full Glam & Sculpted', desc: 'High pigment lips, wings, false-lash lift' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => updateProfile({ preferredIntensity: m.id as MakeupIntensity })}
                className={`p-4 rounded-2xl border text-left transition-all touch-manipulation active:scale-[0.98] ${
                  profile.preferredIntensity === m.id
                    ? 'bg-[#FFF4BF] border-[#FFD84D] shadow-xs'
                    : 'bg-[#FFFDF5] border-[#EAE7DD] hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold text-[#252525] block mb-0.5">{m.label}</span>
                <span className="text-[11px] text-[#737373] leading-tight block">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modest Fashion Toggle */}
        <div className="pt-6 border-t border-[#EAE7DD]">
          <label className="flex items-start gap-3 p-4 bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl cursor-pointer hover:bg-[#FFF9E6] active:scale-[0.99] transition-all">
            <input
              type="checkbox"
              checked={profile.modestFashion}
              onChange={(e) => updateProfile({ modestFashion: e.target.checked })}
              className="w-4 h-4 mt-0.5 accent-[#FFD84D] rounded"
            />
            <div>
              <span className="text-xs font-bold text-[#252525] block">
                Modest Fashion Preferences
              </span>
              <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">
                When enabled, outfit blueprints prioritize matching hijabs, scarves, layering
                shrugs, and graceful full-coverage styling.
              </p>
            </div>
          </label>
        </div>

        {/* Favorite Fashion Styles */}
        <div className="pt-6 border-t border-[#EAE7DD] space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#252525] block">
            Signature Fashion Styles
          </span>
          <div className="flex flex-wrap gap-2">
            {FASHION_STYLES.map((style) => {
              const isSelected = profile.favoriteStyles.includes(style);
              return (
                <button
                  key={style}
                  onClick={() => toggleFavoriteStyle(style)}
                  className={`text-xs px-3.5 py-2 sm:py-1.5 min-h-[38px] sm:min-h-0 rounded-full font-semibold transition-colors touch-manipulation active:scale-95 ${
                    isSelected
                      ? 'bg-[#252525] text-[#FFD84D]'
                      : 'bg-[#FFFDF5] border border-[#EAE7DD] text-[#737373] hover:text-[#252525] hover:bg-white'
                  }`}
                >
                  {isSelected && <Check size={12} className="inline mr-1" />}
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorite Color Palette */}
        <div className="pt-6 border-t border-[#EAE7DD] space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#252525] block">
            Preferred Clothing Colors
          </span>
          <p className="text-xs text-[#737373]">
            Select colors you love wearing. Suhana's Glamour uses these to prioritize quick-pick shortcuts:
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 sm:gap-2.5 pt-1">
            {dressColors.map((c) => {
              const isSelected = profile.preferredColors.includes(c.hex.toUpperCase());
              return (
                <button
                  key={c.id}
                  onClick={() => togglePreferredColor(c.hex.toUpperCase())}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all touch-manipulation active:scale-95 min-h-[50px] ${
                    isSelected
                      ? 'bg-[#FFF9E6] border-[#FFD84D] scale-105 shadow-xs'
                      : 'border-transparent hover:border-[#EAE7DD]'
                  }`}
                  title={c.name}
                >
                  <div
                    className="w-8 h-8 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] font-medium text-[#737373] truncate w-full text-center mt-1">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-[#EAE7DD] flex items-center justify-between">
          <button
            onClick={resetProfile}
            className="text-xs text-[#737373] hover:text-[#252525] flex items-center gap-1.5 font-semibold"
          >
            <RotateCcw size={13} />
            Reset Defaults
          </button>

          <Button variant="primary" size="md" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}
