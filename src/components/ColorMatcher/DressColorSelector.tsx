import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  X,
  Pipette,
  Sparkles,
  Layers,
  HelpCircle,
  Check,
} from 'lucide-react';
import { dressColors, searchDressColors } from '@/data/dressColors';
import { isValidHex, normalizeHex, readableTextColor } from '@/utils/colorUtils';
import Button from '@/components/ui/Button';

interface DressColorSelectorProps {
  selectedHexes: string[];
  onChange: (hexes: string[]) => void;
  allowMultiple?: boolean;
}

export default function DressColorSelector({
  selectedHexes,
  onChange,
  allowMultiple = true,
}: DressColorSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customHexInput, setCustomHexInput] = useState('');
  const [hexError, setHexError] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string>('All');

  const filteredPresetColors = useMemo(() => {
    let list = searchDressColors(searchQuery);
    if (selectedFamily !== 'All') {
      list = list.filter((c) => c.family === selectedFamily);
    }
    return list;
  }, [searchQuery, selectedFamily]);

  const families = useMemo(() => {
    const set = new Set<string>();
    dressColors.forEach((c) => set.add(c.family));
    return ['All', ...Array.from(set)];
  }, []);

  const handleToggleColor = (hex: string) => {
    const norm = hex.toUpperCase();
    if (selectedHexes.includes(norm)) {
      if (selectedHexes.length === 1) {
        // Keep at least one color selected
        return;
      }
      onChange(selectedHexes.filter((h) => h !== norm));
    } else {
      if (allowMultiple) {
        onChange([...selectedHexes, norm]);
      } else {
        onChange([norm]);
      }
    }
  };

  const handleAddCustomHex = () => {
    if (!isValidHex(customHexInput)) {
      setHexError('Please enter a valid 3- or 6-digit HEX code (e.g. #C98F72)');
      return;
    }
    const normalized = normalizeHex(customHexInput);
    setHexError(null);
    if (allowMultiple) {
      if (!selectedHexes.includes(normalized)) {
        onChange([...selectedHexes, normalized]);
      }
    } else {
      onChange([normalized]);
    }
    setCustomHexInput('');
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (allowMultiple) {
      if (!selectedHexes.includes(val)) {
        onChange([...selectedHexes, val]);
      }
    } else {
      onChange([val]);
    }
  };

  return (
    <div className="space-y-6" id="dress-color-selector-container">
      {/* Active Selected Dress Colors Header */}
      <div className="bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D] animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#252525]">
              Active Dress Color Palette ({selectedHexes.length})
            </span>
          </div>
          {allowMultiple && (
            <span className="text-xs text-[#737373] flex items-center gap-1">
              <Layers size={13} className="text-[#FFD84D]" />
              Pattern / Multi-color mode active
            </span>
          )}
        </div>

        {/* Selected Swatches list */}
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedHexes.map((hex, idx) => {
            const preset = dressColors.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
            const name = preset ? preset.name : `Custom Shade ${idx + 1}`;
            return (
              <div
                key={hex}
                className="flex items-center gap-2 bg-white border border-[#EAE7DD] shadow-xs rounded-full pl-2 pr-3 py-1.5 transition-all hover:border-[#252525]"
              >
                <div
                  className="w-6 h-6 rounded-full border border-black/10 shadow-inner shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#252525] leading-none">{name}</span>
                  <span className="text-[10px] font-mono text-[#737373] leading-none mt-0.5">
                    {hex}
                  </span>
                </div>
                {selectedHexes.length > 1 && (
                  <button
                    onClick={() => handleToggleColor(hex)}
                    className="text-[#737373] hover:text-red-600 p-0.5 rounded-full transition-colors ml-1"
                    title={`Remove ${name}`}
                    aria-label={`Remove ${name}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search, Custom HEX & Native Color Picker Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Name Search Input */}
        <div className="md:col-span-6 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
          />
          <input
            id="dress-color-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dress colors (e.g. burgundy, navy, blush, emerald)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#EAE7DD] rounded-full text-base sm:text-sm text-[#252525] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD84D] focus:border-[#FFD84D]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#252525] p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Custom HEX Code Input */}
        <div className="md:col-span-4 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#737373]">
              #
            </span>
            <input
              id="dress-custom-hex-input"
              type="text"
              value={customHexInput.replace('#', '')}
              onChange={(e) => {
                setCustomHexInput(e.target.value);
                setHexError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustomHex();
              }}
              placeholder="Custom HEX"
              className="w-full pl-8 pr-3 py-3 bg-white border border-[#EAE7DD] rounded-full text-base sm:text-sm font-mono text-[#252525] uppercase placeholder:normal-case placeholder:font-sans placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD84D] focus:border-[#FFD84D]"
            />
          </div>
          <Button
            id="btn-add-custom-hex"
            variant="secondary"
            size="md"
            onClick={handleAddCustomHex}
            icon={<Plus size={16} />}
            className="shrink-0 min-h-[44px]"
          >
            Add
          </Button>
        </div>

        {/* Interactive Eyedropper / Color Wheel Picker */}
        <div className="md:col-span-2">
          <label
            htmlFor="dress-native-color-picker"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 min-h-[44px] bg-white hover:bg-[#FFF9E6] border border-[#EAE7DD] hover:border-[#FFD84D] rounded-full text-sm font-semibold text-[#252525] cursor-pointer transition-colors shadow-xs active:scale-95"
            title="Pick any custom color"
          >
            <Pipette size={16} className="text-[#FFD84D]" />
            <span>Color Wheel</span>
            <input
              id="dress-native-color-picker"
              type="color"
              defaultValue={selectedHexes[0] || '#6E1E2C'}
              onChange={handleColorPickerChange}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {hexError && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
          {hexError}
        </p>
      )}

      {/* Color Family Filter Chips */}
      <div className="-mx-1 px-1 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
        <span className="text-xs font-bold text-[#737373] shrink-0 mr-1 uppercase tracking-wider">
          Filter:
        </span>
        {families.map((fam) => (
          <button
            key={fam}
            onClick={() => setSelectedFamily(fam)}
            className={`text-xs px-3 py-2 sm:py-1.5 min-h-[36px] sm:min-h-0 rounded-full font-semibold transition-colors shrink-0 ${
              selectedFamily === fam
                ? 'bg-[#252525] text-[#FFD84D]'
                : 'bg-white border border-[#EAE7DD] text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
            }`}
          >
            {fam}
          </button>
        ))}
      </div>

      {/* Visual Palette Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2.5 sm:gap-3 pt-1">
        {filteredPresetColors.map((color) => {
          const isSelected = selectedHexes.includes(color.hex.toUpperCase());
          return (
            <button
              key={color.id}
              onClick={() => handleToggleColor(color.hex)}
              className={`group flex flex-col items-center p-2 rounded-2xl transition-all duration-150 cursor-pointer touch-manipulation active:scale-95 ${
                isSelected
                  ? 'bg-[#FFF9E6] border-2 border-[#FFD84D] shadow-xs scale-105'
                  : 'hover:bg-[#FFFDF5] border border-transparent hover:border-[#EAE7DD]'
              }`}
              aria-label={`Select ${color.name}`}
            >
              <div className="relative">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-black/10 shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-[#252525] text-[#FFD84D] rounded-full p-0.5 shadow-sm">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium text-[#252525] mt-1.5 truncate w-full text-center">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>

      {filteredPresetColors.length === 0 && (
        <div className="text-center py-8 bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl">
          <p className="text-sm text-[#737373] mb-2">No preset color found for "{searchQuery}".</p>
          <p className="text-xs text-[#252525] font-semibold">
            Use the HEX input above or tap the Color Wheel to pick any color code!
          </p>
        </div>
      )}
    </div>
  );
}
