import { createContext, useContext, useState } from "react";

type Language = "ar" | "fr" | "en";
type Theme = "light" | "dark";

interface AppSettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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
  const [language, setLanguageState] = useState<Language>("ar");
  const [theme, setThemeState] = useState<Theme>("light");
  const [locationEnabled, setLocationEnabledState] = useState(false);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);

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

  const t = (key: string): string => {
    const translations: Record<Language, Record<string, string>> = {
      ar: { home: "الرئيسية", search: "بحث", add: "إضافة", profile: "ملفي" },
      fr: { home: "Accueil", search: "Recherche", add: "Ajouter", profile: "Profil" },
      en: { home: "Home", search: "Search", add: "Add", profile: "Profile" }
    };
    return translations[language][key] || key;
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
