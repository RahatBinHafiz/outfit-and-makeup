import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Palette,
  Heart,
  Briefcase,
  PartyPopper,
  Crown,
  Coffee,
  Moon,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface OccasionGuideItem {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  summary: string;
  coreProducts: { name: string; shadeExample: string; notes: string }[];
  dressColorHarmonies: { dressTone: string; advice: string }[];
  proTips: string[];
}

const GUIDES: OccasionGuideItem[] = [
  {
    id: 'natural',
    title: 'Natural "No-Makeup" Makeup',
    badge: 'Everyday & Daytime',
    icon: <Coffee size={20} className="text-[#252525]" />,
    summary:
      'Focuses on hyper-hydrated skin, brushed brows, and subtle tinting that mimics natural blood flow.',
    coreProducts: [
      { name: 'Lipstick', shadeExample: 'Rose Taupe or Nude Tint', notes: 'Sheer satin or lip oil' },
      { name: 'Eyeshadow', shadeExample: 'Soft Linen or Warm Sand', notes: 'One wash of warm neutral cream' },
      { name: 'Blush', shadeExample: 'Peach Nude or Petal Rose', notes: 'Cream formula tapped on cheek apples' },
      { name: 'Lashes & Brows', shadeExample: 'Brown Mascara', notes: 'Soft definition without heavy clump' },
    ],
    dressColorHarmonies: [
      { dressTone: 'Light & Pastel Dresses', advice: 'Enhance sheer peach or rose tints on the lips for breezy freshness.' },
      { dressTone: 'Dark or Rich Garments', advice: 'Ensure skin is well-moisturized with radiant primer so your face doesn’t appear washed out.' },
    ],
    proTips: [
      'Use cream blush and tap remnants onto the bridge of the nose for a sun-kissed effect.',
      'Swap jet-black mascara for deep espresso brown for daytime softness.',
    ],
  },
  {
    id: 'soft-glam',
    title: 'Soft Glamour',
    badge: 'Date Nights & Cocktails',
    icon: <Sparkles size={20} className="text-[#252525]" />,
    summary:
      'Seamlessly blended diffuse shadows, soft feline eyeliner, velvet skin, and defined satin lips.',
    coreProducts: [
      { name: 'Lipstick', shadeExample: 'Velvet Mauve or Spiced Cinnamon', notes: 'Lined with a pencil one shade deeper' },
      { name: 'Eyeshadow', shadeExample: 'Smoky Mauve & Champagne Shimmer', notes: 'Diffuse crease with subtle center lid glow' },
      { name: 'Blush', shadeExample: 'Dusty Rose or Apricot Glow', notes: 'Blended high onto the cheekbone temple' },
      { name: 'Eyeliner', shadeExample: 'Smudged Espresso Pencil', notes: 'Softened with a pencil brush' },
    ],
    dressColorHarmonies: [
      { dressTone: 'Velvet or Satin Outfits', advice: 'Satin fabrics reflect flash; choose satin-matte makeup to prevent excessive glare.' },
      { dressTone: 'Monochrome Black / White', advice: 'Soft glam warms up monochrome outfits with toasted terracotta or rosewood tones.' },
    ],
    proTips: [
      'Apply highlighter with a small blending brush strictly on high points (cupid’s bow, brow arch).',
      'Melt powder layers together with a fine dewy setting mist.',
    ],
  },
  {
    id: 'bridal',
    title: 'Bridal & Reception Makeup',
    badge: 'Wedding Celebrations',
    icon: <Heart size={20} className="text-[#252525]" />,
    summary:
      'Camera-ready, tear-proof, and timeless beauty. Calibrated to look radiant both in natural daylight and under photography flash.',
    coreProducts: [
      { name: 'Lipstick', shadeExample: 'Rosewood Petal or Caramel Rose', notes: 'Long-wear transfer-resistant matte or satin' },
      { name: 'Eyeshadow', shadeExample: 'Rose Quartz, Gold Leaf & Soft Mauve', notes: 'Micro-fine shimmer that does not bounce white under flash' },
      { name: 'Blush', shadeExample: 'Luminous Petal Rose', notes: 'Layered cream blush set with matching powder blush' },
      { name: 'Setting', shadeExample: 'Silica-free Translucent Powder', notes: 'Prevents flash photography flashback' },
    ],
    dressColorHarmonies: [
      { dressTone: 'Ivory / Champagne Bridal Gowns', advice: 'Warm champagne shimmers and rosewood lips prevent the face from looking washed out against off-white fabrics.' },
      { dressTone: 'Red & Crimson Bridal Lehengas', advice: 'Balance a dramatic red lehenga with soft golden eyes and clean crimson lip symmetry.' },
    ],
    proTips: [
      'Layer cream blush under powder blush to guarantee 14+ hour longevity.',
      'Always test your finished look under smartphone flash to ensure zero white cast.',
    ],
  },
  {
    id: 'party',
    title: 'Party & Festive Glam',
    badge: 'Evenings & Birthdays',
    icon: <PartyPopper size={20} className="text-[#252525]" />,
    summary:
      'High-energy, playful, and dimensional. Welcomes duochrome shimmers, statement lipsticks, and graphic wings.',
    coreProducts: [
      { name: 'Lipstick', shadeExample: 'Crimson Royale or Deep Merlot', notes: 'Crisp bold shape with sharp lip liner' },
      { name: 'Eyeshadow', shadeExample: '24K Gold Leaf or Starlight Rose Gold', notes: 'High-impact glitter foil pressed on center lid' },
      { name: 'Cheeks', shadeExample: 'Terracotta Sun or Peach Glow', notes: 'Sculpted bronzer paired with reflective cheek highlight' },
      { name: 'Lashes', shadeExample: 'Fluffy Half-Lash Clusters', notes: 'Elongates eye shape outward' },
    ],
    dressColorHarmonies: [
      { dressTone: 'Sequined or Metallic Outfits', advice: 'When clothing is highly reflective, keep eyeshadow shimmer fine and let lips take the lead.' },
      { dressTone: 'Jewel Tones (Emerald, Sapphire)', advice: 'Complement jewel tones with golden champagne eyes and warm burgundy or berry lips.' },
    ],
    proTips: [
      'Press cosmetic glitter or metallic pigment with a fingertip over a glitter glue primer for maximum shine.',
    ],
  },
  {
    id: 'office',
    title: 'Office & Professional Workwear',
    badge: 'Corporate & Interviews',
    icon: <Briefcase size={20} className="text-[#252525]" />,
    summary:
      'Poised, crisp, and comfortable for all-day screen time and boardroom lighting.',
    coreProducts: [
      { name: 'Lipstick', shadeExample: 'Warm Honey or Rose Taupe Nude', notes: 'Comfortable hydrating cream or satin finish' },
      { name: 'Eyeshadow', shadeExample: 'Soft Linen & Warm Sand', notes: 'All-matte contour defining the socket crease' },
      { name: 'Blush', shadeExample: 'Peach Nude or Muted Rose', notes: 'Subtle definition along cheekbone structure' },
      { name: 'Skin', shadeExample: 'Semi-Matte Concealer & Tint', notes: 'Controls mid-day shine in conference rooms' },
    ],
    dressColorHarmonies: [
      { dressTone: 'Navy or Charcoal Suits', advice: 'Warm nude lips and soft apricot blush prevent cool gray suits from casting a dull shadow on the face.' },
      { dressTone: 'Crisp White Shirts', advice: 'Allows a cheerful rose or berry lip to shine cleanly without distraction.' },
    ],
    proTips: [
      'Avoid high-sparkle shimmers under fluorescent office lights; stick to soft velvet-mattes.',
    ],
  },
  {
    id: 'traditional',
    title: 'Traditional & Heritage Festivals',
    badge: 'Sarees, Lehengas & Kaftans',
    icon: <Crown size={20} className="text-[#252525]" />,
    summary:
      'Rich, ornate, and regal. Emphasizes intense kohl-rimmed eyes, warm gold or bronze shimmers, and bold regal lips.',
    coreProducts: [
      { name: 'Lipstick', shadeExample: 'Crimson Royale or Rich Terracotta', notes: 'Harmonizes with heirloom gold or antique silver jewelry' },
      { name: 'Eyeshadow', shadeExample: 'Deep Cacao, Antique Bronze & 24K Gold', notes: 'Rich multi-layer smokey lid with golden accent' },
      { name: 'Kohl & Liner', shadeExample: 'Jet Black Waterproof Kajal', notes: 'Tightlined upper and lower waterlines with smoked edge' },
      { name: 'Cheeks', shadeExample: 'Warm Cinnamon or Rose Petal', notes: 'Rich pigment supporting elaborate ornate attire' },
    ],
    dressColorHarmonies: [
      { dressTone: 'Zari / Gold Embroidered Silk', advice: 'Opt for warm gold eye shimmers and warm red or terracotta lips to match gold threadwork.' },
      { dressTone: 'Silver / Mirror Work Garments', advice: 'Swap gold for champagne-silver eyes and pair with cool berry or mauve lips.' },
    ],
    proTips: [
      'Set black waterline kajal with a tiny detail brush dipped in matte black eyeshadow to eliminate smudging.',
    ],
  },
];

export default function MakeupGuide() {
  const [selectedGuideId, setSelectedGuideId] = useState<string>('natural');
  const activeGuide = GUIDES.find((g) => g.id === selectedGuideId) || GUIDES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FFF4BF] border border-[#FFD84D] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#252525]">
          <BookOpen size={14} className="text-[#252525]" />
          <span>Professional Stylist Handbook</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252525] tracking-tight">
          Makeup Style Guide by Occasion
        </h1>
        <p className="text-[#737373] text-sm sm:text-base max-w-2xl leading-relaxed">
          Detailed breakdowns on tailoring your makeup aesthetic to different environments, dress
          fabrics, and lighting conditions.
        </p>
      </div>

      {/* Occasion Selection Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {GUIDES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGuideId(g.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedGuideId === g.id
                ? 'bg-[#FFD84D] text-[#252525] shadow-xs border border-[#F5CD3D]'
                : 'bg-white border border-[#EAE7DD] text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
            }`}
          >
            {g.icon}
            <span>{g.title}</span>
          </button>
        ))}
      </div>

      {/* Guide Detail Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Products & Application Guide */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border-[#EAE7DD] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE7DD]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#737373] block">
                  {activeGuide.badge}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#252525]">
                  {activeGuide.title}
                </h2>
              </div>
              <Link to="/color-matcher">
                <Button variant="secondary" size="sm" icon={<Palette size={14} />}>
                  Match a Dress Now
                </Button>
              </Link>
            </div>

            <p className="text-sm text-[#737373] leading-relaxed bg-[#FFFDF5] p-4 rounded-2xl border border-[#EAE7DD]">
              {activeGuide.summary}
            </p>

            {/* Core Products Formula */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-[#252525]">
                Core Formulation & Placement
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeGuide.coreProducts.map((p, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#EAE7DD]">
                    <span className="text-xs uppercase font-bold text-[#252525] block mb-1">
                      {p.name}
                    </span>
                    <p className="text-xs font-semibold text-[#737373] mb-1">
                      Recommended: <strong className="text-[#252525]">{p.shadeExample}</strong>
                    </p>
                    <p className="text-[11px] text-[#737373] italic">{p.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Application Tips */}
            <div className="pt-4 border-t border-[#EAE7DD] space-y-3">
              <h3 className="font-display text-base font-bold text-[#252525] flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#FFD84D]" />
                Artist Execution Tips
              </h3>
              <ul className="space-y-2 text-xs text-[#737373]">
                {activeGuide.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#252525] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Right Column: Dress Color Coordination Rules for this Occasion */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#FFFDF5] border-[#EAE7DD] p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-[#252525]">
              How to Adapt for Dress Colors
            </h3>
            <p className="text-xs text-[#737373]">
              Different fabric shades react differently under this style:
            </p>

            <div className="space-y-3">
              {activeGuide.dressColorHarmonies.map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-[#EAE7DD] space-y-1">
                  <span className="text-xs font-bold text-[#252525] block">
                    {item.dressTone}
                  </span>
                  <p className="text-xs text-[#737373] leading-relaxed">{item.advice}</p>
                </div>
              ))}
            </div>

            {/* Quick action button */}
            <Link to="/color-matcher" className="block pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
              >
                Apply to My Dress Color
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
