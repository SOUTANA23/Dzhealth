import React, { createContext, useContext, useEffect, useState } from "react";
import type { Language, TranslationKey } from "@/lib/i18n.ts";
import { translations } from "@/lib/i18n.ts";

type Theme = "light" | "dark";

interface AppSettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isRTL: boolean;
  locationEnabled: boolean;
  setLocationEnabled: (val: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) ?? "ar";
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    return localStorage.getItem("theme_dark") === "true" ? "dark" : "light";
  });
  const [locationEnabled, setLocationEnabledState] = useState(() => {
    return localStorage.getItem("location_enabled") === "true";
  });
  const [notificationsEnabled, setNotificationsEnabledState] = useState(() => {
    return localStorage.getItem("notifications_enabled") === "true";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme_dark", t === "dark" ? "true" : "false");
  };

  const setLocationEnabled = (val: boolean) => {
    setLocationEnabledState(val);
    localStorage.setItem("location_enabled", val ? "true" : "false");
  };

  const setNotificationsEnabled = (val: boolean) => {
    setNotificationsEnabledState(val);
    localStorage.setItem("notifications_enabled", val ? "true" : "false");
  };

  // Apply theme & direction to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] ?? translations.ar[key] ?? key;
  };

  const isRTL = language === "ar";

  return (
    <AppSettingsContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        isRTL,
        locationEnabled,
        setLocationEnabled,
        notificationsEnabled,
        setNotificationsEnabled,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}
