import React, { useState, useMemo } from 'react';
import {
  Shirt,
  Plus,
  Search,
  Filter,
  Trash2,
  Sparkles,
  Upload,
  X,
  Palette,
  Eye,
  ShoppingBag,
  ArrowRight,
  Layers,
  Heart,
} from 'lucide-react';
import { useWardrobe } from '@/context/WardrobeContext';
import { WardrobeItem, Occasion } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';
import { matchDressColor } from '@/engine/colorEngine';
import { generateCompleteLook } from '@/engine/lookGenerator';
import { dressColors } from '@/data/dressColors';
import { isValidHex, normalizeHex } from '@/utils/colorUtils';

const CATEGORIES = [
  'All',
  'Dress',
  'Gown',
  'Saree',
  'Top',
  'Jacket',
  'Abaya',
  'Skirt',
  'Pants',
  'Shoes',
  'Bag',
];

const FABRICS = ['Silk', 'Cotton', 'Linen', 'Velvet', 'Chiffon', 'Wool', 'Satin', 'Denim'];
const PATTERNS = ['Solid', 'Floral', 'Striped', 'Embroidered', 'Polka Dot', 'Abstract'];
const STYLES = ['Classic', 'Modern Minimalist', 'Glamorous', 'Boho', 'Vintage', 'Traditional'];

export default function Wardrobe() {
  const { items, addItem, deleteItem } = useWardrobe();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [inspectingItem, setInspectingItem] = useState<WardrobeItem | null>(null);

  // New item form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dress');
  const [primaryColorHex, setPrimaryColorHex] = useState('#6E1E2C');
  const [secondaryColorHex, setSecondaryColorHex] = useState('');
  const [pattern, setPattern] = useState('Solid');
  const [fabric, setFabric] = useState('Silk');
  const [style, setStyle] = useState('Classic');
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>(['party']);
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fabric?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addItem({
      name: name.trim(),
      category,
      primaryColorHex: normalizeHex(primaryColorHex),
      secondaryColorHex: secondaryColorHex ? normalizeHex(secondaryColorHex) : undefined,
      pattern,
      fabric,
      occasion: selectedOccasions,
      style,
      notes: notes.trim() || undefined,
      imageUrl: imagePreview,
    });

    // Reset
    setName('');
    setImagePreview(undefined);
    setNotes('');
    setAddModalOpen(false);
  };

  // Coordinated look calculation for "What can I wear with this?"
  const outfitLook = useMemo(() => {
    if (!inspectingItem) return null;
    const hexes = [inspectingItem.primaryColorHex];
    if (inspectingItem.secondaryColorHex) {
      hexes.push(inspectingItem.secondaryColorHex);
    }
    return generateCompleteLook({
      dressHexes: hexes,
      occasion: (inspectingItem.occasion?.[0] as Occasion) || 'party',
      aesthetic: 'elegant',
      dressCategory: inspectingItem.category,
      dressLabel: inspectingItem.name,
    });
  }, [inspectingItem]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525]">
            <Shirt size={14} className="text-[#252525]" />
            <span>Digital Closet & Outfit Coordinate Engine</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
            My Wardrobe
          </h1>
          <p className="text-[#737373] text-sm sm:text-base max-w-xl leading-relaxed">
            Digitize your favorite dresses, sarees, and garments. Click{' '}
            <strong className="text-[#252525]">"What can I wear with this?"</strong> to generate
            coordinated shoes, handbags, jewelry, and makeup palettes straight from your closet.
          </p>
        </div>

        <Button
          id="btn-add-wardrobe-item"
          variant="primary"
          size="md"
          onClick={() => setAddModalOpen(true)}
          icon={<Plus size={16} />}
          className="w-full sm:w-auto min-h-[44px] justify-center"
        >
          Add Clothing Item
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="bg-white border-[#EAE7DD] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wardrobe by name, fabric, style, or notes..."
              className="w-full pl-11 pr-4 py-2.5 min-h-[44px] bg-[#FFFDF5] border border-[#EAE7DD] rounded-full text-base sm:text-sm text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#FFD84D]"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="-mx-1 px-1 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 touch-pan-x">
          <span className="text-xs font-bold text-[#737373] uppercase tracking-wider shrink-0 mr-1">
            Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 sm:py-1.5 min-h-[36px] sm:min-h-0 rounded-full font-semibold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#252525] text-[#FFD84D]'
                  : 'bg-white border border-[#EAE7DD] text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Wardrobe Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="bg-white hover:border-[#FFD84D] transition-colors p-5 flex flex-col justify-between"
          >
            <div>
              {/* Item Top Bar */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9E6] text-[#252525] border border-[#FFD84D]/40">
                    {item.category}
                  </span>
                  {item.pattern && (
                    <span className="text-[10px] font-medium text-[#737373]">
                      {item.pattern}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-[#737373] hover:text-red-600 p-1 rounded-full transition-colors"
                  title="Remove from wardrobe"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Visual Display: Color or Uploaded Image */}
              <div className="relative rounded-2xl overflow-hidden border border-[#EAE7DD] mb-4 h-36 flex items-center justify-center bg-[#FFFDF5]">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-4 relative"
                    style={{ backgroundColor: item.primaryColorHex }}
                  >
                    {item.secondaryColorHex && (
                      <div
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: item.secondaryColorHex }}
                        title="Secondary Color"
                      />
                    )}
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/30 text-white backdrop-blur-xs">
                      {item.primaryColorHex}
                    </span>
                  </div>
                )}
              </div>

              {/* Title & metadata */}
              <h3 className="font-display text-lg font-bold text-[#252525] leading-snug mb-1">
                {item.name}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#737373] mb-3">
                {item.fabric && <span>Fabric: {item.fabric}</span>}
                {item.style && <span>· Style: {item.style}</span>}
              </div>

              {item.notes && (
                <p className="text-xs text-[#737373] italic bg-[#FFFDF5] p-2.5 rounded-xl border border-[#EAE7DD] mb-4">
                  "{item.notes}"
                </p>
              )}
            </div>

            {/* "What can I wear with this?" Button */}
            <div className="pt-4 border-t border-[#EAE7DD]">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setInspectingItem(item)}
                icon={<Sparkles size={14} />}
              >
                What can I wear with this?
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#EAE7DD] rounded-3xl p-8 space-y-3">
          <Shirt size={32} className="mx-auto text-[#FFD84D]" />
          <h3 className="font-display text-xl font-bold text-[#252525]">No clothes found</h3>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            Try adjusting your search terms or tap below to add a new piece to your digital closet.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            icon={<Plus size={14} />}
          >
            Add Clothing Item
          </Button>
        </div>
      )}

      {/* Modal: Add Clothing Item */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-[#EAE7DD] shadow-2xl max-w-lg w-full p-5 sm:p-7 relative my-auto max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#737373] hover:text-[#252525] p-2 rounded-full hover:bg-[#FFF9E6]"
            >
              <X size={18} />
            </button>

            <h2 className="font-display text-2xl font-bold text-[#252525] mb-1">
              Add to My Wardrobe
            </h2>
            <p className="text-xs text-[#737373] mb-6">
              Enter garment details so our styling engine can suggest exact matches.
            </p>

            <form onSubmit={handleSaveNewItem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#252525] block mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Navy Cashmere Blazer, Emerald Raw Silk Saree"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE7DD] rounded-xl text-xs font-semibold text-[#252525] focus:ring-2 focus:ring-[#FFD84D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#252525] block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAE7DD] rounded-xl text-xs font-semibold text-[#252525]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#252525] block mb-1">
                    Fabric
                  </label>
                  <select
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAE7DD] rounded-xl text-xs font-semibold text-[#252525]"
                  >
                    {FABRICS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#252525] block mb-1">
                    Primary Color (HEX)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColorHex}
                      onChange={(e) => setPrimaryColorHex(e.target.value.toUpperCase())}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-[#EAE7DD] shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryColorHex}
                      onChange={(e) => setPrimaryColorHex(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-white border border-[#EAE7DD] rounded-xl text-xs font-mono text-[#252525]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#252525] block mb-1">
                    Secondary Accent (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColorHex || '#D8AF3B'}
                      onChange={(e) => setSecondaryColorHex(e.target.value.toUpperCase())}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-[#EAE7DD] shrink-0"
                    />
                    <input
                      type="text"
                      value={secondaryColorHex}
                      onChange={(e) => setSecondaryColorHex(e.target.value.toUpperCase())}
                      placeholder="#HEX"
                      className="w-full px-3 py-2 bg-white border border-[#EAE7DD] rounded-xl text-xs font-mono text-[#252525]"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Photo Upload */}
              <div>
                <label className="text-xs font-semibold text-[#252525] block mb-1">
                  Upload Garment Photo (Optional)
                </label>
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#EAE7DD] rounded-2xl cursor-pointer hover:bg-[#FFFDF5] text-xs font-semibold text-[#737373]">
                  <Upload size={16} className="text-[#FFD84D]" />
                  <span>Choose file or drop photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                {imagePreview && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[#EAE7DD]"
                    />
                    <span className="text-xs text-green-700 font-semibold">Photo ready!</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#252525] block mb-1">
                  Stylist Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Floor length, pairs nicely with pearl drop earrings..."
                  className="w-full px-3.5 py-2 bg-white border border-[#EAE7DD] rounded-xl text-xs text-[#252525] focus:ring-2 focus:ring-[#FFD84D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save to Wardrobe
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: "What can I wear with this?" Recommendation Engine Results */}
      {inspectingItem && outfitLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
          onClick={() => setInspectingItem(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#EAE7DD] shadow-2xl max-w-2xl w-full p-5 sm:p-8 relative my-auto max-h-[85vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectingItem(null)}
              className="absolute top-4 right-4 text-[#737373] hover:text-[#252525] p-2 rounded-full hover:bg-[#FFF9E6]"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFD84D] bg-[#252525] px-2.5 py-0.5 rounded-md">
                Coordinated Outfit & Makeup Guide
              </span>
              <h2 className="font-display text-2xl font-bold text-[#252525] mt-1">
                Styling: {inspectingItem.name}
              </h2>
              <p className="text-xs text-[#737373] mt-0.5">
                Primary color {inspectingItem.primaryColorHex} · {inspectingItem.category}
              </p>
            </div>

            {/* Hair & Drape */}
            <div className="bg-[#FFFDF5] p-4 rounded-2xl border border-[#EAE7DD] space-y-2">
              <span className="text-xs font-bold text-[#252525] block">
                Occasion Drape & Hairstyle
              </span>
              <p className="text-xs text-[#737373] leading-relaxed">
                {outfitLook.hairstyle}. {outfitLook.occasionFitNote}
              </p>
            </div>

            {/* Matched Makeup */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#252525] block">
                Synchronized Makeup Combination
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] flex items-center gap-3">
                  <ColorSwatch
                    hex={outfitLook.combinations[1].lipstick.hex}
                    name={outfitLook.combinations[1].lipstick.name}
                    size="sm"
                    showHexLabel={false}
                  />
                  <div>
                    <span className="text-[10px] text-[#737373] uppercase font-bold block">
                      Lipstick
                    </span>
                    <span className="text-xs font-bold text-[#252525]">
                      {outfitLook.combinations[1].lipstick.name}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] flex items-center gap-3">
                  <ColorSwatch
                    hex={outfitLook.combinations[1].blush.hex}
                    name={outfitLook.combinations[1].blush.name}
                    size="sm"
                    showHexLabel={false}
                  />
                  <div>
                    <span className="text-[10px] text-[#737373] uppercase font-bold block">
                      Blush
                    </span>
                    <span className="text-xs font-bold text-[#252525]">
                      {outfitLook.combinations[1].blush.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#252525] block">
                Recommended Footwear, Handbag & Jewelry
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] text-center">
                  <span className="text-[10px] font-bold text-[#737373] block mb-1">Shoes</span>
                  <span className="text-xs font-bold text-[#252525]">
                    {outfitLook.shoes.color.name}
                  </span>
                </div>
                <div className="p-2.5 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] text-center">
                  <span className="text-[10px] font-bold text-[#737373] block mb-1">Handbag</span>
                  <span className="text-xs font-bold text-[#252525]">
                    {outfitLook.handbag.color.name}
                  </span>
                </div>
                <div className="p-2.5 bg-[#FFFDF5] rounded-xl border border-[#EAE7DD] text-center">
                  <span className="text-[10px] font-bold text-[#737373] block mb-1">Jewelry</span>
                  <span className="text-xs font-bold text-[#252525]">
                    {outfitLook.jewelry.color.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE7DD] flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setInspectingItem(null)}
              >
                Close Blueprint
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
