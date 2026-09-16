import React, { useState } from 'react';
import { MakeupCombination } from '@/types';
import Card from '@/components/ui/Card';
import ColorSwatch from '@/components/ui/ColorSwatch';
import Button from '@/components/ui/Button';
import { Heart, Sparkles, Check, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MakeupCombinationCardProps {
  combination: MakeupCombination;
  dressHexes: string[];
  dressName?: string;
  onSave?: () => void;
  saved?: boolean;
}

const aestheticBadges: Record<string, { bg: string; text: string; border: string }> = {
  soft: {
    bg: 'bg-[#FFF9E6]',
    text: 'text-[#252525]',
    border: 'border-[#FFD84D]/40',
  },
  elegant: {
    bg: 'bg-[#FFF4BF]',
    text: 'text-[#252525]',
    border: 'border-[#FFD84D]',
  },
  bold: {
    bg: 'bg-[#FFD84D]',
    text: 'text-[#252525]',
    border: 'border-[#F5CD3D]',
  },
};

export default function MakeupCombinationCard({
  combination,
  dressHexes,
  dressName,
  onSave,
  saved = false,
}: MakeupCombinationCardProps) {
  const [showTips, setShowTips] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const badge = aestheticBadges[combination.aesthetic] || aestheticBadges.elegant;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSave) {
      onSave();
      if (!saved) {
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2500);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#FFD84D', '#FFF4BF', '#C89279', '#DE8B95'],
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const eyeshadowShades = [
    { role: 'Base', shade: combination.eyeshadow.base },
    { role: 'Crease', shade: combination.eyeshadow.crease },
    { role: 'Lid', shade: combination.eyeshadow.lid },
    { role: 'Shimmer', shade: combination.eyeshadow.shimmer },
    { role: 'Outer V', shade: combination.eyeshadow.outerCorner },
  ];

  return (
    <Card className="flex flex-col h-full bg-white border-[#EAE7DD] hover:border-[#FFD84D] transition-colors relative overflow-hidden">
      {/* Top Bar: Aesthetic badge + Save button */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EAE7DD]">
        <span
          className={`text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-2xs uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
        >
          {combination.label}
        </span>

        {onSave && (
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-full border transition-all active:scale-90 ${
              saved || justSaved
                ? 'bg-[#252525] text-[#FFD84D] border-[#252525] shadow-xs'
                : 'bg-[#FFFDF5] text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6] border-[#EAE7DD]'
            }`}
            title={saved ? 'Saved in My Lookbook' : 'Save to My Lookbook'}
            aria-label="Save look"
          >
            <Heart size={18} fill={saved || justSaved ? '#FFD84D' : 'none'} />
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-[#737373] leading-relaxed mb-6">
        {combination.description}
      </p>

      {/* Coordinated Eyeshadow Palette Row */}
      <div className="bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#252525]">
            Coordinated Eyeshadow Palette
          </span>
          <span className="text-[10px] text-[#737373] font-medium">5 Cohesive Tones</span>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {eyeshadowShades.map(({ role, shade }) => (
            <div key={shade.id} className="flex flex-col items-center">
              <ColorSwatch
                hex={shade.hex}
                name={shade.name}
                reason={shade.description}
                size="sm"
                showHexLabel={false}
              />
              <span className="text-[10px] font-bold text-[#252525] mt-1">{role}</span>
              <span className="text-[9px] font-mono text-[#737373]">{shade.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lip & Cheek Duos */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Lipstick */}
        <div className="p-3.5 bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl flex flex-col items-center text-center">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#737373] mb-2">
            Lipstick Pick
          </span>
          <ColorSwatch
            hex={combination.lipstick.hex}
            name={combination.lipstick.name}
            reason={combination.lipstick.description}
            size="md"
            showHexLabel={true}
          />
          <span className="text-[10px] font-semibold text-[#252525] bg-white px-2 py-0.5 rounded-full border border-[#EAE7DD] mt-2 capitalize">
            {combination.lipstick.finish || 'Satin'} Finish
          </span>
        </div>

        {/* Blush */}
        <div className="p-3.5 bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl flex flex-col items-center text-center">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#737373] mb-2">
            Complementary Blush
          </span>
          <ColorSwatch
            hex={combination.blush.hex}
            name={combination.blush.name}
            reason={combination.blush.description}
            size="md"
            showHexLabel={true}
          />
          <span className="text-[10px] font-semibold text-[#252525] bg-white px-2 py-0.5 rounded-full border border-[#EAE7DD] mt-2 capitalize">
            {combination.blush.finish || 'Satin'} Flush
          </span>
        </div>
      </div>

      {/* Eyeliner & Mascara Details */}
      <div className="bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl p-4 space-y-2 mb-4">
        <div>
          <span className="text-xs font-bold text-[#252525] block">Eyeliner Recommendation</span>
          <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">{combination.eyeliner}</p>
        </div>
        <div className="pt-2 border-t border-[#EAE7DD]">
          <span className="text-xs font-bold text-[#252525] block">Mascara & Lash Styling</span>
          <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">{combination.mascara}</p>
        </div>
      </div>

      {/* Collapsible Pro Tips */}
      <div className="mt-auto pt-3 border-t border-[#EAE7DD]">
        <button
          onClick={() => setShowTips((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#252525] hover:text-[#737373] py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#FFD84D]" />
            Stylist Application Tips ({combination.proTips.length})
          </span>
          {showTips ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showTips && (
          <ul className="mt-3 space-y-2 text-xs text-[#737373] bg-[#FFF9E6]/60 p-3 rounded-xl border border-[#FFD84D]/30 animate-in fade-in duration-150">
            {combination.proTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <CheckCircle2 size={13} className="text-[#252525] shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
