import { useNavigate } from 'react-router-dom';
import {
  User, Bell, MapPin, Globe, Shield, HelpCircle, FileText,
  Info, LogOut, Moon, Sun, ChevronRight, Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/use-auth';
import { getInitials } from '../lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const {
    profile, darkMode, toggleDarkMode,
    language, changeLanguage,
    locationEnabled, toggleLocation,
    notificationsEnabled, toggleNotifications,
  } = useApp();
  const { user, signOut } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'مستخدم';
  const email       = user?.email || '';

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const TOGGLES = [
    {
      icon: darkMode ? Moon : Sun,
      label: 'الوضع الداكن',
      value: darkMode,
      toggle: toggleDarkMode,
      activeColor: 'bg-slate-600',
    },
    {
      icon: Bell,
      label: 'الإشعارات',
      value: notificationsEnabled,
      toggle: toggleNotifications,
      activeColor: 'bg-cyan-500',
    },
    {
      icon: MapPin,
      label: 'الموقع الجغرافي',
      value: locationEnabled,
      toggle: toggleLocation,
      activeColor: 'bg-blue-500',
    },
  ];

  const MENU_ITEMS = [
    { icon: User,       label: 'ملفي الشخصي',       action: () => navigate('/edit-profile') },
    { icon: Shield,     label: 'الأمان والخصوصية',   action: () => {} },
    { icon: HelpCircle, label: 'المساعدة والدعم',    action: () => {} },
    { icon: FileText,   label: 'سياسة الخصوصية',    action: () => {} },
    { icon: Info,       label: 'حول التطبيق',       action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-6 theme-transition">

      {/* Header */}
      <div className="bg-[var(--bg-header)] px-4 pt-12 pb-6 border-b border-[var(--border)]">
        <h1 className="text-[var(--text-1)] font-bold text-xl mb-5">الملف الشخصي</h1>

        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-500/40" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-cyan-500/30">
              {getInitials(displayName)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-[var(--text-1)] font-bold text-lg truncate">{displayName}</h2>
            <p className="text-[var(--text-2)] text-sm truncate">{email}</p>
            {profile?.phone && <p className="text-[var(--text-3)] text-sm">{profile.phone}</p>}
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className="w-9 h-9 bg-[var(--bg-item)] border border-[var(--border)] rounded-xl flex items-center justify-center"
          >
            <Edit3 className="w-4 h-4 text-[var(--text-2)]" />
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">

        {/* Toggles */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden theme-transition">
          {TOGGLES.map(({ icon: Icon, label, value, toggle, activeColor }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-4 py-4 ${i < TOGGLES.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--bg-item)] rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-[var(--text-1)] text-sm">{label}</span>
              </div>
              <button
                onClick={toggle}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative ${value ? activeColor : 'bg-[var(--bg-item)] border border-[var(--border)]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all duration-200 ${value ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Language */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-3 theme-transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--bg-item)] rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-cyan-500" />
              </div>
              <span className="text-[var(--text-1)] text-sm">اللغة</span>
            </div>
            <div className="flex gap-2">
              {([['ar', 'عربية'], ['fr', 'Fr'], ['en', 'En']] as [string, string][]).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code as 'ar' | 'fr' | 'en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    language === code
                      ? 'bg-cyan-500 text-white'
                      : 'bg-[var(--bg-item)] text-[var(--text-2)] border border-[var(--border)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden theme-transition">
          {MENU_ITEMS.map(({ icon: Icon, label, action }, i) => (
            <button
              key={label}
              onClick={action}
              className={`w-full flex items-center justify-between px-4 py-4 hover:bg-[var(--bg-item)] transition-colors ${
                i < MENU_ITEMS.length - 1 ? 'border-b border-[var(--border)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--bg-item)] rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--text-2)]" />
                </div>
                <span className="text-[var(--text-1)] text-sm">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-3)] rtl:rotate-180" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
