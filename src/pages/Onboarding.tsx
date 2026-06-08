import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Calendar, Droplets, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

const slides = [
  {
    icon: Heart,
    color: "from-teal-500 to-emerald-600",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    titleAr: "اعثر على طبيبك",
    titleFr: "Trouvez votre médecin",
    descAr: "ابحث عن أفضل الأطباء في ولايتك واحجز موعدك بكل سهولة ويسر",
    descFr: "Trouvez les meilleurs médecins dans votre wilaya et prenez rendez-vous facilement",
    illustration: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
  },
  {
    icon: Calendar,
    color: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleAr: "احجز موعدك",
    titleFr: "Prenez rendez-vous",
    descAr: "احجز مواعيدك الطبية وتابعها بكل سهولة، وتلقَّ تذكيرات قبل المواعيد",
    descFr: "Réservez et suivez vos rendez-vous médicaux facilement, recevez des rappels",
    illustration: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80",
  },
  {
    icon: Droplets,
    color: "from-red-500 to-rose-600",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleAr: "تبرع وساعد",
    titleFr: "Donnez et aidez",
    descAr: "تبرع بالدم والمعدات الطبية، ساعد مجتمعك وأنقذ الأرواح",
    descFr: "Donnez du sang et des équipements médicaux, aidez votre communauté",
    illustration: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400&q=80",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/home", { replace: true });
  };

  const next = () => {
    if (current < slides.length - 1) setCurrent((c) => c + 1);
    else finish();
  };

  const prev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden" dir="rtl">
      {/* Skip button */}
      <div className="flex justify-between items-center p-4 pt-8">
        <button onClick={finish} className="text-muted-foreground text-sm cursor-pointer">
          تخطي
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-6" : "bg-border w-2"}`}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Illustration */}
            <div className="w-full max-w-sm aspect-square relative mt-4">
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} rounded-[2.5rem] opacity-10`} />
              <img
                src={slide.illustration}
                alt={slide.titleAr}
                className="w-full h-full object-cover rounded-[2.5rem] shadow-xl"
              />
              {/* Icon overlay */}
              <div className={`absolute bottom-4 right-4 w-14 h-14 ${slide.iconBg} rounded-2xl shadow-lg flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${slide.iconColor}`} />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-3 max-w-xs">
              <h2 className="text-2xl font-bold text-foreground">{slide.titleAr}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{slide.descAr}</p>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">{slide.descFr}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-10 flex items-center gap-3">
        {current > 0 && (
          <button
            onClick={prev}
            className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <Button
          onClick={next}
          className="flex-1 h-14 rounded-2xl text-base font-semibold"
        >
          {current < slides.length - 1 ? (
            <span className="flex items-center gap-2">
              التالي <ChevronRight className="w-5 h-5" />
            </span>
          ) : (
            "ابدأ الآن"
          )}
        </Button>
      </div>
    </div>
  );
}
