import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Calendar, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/home',         icon: Home,     label: 'الرئيسية' },
  { path: '/search',       icon: Search,   label: 'بحث' },
  { path: '/add-info',     icon: Plus,     label: 'إضافة', isCenter: true },
  { path: '/appointments', icon: Calendar, label: 'المواعيد' },
  { path: '/profile',      icon: User,     label: 'الملف' },
];

export function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-header)] border-t border-[var(--border)] theme-transition">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2">
        {NAV_ITEMS.map(({ path, icon: Icon, label, isCenter }) => {
          const active = location.pathname === path || location.pathname.startsWith(path + '/');

          if (isCenter) {
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="relative -top-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition-transform duration-150 active:scale-95"
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            );
          }

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-150"
            >
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-cyan-500' : 'text-[var(--text-3)]'}`} />
              <span className={`text-xs transition-colors ${active ? 'text-cyan-500' : 'text-[var(--text-3)]'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
