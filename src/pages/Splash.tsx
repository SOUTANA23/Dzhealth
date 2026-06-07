import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const onboarded = localStorage.getItem('onboarding_completed');
    const timer = setTimeout(() => {
      navigate(onboarded ? '/home' : '/onboarding', { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#060d1a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
            <Activity className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-wide">DzHealth</h1>
          <p className="text-cyan-400/80 text-sm mt-1">كل الخدمات الصحية في مكان واحد</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-loading-bar" />
        </div>
      </div>

      <p className="absolute bottom-8 text-gray-600 text-xs">صُنع في الجزائر 🇩🇿</p>
    </div>
  );
}
