import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/use-auth';
import { useProfile, type Profile } from '../hooks/use-profile';
import { getLanguage, setLanguage, type Language } from '../lib/i18n';

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
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme_dark') === 'true');
  const [language, setLang] = useState<Language>(() => getLanguage());
  const [locationEnabled, setLocationEnabled] = useState(() => localStorage.getItem('location_enabled') === 'true');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('notifications_enabled') === 'true');

  const { profile, loading: profileLoading, fetchProfile, updateProfile } = useProfile();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme_dark', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(v => !v);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    setLang(lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

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

  return (
    <AppContext.Provider value={{
      darkMode, toggleDarkMode,
      language, changeLanguage,
      locationEnabled, toggleLocation,
      notificationsEnabled, toggleNotifications,
      profile, profileLoading,
      refreshProfile: fetchProfile,
      updateProfile,
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
