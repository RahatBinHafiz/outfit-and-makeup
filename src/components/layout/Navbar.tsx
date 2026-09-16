import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Sparkles,
  Palette,
  Wand2,
  BookHeart,
  Shirt,
  Compass,
  BookOpen,
  User,
  Menu,
  X,
} from 'lucide-react';
import { usePalettes } from '@/context/PaletteContext';
import { useWardrobe } from '@/context/WardrobeContext';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Sparkles },
  { to: '/color-matcher', label: 'Color Matcher', icon: Palette, highlight: true },
  { to: '/create-my-look', label: 'Create My Look', icon: Wand2 },
  { to: '/color-studio', label: 'Color Studio', icon: Compass },
  { to: '/makeup-guide', label: 'Makeup Guide', icon: BookOpen },
  { to: '/wardrobe', label: 'My Wardrobe', icon: Shirt },
  { to: '/lookbook', label: 'Lookbook', icon: BookHeart },
  { to: '/profile', label: 'Style Profile', icon: User },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { savedPalettes } = usePalettes();
  const { items: wardrobeItems } = useWardrobe();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE7DD] shadow-[0_1px_4px_rgba(37,37,37,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="StyleSync Home"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FFD84D] flex items-center justify-center shadow-sm border border-[#F5CD3D] transition-transform group-hover:scale-105">
            <Sparkles size={20} className="text-[#252525]" />
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-[#252525] block leading-none">
              StyleSync
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#737373] block mt-0.5">
              Fashion & Makeup Stylist
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isLookbook = item.to === '/lookbook';
            const isWardrobe = item.to === '/wardrobe';

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FFD84D] text-[#252525] shadow-xs border border-[#F5CD3D]'
                      : item.highlight
                      ? 'text-[#252525] bg-[#FFF9E6] hover:bg-[#FFF4BF] border border-[#FFD84D]/30'
                      : 'text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6]'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>

                {/* Counter Badges */}
                {isLookbook && savedPalettes.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#252525] text-white leading-none">
                    {savedPalettes.length}
                  </span>
                )}
                {isWardrobe && wardrobeItems.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FFD84D] text-[#252525] border border-[#252525]/10 leading-none">
                    {wardrobeItems.length}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/color-matcher"
            className="hidden sm:inline-flex items-center gap-2 bg-[#FFD84D] hover:bg-[#FACC15] text-[#252525] text-sm font-bold px-4 py-2 rounded-full shadow-xs border border-[#F5CD3D] transition-transform active:scale-95"
          >
            <Palette size={16} />
            <span>Match a Dress</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden text-[#252525] p-2.5 rounded-full hover:bg-[#FFF9E6] border border-[#EAE7DD] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative z-10 bg-white border-b border-[#EAE7DD] px-4 py-5 space-y-2 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DD]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFD84D] flex items-center justify-center">
                  <Sparkles size={16} className="text-[#252525]" />
                </div>
                <span className="font-display text-lg font-bold text-[#252525]">All Stylist Tools</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#737373] hover:text-[#252525] rounded-full hover:bg-[#FFF9E6]"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isLookbook = item.to === '/lookbook';
                const isWardrobe = item.to === '/wardrobe';

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors min-h-[48px] ${
                        isActive
                          ? 'bg-[#FFD84D] text-[#252525]'
                          : 'text-[#737373] hover:text-[#252525] hover:bg-[#FFF9E6] active:bg-[#FFF4BF]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {isLookbook && savedPalettes.length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#252525] text-[#FFD84D]">
                        {savedPalettes.length}
                      </span>
                    )}
                    {isWardrobe && wardrobeItems.length > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#FFF4BF] text-[#252525]">
                        {wardrobeItems.length}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#EAE7DD]">
              <Link
                to="/color-matcher"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#FFD84D] text-[#252525] font-bold py-3 px-4 rounded-xl shadow-xs"
              >
                <Palette size={18} />
                <span>Instant Dress Matcher</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
