import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import { useProfile, type Profile } from '../hooks/use-profile';
import { getLanguage, setLanguage, type Language } from '../lib/i18n';

export type Wilaya   = { id: number; name_arabic: string; name_french: string };
export type Baladiya = { id: number; wilaya_id: number; name_arabic: string; name_french: string };
export type Specialty = { id: number; name_arabic: string; name_french: string; name_english: string };

type AppContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  locationEnabled: boolean;
  toggleLocation: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  profile: Profile | null;
  profileLoading: boolean;
  refreshProfile: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: any; error: any }>;
  wilayas: Wilaya[];
  specialties: Specialty[];
  getBaladiyas: (wilayaId: number) => Promise<Baladiya[]>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme_dark');
    // default = dark (true) unless explicitly set to 'false'
    return stored === null ? true : stored === 'true';
  });

  const [language, setLang] = useState<Language>(() => getLanguage());
  const [locationEnabled, setLocationEnabled]       = useState(() => localStorage.getItem('location_enabled') === 'true');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('notifications_enabled') === 'true');
  const [wilayas, setWilayas]       = useState<Wilaya[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const { profile, loading: profileLoading, fetchProfile, updateProfile } = useProfile();

  /* ── apply dark/light class to <html> ── */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme_dark', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(v => !v);

  /* ── language ── */
  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    setLang(lang);
    document.documentElement.setAttribute('dir',  lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir',  language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  /* ── permissions ── */
  const toggleLocation = () => {
    const next = !locationEnabled;
    setLocationEnabled(next);
    localStorage.setItem('location_enabled', String(next));
  };

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    localStorage.setItem('notifications_enabled', String(next));
  };

  /* ── load shared reference data once ── */
  useEffect(() => {
    supabase.from('wilayas')
      .select('id, name_arabic, name_french')
      .order('name_arabic')
      .then(({ data }) => { if (data) setWilayas(data as Wilaya[]); });

    supabase.from('specialties')
      .select('id, name_arabic, name_french, name_english')
      .order('name_arabic')
      .then(({ data }) => { if (data) setSpecialties(data as Specialty[]); });
  }, []);

  const getBaladiyas = useCallback(async (wilayaId: number): Promise<Baladiya[]> => {
    const { data } = await supabase
      .from('baladiyas')
      .select('id, wilaya_id, name_arabic, name_french')
      .eq('wilaya_id', wilayaId)
      .order('name_arabic');
    return (data as Baladiya[]) || [];
  }, []);

  return (
    <AppContext.Provider value={{
      darkMode, toggleDarkMode,
      language, changeLanguage,
      locationEnabled, toggleLocation,
      notificationsEnabled, toggleNotifications,
      profile, profileLoading,
      refreshProfile: fetchProfile,
      updateProfile,
      wilayas,
      specialties,
      getBaladiyas,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
