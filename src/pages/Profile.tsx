import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Moon,
  Bell,
  MapPin,
  Globe,
  Lock,
  HelpCircle,
  Shield,
  Info,
  Star,
  LogOut,
  ChevronLeft,
  User,
  Droplets,
  Edit2,
} from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import type { Language } from "@/lib/i18n.ts";
import { cn } from "@/lib/utils.ts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useAuth } from "@/hooks/use-auth.ts";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const languages: { code: Language; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AuthLoading>
        <div className="pt-12 px-5 space-y-4">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <UnauthenticatedProfile />
      </Unauthenticated>
      <Authenticated>
        <ProfileContent />
      </Authenticated>
    </div>
  );
}

function UnauthenticatedProfile() {
  const { t } = useAppSettings();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-8 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h2 className="font-bold text-xl mb-1">{t("myProfile")}</h2>
        <p className="text-muted-foreground text-sm">سجّل دخولك للوصول إلى ملفك الشخصي وإعداداتك</p>
      </div>
      <SignInButton />
    </div>
  );
}

function ProfileContent() {
  const { t, theme, setTheme, language, setLanguage, notificationsEnabled, setNotificationsEnabled, locationEnabled, setLocationEnabled } = useAppSettings();
  const navigate = useNavigate();
  const { signout } = useAuth();
  const [showLangModal, setShowLangModal] = useState(false);

  const user = useQuery(api.users.getCurrentUser, {});
  const appointments = useQuery(api.appointments.list, {});

  const menuItems = [
    { icon: Lock, label: t("security"), action: () => {} },
    { icon: HelpCircle, label: t("help"), action: () => {} },
    { icon: Shield, label: t("privacy"), action: () => {} },
    { icon: Info, label: t("about_app"), action: () => {} },
    { icon: Star, label: t("rateApp"), action: () => {} },
  ];

  const initials = user?.name
    ? user.name.trim().charAt(0)
    : "م";

  const handleLogout = async () => {
    await signout();
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-8 px-5 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{initials}</span>
            )}
          </div>
          <button
            onClick={() => navigate("/profile/edit")}
            className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
          >
            <Edit2 className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>

        <div className="text-center">
          {user === undefined ? (
            <Skeleton className="h-5 w-32 mx-auto mb-1" />
          ) : (
            <h2 className="text-white font-bold text-lg">{user?.name ?? "مستخدم جديد"}</h2>
          )}
          {user === undefined ? (
            <Skeleton className="h-4 w-44 mx-auto" />
          ) : (
            <p className="text-white/70 text-sm">{user?.email ?? ""}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-1">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{appointments?.length ?? "—"}</p>
            <p className="text-white/70 text-xs">مواعيد</p>
          </div>
          {user?.blood_type && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Droplets className="w-4 h-4 text-red-300" />
                <p className="text-white font-bold text-lg">{user.blood_type}</p>
              </div>
              <p className="text-white/70 text-xs">فصيلة الدم</p>
            </div>
          )}
          {user?.wilaya_code && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4 text-white/70" />
              </div>
              <p className="text-white/70 text-xs">الولاية {user.wilaya_code}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-5 space-y-4 pb-24">
        {/* Edit profile button */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="w-full bg-primary/10 rounded-2xl px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-primary/15 transition-colors border border-primary/20"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium flex-1 text-right">{t("myProfile")}</span>
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Toggles */}
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          <ToggleRow
            icon={Moon}
            label={t("darkMode")}
            value={theme === "dark"}
            onChange={(v) => setTheme(v ? "dark" : "light")}
          />
          <ToggleRow
            icon={Bell}
            label={t("notifications")}
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />
          <ToggleRow
            icon={MapPin}
            label={t("location")}
            value={locationEnabled}
            onChange={setLocationEnabled}
          />
          {/* Language */}
          <button
            onClick={() => setShowLangModal(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{t("language")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {languages.find((l) => l.code === language)?.label}
              </span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Menu items */}
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-foreground/70" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-950/30 rounded-2xl px-4 py-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors border border-red-100 dark:border-red-900/30"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-red-600 font-bold text-sm">{t("logout")}</span>
        </button>
      </div>

      {/* Language modal */}
      {showLangModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowLangModal(false)}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full bg-card rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4 text-center">{t("language")}</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setShowLangModal(false); }}
                  className={cn(
                    "w-full p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors",
                    language === lang.code ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
                  )}
                >
                  <span className="font-semibold">{lang.label}</span>
                  {language === lang.code && <span className="text-xs opacity-80">✓</span>}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "w-12 h-6 rounded-full transition-colors cursor-pointer relative",
          value ? "bg-primary" : "bg-border",
        )}
      >
        <motion.div
          animate={{ x: value ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
