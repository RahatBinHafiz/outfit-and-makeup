import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, MakeupIntensity, UndertoneOption } from '@/types';

const STORAGE_KEY = 'stylesync_user_profile_prefs';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Fashion Enthusiast',
  preferredColors: ['#6E1E2C', '#0F6B4C', '#1B2A4A', '#F4C2CE', '#D9A426'],
  favoriteStyles: ['Classic', 'Modern Minimalist', 'Glamorous'],
  preferredIntensity: 'medium',
  modestFashion: false,
  defaultUndertone: 'unspecified',
};

interface ProfileContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  togglePreferredColor: (hex: string) => void;
  toggleFavoriteStyle: (style: string) => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage unavailable
    }
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const togglePreferredColor = (hex: string) => {
    setProfile((prev) => {
      const exists = prev.preferredColors.includes(hex);
      const updated = exists
        ? prev.preferredColors.filter((c) => c !== hex)
        : [...prev.preferredColors, hex];
      return { ...prev, preferredColors: updated };
    });
  };

  const toggleFavoriteStyle = (style: string) => {
    setProfile((prev) => {
      const exists = prev.favoriteStyles.includes(style);
      const updated = exists
        ? prev.favoriteStyles.filter((s) => s !== style)
        : [...prev.favoriteStyles, style];
      return { ...prev, favoriteStyles: updated };
    });
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        togglePreferredColor,
        toggleFavoriteStyle,
        resetProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
