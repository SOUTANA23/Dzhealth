import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    if (storedLanguage) setLanguageState(storedLanguage);
    const storedTheme = localStorage.getItem("theme_dark") === "true" ? "dark" : "light";
    setThemeState(storedTheme);
    setLocationEnabledState(localStorage.getItem("location_enabled") === "true");
    setNotificationsEnabledState(localStorage.getItem("notifications_enabled") === "true");
  }, []);

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

  const t = (key: string): string => {
    const translations: Record<Language, Record<string, string>> = {
      ar: { home: "الرئيسية", search: "بحث", add: "إضافة", profile: "ملفي", appointments: "المواعيد", settings: "الإعدادات" },
      fr: { home: "Accueil", search: "Recherche", add: "Ajouter", profile: "Profil", appointments: "Rendez-vous", settings: "Paramètres" },
      en: { home: "Home", search: "Search", add: "Add", profile: "Profile", appointments: "Appointments", settings: "Settings" }
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
