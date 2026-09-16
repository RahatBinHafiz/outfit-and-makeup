import React, { useState } from 'react';
import { SwatchResult } from '@/types';
import Card from '@/components/ui/Card';
import ColorSwatch from '@/components/ui/ColorSwatch';
import { Sparkles, Info } from 'lucide-react';

interface PaletteSectionProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  results: SwatchResult[];
  categoryBadge?: string;
  eyeshadowLayout?: boolean;
}

export default function PaletteSection({
  title,
  subtitle,
  icon,
  results,
  categoryBadge,
  eyeshadowLayout = false,
}: PaletteSectionProps) {
  const [selectedResult, setSelectedResult] = useState<SwatchResult | null>(results[0] || null);

  return (
    <Card className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4 pb-3 border-b border-[#EAE7DD]">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#252525]">{icon}</span>}
            <h3 className="font-display text-lg font-bold text-[#252525]">{title}</h3>
          </div>
          <p className="text-xs text-[#737373] mt-0.5">{subtitle}</p>
        </div>
        {categoryBadge && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF9E6] text-[#252525] border border-[#FFD84D]/40 shrink-0">
            {categoryBadge}
          </span>
        )}
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {results.map((r) => {
          const isInspected = selectedResult?.shade.id === r.shade.id;
          return (
            <div
              key={r.shade.id}
              onClick={() => setSelectedResult(r)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                isInspected
                  ? 'bg-[#FFF9E6] border-[#FFD84D] shadow-xs'
                  : 'bg-[#FFFDF5] border-[#EAE7DD] hover:border-[#FFD84D]/60 hover:bg-white'
              }`}
            >
              <ColorSwatch
                hex={r.shade.hex}
                name={r.shade.name}
                reason={r.reason}
                family={r.shade.family}
                finish={r.shade.finish}
                size="md"
                showHexLabel={true}
              />
              <span className="text-[10px] font-semibold text-[#737373] mt-1 bg-white px-2 py-0.5 rounded-full border border-[#EAE7DD]">
                Score: {Math.round(r.score * 100)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Live Stylist Insight Callout Box */}
      {selectedResult && (
        <div className="mt-auto bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: selectedResult.shade.hex }}
              />
              <span className="text-xs font-bold text-[#252525]">
                {selectedResult.shade.name} ({selectedResult.shade.hex})
              </span>
            </div>
            {selectedResult.shade.finish && (
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider">
                {selectedResult.shade.finish}
              </span>
            )}
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            {selectedResult.reason}
          </p>
        </div>
      )}
    </Card>
  );
}
