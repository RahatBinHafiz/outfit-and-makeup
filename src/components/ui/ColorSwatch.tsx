import React, { useState } from 'react';
import { Copy, Check, X, Sparkles, ExternalLink } from 'lucide-react';
import { readableTextColor } from '@/utils/colorUtils';

interface ColorSwatchProps {
  hex: string;
  name: string;
  reason?: string;
  family?: string;
  finish?: string;
  size?: 'sm' | 'md' | 'lg' | 'mini';
  selected?: boolean;
  onSelect?: () => void;
  showHexLabel?: boolean;
  className?: string;
  id?: string;
}

const sizeStyles = {
  mini: 'w-7 h-7 rounded-full',
  sm: 'w-10 h-10 rounded-full',
  md: 'w-14 h-14 rounded-2xl',
  lg: 'w-20 h-20 rounded-2xl',
};

export default function ColorSwatch({
  hex,
  name,
  reason,
  family,
  finish,
  size = 'md',
  selected = false,
  onSelect,
  showHexLabel = true,
  className = '',
  id,
}: ColorSwatchProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    } else {
      setModalOpen(true);
    }
  };

  const copyHex = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isLight = hex.toUpperCase() === '#FFFFFF' || hex.toUpperCase() === '#FAF6EE' || hex.toUpperCase() === '#F3EDE2';

  return (
    <>
      <div
        id={id}
        className={`group flex flex-col items-center text-center cursor-pointer transition-transform duration-150 active:scale-95 ${className}`}
        onClick={handleClick}
        title={`${name} (${hex})`}
      >
        <div className="relative">
          <div
            className={`${sizeStyles[size]} border transition-all duration-200 group-hover:scale-105 ${
              selected
                ? 'ring-3 ring-[#FFD84D] ring-offset-2 border-[#252525] shadow-md'
                : 'border-[#EAE7DD] shadow-[0_2px_8px_rgba(37,37,37,0.06)] group-hover:shadow-md'
            }`}
            style={{
              backgroundColor: hex,
            }}
          />
          {selected && (
            <div className="absolute -top-1 -right-1 bg-[#252525] text-[#FFD84D] rounded-full p-0.5 shadow-sm">
              <Check size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        {size !== 'mini' && (
          <div className="mt-2 w-full max-w-[90px]">
            <p className="text-xs font-medium text-[#252525] truncate" title={name}>
              {name}
            </p>
            {showHexLabel && (
              <p className="text-[11px] font-mono text-[#737373] tracking-tighter truncate">
                {hex}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Swatch Detail Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-[#EAE7DD] shadow-2xl max-w-md w-full overflow-hidden p-6 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#737373] hover:text-[#252525] bg-white/80 hover:bg-[#FFF9E6] p-2 rounded-full transition-colors"
              aria-label="Close swatch detail"
            >
              <X size={18} />
            </button>

            {/* Color Display Card */}
            <div
              className="w-full h-36 rounded-2xl p-4 flex flex-col justify-between border border-[#EAE7DD] shadow-inner mb-5 relative overflow-hidden"
              style={{
                backgroundColor: hex,
                color: readableTextColor(hex),
              }}
            >
              <div className="flex items-center justify-between">
                {family && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-md uppercase tracking-wider">
                    {family}
                  </span>
                )}
                {finish && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-md capitalize">
                    {finish} finish
                  </span>
                )}
              </div>
              <div>
                <p className="font-display text-2xl font-bold tracking-tight">{name}</p>
                <p className="text-xs font-mono opacity-90">{hex}</p>
              </div>
            </div>

            {/* HEX & Copy Action */}
            <div className="flex items-center justify-between bg-[#FFFDF5] border border-[#EAE7DD] rounded-xl px-4 py-3 mb-4">
              <div>
                <span className="text-xs text-[#737373] uppercase font-semibold tracking-wider block">
                  Color HEX Code
                </span>
                <span className="font-mono text-base font-bold text-[#252525]">{hex}</span>
              </div>
              <button
                onClick={copyHex}
                className="flex items-center gap-1.5 bg-[#FFD84D] hover:bg-[#FACC15] text-[#252525] px-3.5 py-2 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-sm"
              >
                {copied ? <Check size={14} className="text-green-700" /> : <Copy size={14} />}
                {copied ? 'Copied to clipboard!' : 'Copy HEX'}
              </button>
            </div>

            {/* Reason Explanation */}
            {reason ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#252525] uppercase tracking-wider">
                  <Sparkles size={14} className="text-[#FFD84D]" />
                  Why this complements your look
                </div>
                <p className="text-sm text-[#737373] leading-relaxed bg-[#FFF9E6]/60 p-3.5 rounded-xl border border-[#FFD84D]/30">
                  {reason}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#737373] italic">
                A versatile shade calibrated for styling synergy.
              </p>
            )}

            <div className="mt-5 pt-4 border-t border-[#EAE7DD] flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="text-sm font-semibold text-[#252525] px-4 py-2 hover:bg-[#FFF9E6] rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
