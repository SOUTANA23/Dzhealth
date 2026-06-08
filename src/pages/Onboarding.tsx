import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Mic, CheckCircle, ChevronRight } from 'lucide-react';

/* ── SVG illustrations ──────────────────────────────────────────────── */
const IllustrationDoctors = () => (
  <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="110" cy="110" r="100" fill="#0d1b2a" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
    <circle cx="110" cy="110" r="75" fill="#0a1628" opacity="0.8"/>
    <circle cx="110" cy="72" r="22" fill="#1e3a5f"/>
    <circle cx="110" cy="72" r="18" fill="#2563eb" opacity="0.8"/>
    <path d="M75 140 Q75 108 110 108 Q145 108 145 140 L145 160 Q145 165 140 165 L80 165 Q75 165 75 160 Z" fill="#1e3a5f"/>
    <path d="M80 140 Q80 115 110 115 Q140 115 140 140 L140 158 Q140 162 136 162 L84 162 Q80 162 80 158 Z" fill="#1d4ed8" opacity="0.9"/>
    <circle cx="110" cy="138" r="10" fill="none" stroke="#06b6d4" strokeWidth="2.5"/>
    <path d="M120 138 Q135 138 135 125 Q135 118 128 118 Q121 118 121 125" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="128" cy="116" r="3.5" fill="#06b6d4"/>
    <path d="M55 185 L75 185 L82 170 L90 200 L98 180 L106 185 L165 185" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
    <rect x="30" y="60" width="22" height="10" rx="5" fill="#0891b2" opacity="0.7" transform="rotate(-20 41 65)"/>
    <rect x="168" y="80" width="22" height="10" rx="5" fill="#2563eb" opacity="0.7" transform="rotate(15 179 85)"/>
    <rect x="45" y="100" width="14" height="4" rx="2" fill="#06b6d4" opacity="0.8"/>
    <rect x="50" y="95" width="4" height="14" rx="2" fill="#06b6d4" opacity="0.8"/>
    <rect x="158" y="55" width="14" height="4" rx="2" fill="#3b82f6" opacity="0.8"/>
    <rect x="163" y="50" width="4" height="14" rx="2" fill="#3b82f6" opacity="0.8"/>
  </svg>
);

const IllustrationCalendar = () => (
  <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="110" cy="110" r="100" fill="#0d1b2a" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
    <circle cx="110" cy="110" r="75" fill="#0a1628" opacity="0.8"/>
    <rect x="62" y="68" width="96" height="84" rx="10" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
    <rect x="62" y="68" width="96" height="24" rx="10" fill="#2563eb"/>
    <rect x="62" y="80" width="96" height="12" fill="#2563eb"/>
    <rect x="80" y="62" width="6" height="14" rx="3" fill="#06b6d4"/>
    <rect x="134" y="62" width="6" height="14" rx="3" fill="#06b6d4"/>
    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map((i) => {
      const col = i % 7; const row = Math.floor(i / 7);
      return <circle key={i} cx={77+col*12} cy={108+row*14} r="3.5" fill={i===5?"#06b6d4":"#374151"}/>;
    })}
    <circle cx="137" cy="108" r="7" fill="#2563eb"/>
    <circle cx="137" cy="108" r="4" fill="#06b6d4"/>
    <circle cx="158" cy="155" r="20" fill="#1e3a5f" stroke="#06b6d4" strokeWidth="2"/>
    <path d="M158 143 L158 155 L166 155" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="158" cy="155" r="2.5" fill="#06b6d4"/>
    <circle cx="68" cy="155" r="18" fill="#065f46"/>
    <path d="M59 155 L65 162 L77 148" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 75 L32.5 82 L40 82 L34 86.5 L36.5 94 L30 89.5 L23.5 94 L26 86.5 L20 82 L27.5 82 Z" fill="#fbbf24" opacity="0.8"/>
  </svg>
);

const IllustrationDonate = () => (
  <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="110" cy="110" r="100" fill="#0d1b2a" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
    <circle cx="110" cy="110" r="75" fill="#0a1628" opacity="0.8"/>
    <path d="M110 60 C110 60 80 95 80 118 C80 135.7 93.4 150 110 150 C126.6 150 140 135.7 140 118 C140 95 110 60 110 60Z" fill="#dc2626" opacity="0.9"/>
    <path d="M110 75 C110 75 90 103 90 120 C90 131 99 140 110 140 C105 130 102 122 105 115 C108 108 115 105 110 75Z" fill="#ef4444" opacity="0.5"/>
    <rect x="92" y="108" width="36" height="20" rx="4" fill="#7f1d1d"/>
    <text x="110" y="122" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">O+</text>
    <circle cx="55" cy="78" r="14" fill="#1e3a5f"/><circle cx="55" cy="78" r="11" fill="#2563eb" opacity="0.7"/>
    <path d="M35 120 Q35 98 55 98 Q75 98 75 120 L75 130 Q55 135 35 130 Z" fill="#1d4ed8" opacity="0.7"/>
    <circle cx="165" cy="78" r="14" fill="#1e3a5f"/><circle cx="165" cy="78" r="11" fill="#9333ea" opacity="0.7"/>
    <path d="M145 120 Q145 98 165 98 Q185 98 185 120 L185 130 Q165 135 145 130 Z" fill="#7c3aed" opacity="0.7"/>
    <rect x="72" y="160" width="76" height="36" rx="8" fill="#1e3a5f" stroke="#ef4444" strokeWidth="1.5" opacity="0.9"/>
    <rect x="105" y="164" width="10" height="28" rx="2" fill="#ef4444" opacity="0.8"/>
    <rect x="76" y="172" width="68" height="10" rx="2" fill="#ef4444" opacity="0.8"/>
  </svg>
);

/* ── Permission illustration ─────────────────────────────────────────── */
const IllustrationPermissions = () => (
  <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="110" cy="110" r="100" fill="#0d1b2a" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
    <circle cx="110" cy="110" r="75" fill="#0a1628" opacity="0.8"/>
    {/* Phone outline */}
    <rect x="75" y="55" width="70" height="120" rx="12" fill="#1e3a5f" stroke="#10b981" strokeWidth="2"/>
    <rect x="80" y="62" width="60" height="100" rx="8" fill="#0a1628"/>
    {/* Bell */}
    <path d="M110 82 C104 82 99 87 99 93 L99 100 L95 104 L125 104 L121 100 L121 93 C121 87 116 82 110 82Z" fill="#f59e0b" opacity="0.9"/>
    <circle cx="110" cy="107" r="3" fill="#fbbf24"/>
    <circle cx="110" cy="76" r="3" fill="#f59e0b" opacity="0.7"/>
    {/* Location pin */}
    <path d="M110 120 C106 120 103 123 103 127 C103 133 110 140 110 140 C110 140 117 133 117 127 C117 123 114 120 110 120Z" fill="#3b82f6"/>
    <circle cx="110" cy="127" r="3" fill="#0a1628"/>
    {/* Mic */}
    <rect x="105" y="148" width="10" height="16" rx="5" fill="#10b981"/>
    <path d="M102 158 Q102 166 110 166 Q118 166 118 158" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    <line x1="110" y1="166" x2="110" y2="172" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    <line x1="106" y1="172" x2="114" y2="172" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
    {/* Checkmarks around */}
    <circle cx="50" cy="85" r="14" fill="#065f46" opacity="0.9"/>
    <path d="M43 85 L48 91 L57 79" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="170" cy="85" r="14" fill="#065f46" opacity="0.9"/>
    <path d="M163 85 L168 91 L177 79" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="110" cy="195" r="14" fill="#065f46" opacity="0.9"/>
    <path d="M103 195 L108 201 L117 189" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Slides data ────────────────────────────────────────────────────── */
const CONTENT_SLIDES = [
  {
    Illustration: IllustrationDoctors,
    titleAr: 'ابحث عن أفضل الأطباء',
    subtitleAr: 'اعثر على أفضل المتخصصين الطبيين بالقرب منك في جميع ولايات الجزائر',
    accentColor: '#06b6d4',
    gradientFrom: 'from-cyan-600',
    gradientTo: 'to-blue-700',
  },
  {
    Illustration: IllustrationCalendar,
    titleAr: 'احجز موعدك بسهولة',
    subtitleAr: 'احجز موعدك الطبي في ثوانٍ معدودة واحصل على تأكيد فوري',
    accentColor: '#3b82f6',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-700',
  },
  {
    Illustration: IllustrationDonate,
    titleAr: 'تبرع وساعد الآخرين',
    subtitleAr: 'تبرع بالدم أو المعدات الطبية وكن سبباً في إنقاذ حياة إنسان',
    accentColor: '#ef4444',
    gradientFrom: 'from-red-600',
    gradientTo: 'to-rose-700',
  },
];

/* ── Permission helpers ─────────────────────────────────────────────── */
type PermState = 'idle' | 'granted' | 'denied';

async function requestNotifications(): Promise<PermState> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result === 'granted' ? 'granted' : 'denied';
}

async function requestLocation(): Promise<PermState> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve('denied'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        localStorage.setItem('location_enabled', 'true');
        localStorage.setItem('last_lat', String(pos.coords.latitude));
        localStorage.setItem('last_lng', String(pos.coords.longitude));
        resolve('granted');
      },
      () => resolve('denied'),
      { timeout: 8000 }
    );
  });
}

async function requestMicrophone(): Promise<PermState> {
  if (!navigator.mediaDevices?.getUserMedia) return 'denied';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    return 'granted';
  } catch {
    return 'denied';
  }
}

/* ── Permissions slide ──────────────────────────────────────────────── */
type Permission = {
  key: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  request: () => Promise<PermState>;
};

const PERMISSIONS: Permission[] = [
  {
    key: 'notifications',
    icon: <Bell className="w-6 h-6" />,
    label: 'الإشعارات',
    desc: 'استقبل تنبيهات المواعيد وطلبات التبرع الطارئة',
    request: requestNotifications,
  },
  {
    key: 'location',
    icon: <MapPin className="w-6 h-6" />,
    label: 'الموقع الجغرافي',
    desc: 'اعثر على أقرب الأطباء والصيدليات إليك',
    request: requestLocation,
  },
  {
    key: 'microphone',
    icon: <Mic className="w-6 h-6" />,
    label: 'الميكروفون',
    desc: 'للبحث الصوتي والتواصل مع الأطباء',
    request: requestMicrophone,
  },
];

function PermissionsSlide({ onDone }: { onDone: () => void }) {
  const [states, setStates] = useState<Record<string, PermState>>({
    notifications: 'idle',
    location: 'idle',
    microphone: 'idle',
  });
  const [requesting, setRequesting] = useState<string | null>(null);

  const handleRequest = async (perm: Permission) => {
    if (states[perm.key] !== 'idle') return;
    setRequesting(perm.key);
    const result = await perm.request();
    setRequesting(null);
    setStates(prev => ({ ...prev, [perm.key]: result }));
    if (perm.key === 'notifications') localStorage.setItem('notifications_enabled', String(result === 'granted'));
    if (perm.key === 'location')       localStorage.setItem('location_enabled',      String(result === 'granted'));
  };

  const handleRequestAll = async () => {
    for (const perm of PERMISSIONS) {
      if (states[perm.key] === 'idle') await handleRequest(perm);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Illustration */}
      <div className="relative w-56 h-56 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #10b98130, transparent 70%)' }}/>
        <div className="relative z-10 w-full h-full"><IllustrationPermissions /></div>
      </div>

      {/* Text */}
      <div className="text-center mb-6">
        <h2 className="text-white font-bold text-2xl mb-2">تفعيل الخدمات</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
          للحصول على أفضل تجربة، يرجى السماح بالوصول إلى الخدمات التالية
        </p>
      </div>

      {/* Permission rows */}
      <div className="space-y-3 mb-6">
        {PERMISSIONS.map(perm => {
          const state = states[perm.key];
          const isLoading = requesting === perm.key;
          return (
            <div
              key={perm.key}
              className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/8"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                state === 'granted' ? 'bg-green-500/20 text-green-400' :
                state === 'denied'  ? 'bg-red-500/20 text-red-400' :
                'bg-emerald-500/15 text-emerald-400'
              }`}>
                {perm.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{perm.label}</p>
                <p className="text-gray-400 text-xs mt-0.5 leading-snug">{perm.desc}</p>
              </div>
              <button
                onClick={() => handleRequest(perm)}
                disabled={state !== 'idle' || isLoading}
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  state === 'granted' ? 'bg-green-500/20 cursor-default' :
                  state === 'denied'  ? 'bg-red-500/15 cursor-default' :
                  isLoading           ? 'bg-emerald-500/20 animate-pulse' :
                  'bg-emerald-600 active:scale-90'
                }`}
              >
                {state === 'granted' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : state === 'denied' ? (
                  <span className="text-red-400 text-lg font-bold">✕</span>
                ) : isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white rtl:rotate-180" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <button
        onClick={handleRequestAll}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-base active:scale-95 transition-transform mb-3 shadow-lg shadow-emerald-600/20"
      >
        السماح بالكل
      </button>
      <button onClick={onDone} className="w-full py-3 text-gray-400 text-sm">
        تخطى
      </button>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
export default function Onboarding() {
  const [current, setCurrent]   = useState(0);
  const navigate                = useNavigate();
  const touchStartX             = useRef(0);
  const TOTAL                   = CONTENT_SLIDES.length + 1; // +1 = permissions slide

  const finish = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/login', { replace: true });
  };

  const goNext = () => {
    if (current < TOTAL - 1) setCurrent(c => c + 1);
    else finish();
  };

  const goPrev = () => { if (current > 0) setCurrent(c => c - 1); };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { if (diff > 0) goNext(); else goPrev(); }
  };

  const isPermSlide   = current === CONTENT_SLIDES.length;
  const isLastSlide   = current === TOTAL - 1;
  const slide         = !isPermSlide ? CONTENT_SLIDES[current] : null;
  const accentColor   = slide?.accentColor ?? '#10b981';

  return (
    <div
      className="min-h-screen bg-[#060d1a] flex flex-col select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip */}
      <div className="flex justify-end px-5 pt-12 pb-2">
        <button onClick={finish} className="text-gray-500 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          تخطى
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6">
        {isPermSlide ? (
          <PermissionsSlide onDone={finish} />
        ) : (
          <>
            {/* Illustration */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative w-64 h-64">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-25 transition-all duration-700"
                  style={{ background: `radial-gradient(circle, ${slide!.accentColor}40, transparent 70%)` }}
                />
                <div className="relative z-10 w-full h-full transition-all duration-500">
                  <slide.Illustration />
                </div>
              </div>

              <div className="text-center space-y-3 max-w-xs">
                <h2 className="text-white font-bold text-2xl leading-tight">{slide!.titleAr}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{slide!.subtitleAr}</p>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width:           i === current ? 28 : 8,
                    height:          8,
                    backgroundColor: i === current ? accentColor : '#1e3a5f',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom actions — only shown for content slides */}
      {!isPermSlide && (
        <div className="px-5 pb-10 space-y-3">
          <button
            onClick={goNext}
            className={`w-full py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 active:scale-95 shadow-lg bg-gradient-to-r ${slide!.gradientFrom} ${slide!.gradientTo}`}
            style={{ boxShadow: `0 8px 24px ${accentColor}30` }}
          >
            {current === CONTENT_SLIDES.length - 1 ? 'التالي' : 'التالي'}
          </button>
          {current === CONTENT_SLIDES.length - 1 && (
            <div className="text-center">
              <span className="text-gray-500 text-sm">لديك حساب؟ </span>
              <button onClick={finish} className="font-semibold text-sm" style={{ color: accentColor }}>
                تسجيل الدخول
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
