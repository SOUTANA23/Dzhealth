import { useNavigate } from 'react-router-dom';
import {
  User, Bell, MapPin, Globe, Shield, HelpCircle, FileText,
  Info, LogOut, Moon, ChevronRight, Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/use-auth';
import { getInitials } from '../lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, darkMode, toggleDarkMode, language, changeLanguage, locationEnabled, toggleLocation, notificationsEnabled, toggleNotifications } = useApp();
  const { user, signOut } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'مستخدم';
  const email = user?.email || '';

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const MENU_ITEMS = [
    { icon: User, label: 'ملفي الشخصي', action: () => navigate('/edit-profile') },
    { icon: Shield, label: 'الأمان والخصوصية', action: () => {} },
    { icon: HelpCircle, label: 'المساعدة والدعم', action: () => {} },
    { icon: FileText, label: 'سياسة الخصوصية', action: () => {} },
    { icon: Info, label: 'حول التطبيق', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[#060d1a] pb-6">
      {/* Header */}
      <div className="bg-[#0a1628] px-4 pt-12 pb-6">
        <h1 className="text-white font-bold text-xl mb-5">الملف الشخصي</h1>

        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-500/40" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-cyan-500/40">
              {getInitials(displayName)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg truncate">{displayName}</h2>
            <p className="text-gray-400 text-sm truncate">{email}</p>
            {profile?.phone && <p className="text-gray-500 text-sm">{profile.phone}</p>}
          </div>
          <button onClick={() => navigate('/edit-profile')} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
            <Edit3 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {/* Toggles */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl overflow-hidden">
          {[
            { icon: Moon, label: 'الوضع الداكن', value: darkMode, toggle: toggleDarkMode },
            { icon: Bell, label: 'الإشعارات', value: notificationsEnabled, toggle: toggleNotifications },
            { icon: MapPin, label: 'الموقع', value: locationEnabled, toggle: toggleLocation },
          ].map(({ icon: Icon, label, value, toggle }, i) => (
            <div key={label} className={`flex items-center justify-between px-4 py-4 ${i < 2 ? 'border-b border-white/5' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-white text-sm">{label}</span>
              </div>
              <button
                onClick={toggle}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative ${value ? 'bg-cyan-500' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all duration-200 ${value ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Language */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-white text-sm">اللغة</span>
            </div>
            <div className="flex gap-2">
              {[['ar', 'عربية'], ['fr', 'Français'], ['en', 'English']].map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code as 'ar' | 'fr' | 'en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === code ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl overflow-hidden">
          {MENU_ITEMS.map(({ icon: Icon, label, action }, i) => (
            <button
              key={label}
              onClick={action}
              className={`w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors ${i < MENU_ITEMS.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-white text-sm">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 rtl:rotate-180" />
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
