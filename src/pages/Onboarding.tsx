import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Stethoscope, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    icon: Stethoscope,
    titleAr: 'ابحث عن أفضل الأطباء',
    subtitleAr: 'اعثر على أفضل المتخصصين الطبيين بالقرب منك',
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Heart,
    titleAr: 'احجز موعدك بسهولة',
    subtitleAr: 'احجز موعدك الطبي في ثوانٍ معدودة',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Users,
    titleAr: 'تبرع وساعد الآخرين',
    subtitleAr: 'تبرع بالدم أو المعدات الطبية وأنقذ أرواحاً',
    color: 'from-red-500 to-pink-600',
    bg: 'bg-red-500/10',
  },
];

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/login', { replace: true });
  };

  const next = () => {
    if (slide < SLIDES.length - 1) setSlide(s => s + 1);
    else finish();
  };

  const { icon: Icon, titleAr, subtitleAr, color, bg } = SLIDES[slide];

  return (
    <div className="min-h-screen bg-[#060d1a] flex flex-col items-center justify-between px-6 py-12">
      {/* Skip */}
      <div className="w-full flex justify-end">
        <button onClick={finish} className="text-gray-500 text-sm">تخطى</button>
      </div>

      {/* Illustration */}
      <div className="flex flex-col items-center gap-8 flex-1 justify-center">
        <div className={`w-32 h-32 ${bg} rounded-full flex items-center justify-center`}>
          <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-2xl`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-white">{titleAr}</h2>
          <p className="text-gray-400 text-base leading-relaxed">{subtitleAr}</p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-cyan-400' : 'w-2 bg-gray-700'}`}
            />
          ))}
        </div>
      </div>

      {/* Button */}
      <button
        onClick={next}
        className={`w-full py-4 rounded-2xl bg-gradient-to-r ${color} text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform duration-150 active:scale-95`}
      >
        {slide === SLIDES.length - 1 ? 'ابدأ الآن' : 'التالي'}
        <ChevronRight className="w-5 h-5 rtl:rotate-180" />
      </button>
    </div>
  );
}
