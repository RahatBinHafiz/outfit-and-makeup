import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Palette, Wand2, Compass, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#EAE7DD] bg-[#FFFDF5] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD84D] flex items-center justify-center border border-[#F5CD3D]">
                <Sparkles size={16} className="text-[#252525]" />
              </div>
              <span className="font-display text-2xl font-bold text-[#252525]">StyleSync</span>
            </div>
            <p className="text-sm text-[#737373] leading-relaxed max-w-md">
              Your AI fashion stylist and beauty consultant. Empowering you to coordinate dress colors,
              complementary lipsticks, eyeshadow palettes, and jewelry for every occasion.
            </p>
            <div className="p-3 bg-[#FFF9E6] border border-[#FFD84D]/30 rounded-xl text-xs text-[#737373] max-w-md">
              ✨ <strong>Stylist Philosophy:</strong> Color suggestions are personalized guides to inspire you. Style has no universal dogma—wear what makes you feel radiant.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#252525] mb-3">
              Styling Studios
            </h4>
            <ul className="space-y-2 text-sm text-[#737373]">
              <li>
                <Link to="/color-matcher" className="hover:text-[#252525] flex items-center gap-1.5 transition-colors">
                  <Palette size={14} className="text-[#FFD84D]" />
                  Dress-to-Makeup Matcher
                </Link>
              </li>
              <li>
                <Link to="/create-my-look" className="hover:text-[#252525] flex items-center gap-1.5 transition-colors">
                  <Wand2 size={14} className="text-[#FFD84D]" />
                  Create My Look (3 Variations)
                </Link>
              </li>
              <li>
                <Link to="/color-studio" className="hover:text-[#252525] flex items-center gap-1.5 transition-colors">
                  <Compass size={14} className="text-[#FFD84D]" />
                  Interactive Color Harmony
                </Link>
              </li>
              <li>
                <Link to="/makeup-guide" className="hover:text-[#252525] transition-colors">
                  Occasion Makeup Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Wardrobe & Lookbook */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#252525] mb-3">
              Personal Tools
            </h4>
            <ul className="space-y-2 text-sm text-[#737373]">
              <li>
                <Link to="/wardrobe" className="hover:text-[#252525] transition-colors">
                  My Digital Wardrobe
                </Link>
              </li>
              <li>
                <Link to="/lookbook" className="hover:text-[#252525] transition-colors">
                  Saved Lookbook Palettes
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#252525] transition-colors">
                  Personal Style Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#EAE7DD] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <p>© {new Date().getFullYear()} StyleSync. Designed with bright white and yellow elegance.</p>
          <div className="flex items-center gap-1.5 text-xs text-[#737373]">
            <span>Crafted for effortless beauty & confidence</span>
            <Heart size={12} className="text-[#FFD84D] fill-[#FFD84D]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
