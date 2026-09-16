/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import ColorMatcher from '@/pages/ColorMatcher';
import CreateMyLook from '@/pages/CreateMyLook';
import ColorStudio from '@/pages/ColorStudio';
import MakeupGuide from '@/pages/MakeupGuide';
import Wardrobe from '@/pages/Wardrobe';
import Lookbook from '@/pages/Lookbook';
import StyleProfile from '@/pages/StyleProfile';
import { PaletteProvider } from '@/context/PaletteContext';
import { WardrobeProvider } from '@/context/WardrobeContext';
import { ProfileProvider } from '@/context/ProfileContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ProfileProvider>
      <WardrobeProvider>
        <PaletteProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-white text-[#252525] selection:bg-[#FFD84D] selection:text-[#252525]">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/color-matcher" element={<ColorMatcher />} />
                  <Route path="/create-my-look" element={<CreateMyLook />} />
                  <Route path="/color-studio" element={<ColorStudio />} />
                  <Route path="/makeup-guide" element={<MakeupGuide />} />
                  <Route path="/wardrobe" element={<Wardrobe />} />
                  <Route path="/lookbook" element={<Lookbook />} />
                  <Route path="/profile" element={<StyleProfile />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </PaletteProvider>
      </WardrobeProvider>
    </ProfileProvider>
  );
}
