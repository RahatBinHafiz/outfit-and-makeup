import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookHeart,
  Trash2,
  Edit2,
  Share2,
  Check,
  Palette,
  Sparkles,
  Calendar,
  Filter,
  ArrowRight,
  Search,
} from 'lucide-react';
import { usePalettes } from '@/context/PaletteContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';

export default function Lookbook() {
  const { savedPalettes, removePalette, renamePalette } = usePalettes();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique tags/occasions
  const allTags = useMemo(() => {
    const set = new Set<string>();
    savedPalettes.forEach((p) => {
      p.tags?.forEach((t) => set.add(t));
      if (p.occasion) set.add(p.occasion);
    });
    return ['All', ...Array.from(set)];
  }, [savedPalettes]);

  const filteredLooks = useMemo(() => {
    return savedPalettes.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.dressName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.combination.label.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTag =
        selectedTag === 'All' ||
        p.tags?.includes(selectedTag) ||
        p.occasion === selectedTag;

      return matchSearch && matchTag;
    });
  }, [savedPalettes, searchQuery, selectedTag]);

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditNameValue(currentName);
  };

  const handleConfirmRename = (id: string) => {
    renamePalette(id, editNameValue);
    setEditingId(null);
  };

  const handleShareLook = async (p: typeof savedPalettes[0]) => {
    const text = `Check out my StyleSync look: ${p.name} (${p.dressHexes.join(
      ', '
    )}) with ${p.combination.lipstick.name} lipstick!`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: p.name,
          text,
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedId(p.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525]">
            <BookHeart size={14} className="text-[#252525]" />
            <span>Curated Look Archive</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
            My Lookbook
          </h1>
          <p className="text-[#737373] text-sm sm:text-base max-w-xl leading-relaxed">
            Your personalized vault of saved outfit and makeup combinations. Organize, rename, or
            tap to re-open any look inside the Dress-to-Makeup Matcher.
          </p>
        </div>

        <Link to="/color-matcher" className="w-full sm:w-auto">
          <Button variant="primary" size="md" icon={<Palette size={16} />} className="w-full sm:w-auto min-h-[44px] justify-center">
            Match a New Dress
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="bg-white border-[#EAE7DD] p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved looks by title or outfit..."
            className="w-full pl-11 pr-4 py-2.5 min-h-[44px] bg-[#FFFDF5] border border-[#EAE7DD] rounded-full text-base sm:text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
          />
        </div>

        {allTags.length > 1 && (
          <div className="-mx-1 px-1 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 touch-pan-x">
            <span className="text-xs font-bold text-[#737373] uppercase tracking-wider shrink-0 mr-1">
              Filter Tags:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3.5 py-2 sm:py-1.5 min-h-[36px] sm:min-h-0 rounded-full font-semibold transition-colors shrink-0 capitalize touch-manipulation active:scale-95 ${
                  selectedTag === tag
                    ? 'bg-[#252525] text-[#FFD84D]'
                    : 'bg-white border border-[#EAE7DD] text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Saved Looks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLooks.map((look) => {
          const isEditing = editingId === look.id;

          return (
            <Card
              key={look.id}
              className="bg-white hover:border-[#FFD84D] transition-colors p-6 flex flex-col justify-between"
            >
              <div>
                {/* Top controls */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#EAE7DD]">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#FFF4BF] text-[#252525] border border-[#FFD84D]/40">
                    {look.combination.label}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShareLook(look)}
                      className="text-[#737373] hover:text-[#252525] p-1.5 rounded-full hover:bg-[#FFF9E6] transition-colors"
                      title="Share Look"
                      aria-label="Share Look"
                    >
                      {copiedId === look.id ? (
                        <Check size={14} className="text-green-700" />
                      ) : (
                        <Share2 size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleStartRename(look.id, look.name)}
                      className="text-[#737373] hover:text-[#252525] p-1.5 rounded-full hover:bg-[#FFF9E6] transition-colors"
                      title="Rename Look"
                      aria-label="Rename Look"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => removePalette(look.id)}
                      className="text-[#737373] hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete Look"
                      aria-label="Delete Look"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Name / Rename Input */}
                {isEditing ? (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-[#FFD84D] rounded-lg text-sm font-bold text-[#252525]"
                    />
                    <button
                      onClick={() => handleConfirmRename(look.id)}
                      className="px-3 py-1 bg-[#FFD84D] text-[#252525] text-xs font-bold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h3 className="font-display text-xl font-bold text-[#252525] mb-1">
                    {look.name}
                  </h3>
                )}

                <p className="text-xs text-[#737373] mb-4">
                  {look.dressName || 'Custom Dress'} · Added{' '}
                  {new Date(look.createdAt).toLocaleDateString()}
                </p>

                {/* Color Swatch Snapshot */}
                <div className="bg-[#FFFDF5] border border-[#EAE7DD] rounded-2xl p-4 mb-4 space-y-3">
                  {/* Dress Color Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#737373]">
                      Dress Tone
                    </span>
                    <div className="flex items-center gap-1.5">
                      {look.dressHexes.map((hex) => (
                        <div
                          key={hex}
                          className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Lipstick & Blush preview */}
                  <div className="pt-2 border-t border-[#EAE7DD] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-black/10"
                        style={{ backgroundColor: look.combination.lipstick.hex }}
                      />
                      <span className="text-xs font-semibold text-[#252525]">
                        {look.combination.lipstick.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#737373] capitalize">
                      {look.combination.lipstick.finish || 'Satin'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-black/10"
                        style={{ backgroundColor: look.combination.blush.hex }}
                      />
                      <span className="text-xs font-semibold text-[#252525]">
                        {look.combination.blush.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#737373]">Cheek Blush</span>
                  </div>
                </div>

                <p className="text-xs text-[#737373] leading-relaxed mb-4">
                  {look.combination.description}
                </p>
              </div>

              {/* Action Button: Re-open in Color Matcher */}
              <div className="pt-3 border-t border-[#EAE7DD]">
                <Link
                  to={`/color-matcher?hex=${encodeURIComponent(look.dressHexes[0])}`}
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={<ArrowRight size={14} />}
                    iconPosition="right"
                  >
                    Open in Color Matcher
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredLooks.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#EAE7DD] rounded-3xl p-8 space-y-3">
          <BookHeart size={32} className="mx-auto text-[#FFD84D]" />
          <h3 className="font-display text-xl font-bold text-[#252525]">No saved looks</h3>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            Save any combination from the Dress-to-Makeup Color Matcher or Look Generator to build
            your personal style collection.
          </p>
          <Link to="/color-matcher">
            <Button variant="primary" size="sm" icon={<Palette size={14} />}>
              Explore Color Matcher
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
