import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  Palette,
  Wand2,
  Shirt,
  BookHeart,
} from 'lucide-react';
import { usePalettes } from '@/context/PaletteContext';
import { useWardrobe } from '@/context/WardrobeContext';

export default function MobileNav() {
  const { savedPalettes } = usePalettes();
  const { items: wardrobeItems } = useWardrobe();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EAE7DD] shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors min-w-[56px] ${
              isActive ? 'text-[#252525]' : 'text-[#737373] hover:text-[#252525]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#FFF4BF] text-[#252525]' : ''
                }`}
              >
                <Sparkles size={20} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                Home
              </span>
            </>
          )}
        </NavLink>

        {/* Create Look */}
        <NavLink
          to="/create-my-look"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors min-w-[56px] ${
              isActive ? 'text-[#252525]' : 'text-[#737373] hover:text-[#252525]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#FFF4BF] text-[#252525]' : ''
                }`}
              >
                <Wand2 size={20} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                Look Gen
              </span>
            </>
          )}
        </NavLink>

        {/* Center Matcher Highlight Button */}
        <NavLink
          to="/color-matcher"
          className="flex flex-col items-center justify-center -mt-5 relative z-10 px-1"
          aria-label="Color Matcher Studio"
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-13 h-13 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform active:scale-95 ${
                  isActive
                    ? 'bg-[#252525] text-[#FFD84D]'
                    : 'bg-[#FFD84D] text-[#252525] hover:bg-[#FACC15]'
                }`}
              >
                <Palette size={22} />
              </div>
              <span className="text-[10px] font-bold text-[#252525] mt-1">
                Matcher
              </span>
            </>
          )}
        </NavLink>

        {/* Wardrobe */}
        <NavLink
          to="/wardrobe"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors min-w-[56px] relative ${
              isActive ? 'text-[#252525]' : 'text-[#737373] hover:text-[#252525]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1.5 rounded-xl transition-all relative ${
                  isActive ? 'bg-[#FFF4BF] text-[#252525]' : ''
                }`}
              >
                <Shirt size={20} />
                {wardrobeItems.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#FFD84D] text-[#252525] text-[9px] font-bold flex items-center justify-center border border-white shadow-xs">
                    {wardrobeItems.length}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                Wardrobe
              </span>
            </>
          )}
        </NavLink>

        {/* Lookbook */}
        <NavLink
          to="/lookbook"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors min-w-[56px] relative ${
              isActive ? 'text-[#252525]' : 'text-[#737373] hover:text-[#252525]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1.5 rounded-xl transition-all relative ${
                  isActive ? 'bg-[#FFF4BF] text-[#252525]' : ''
                }`}
              >
                <BookHeart size={20} />
                {savedPalettes.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#252525] text-white text-[9px] font-bold flex items-center justify-center border border-white shadow-xs">
                    {savedPalettes.length}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                Lookbook
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
