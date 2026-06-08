import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Building2, Stethoscope, PawPrint, ShoppingBag, ShieldCheck, Leaf, AlertTriangle } from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";

const categories = [
  { icon: Building2, label: "مستشفى", color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600", path: "/add-info/hospital", border: "border-blue-100 dark:border-blue-900/30" },
  { icon: Stethoscope, label: "طبيب", color: "bg-teal-50 dark:bg-teal-950/30 text-teal-600", path: "/add-info/doctor", border: "border-teal-100 dark:border-teal-900/30" },
  { icon: PawPrint, label: "بيطري", color: "bg-amber-50 dark:bg-amber-950/30 text-amber-600", path: "/add-info/vet", border: "border-amber-100 dark:border-amber-900/30" },
  { icon: ShoppingBag, label: "صيدلية", color: "bg-green-50 dark:bg-green-950/30 text-green-600", path: "/add-info/pharmacy", border: "border-green-100 dark:border-green-900/30" },
  { icon: ShieldCheck, label: "حماية مدنية", color: "bg-red-50 dark:bg-red-950/30 text-red-600", path: "/add-info/civil", border: "border-red-100 dark:border-red-900/30" },
  { icon: Leaf, label: "طب بديل", color: "bg-lime-50 dark:bg-lime-950/30 text-lime-600", path: "/add-info/herbal", border: "border-lime-100 dark:border-lime-900/30" },
];

export default function AddInfo() {
  const { t } = useAppSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 pt-12 pb-6 px-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">{t("addInfo")}</h1>
        </div>
        <p className="text-white/70 text-xs mt-2 mr-8">{t("addInfoDesc")}</p>
      </div>

      <div className="px-5 pt-5 pb-6 space-y-4">
        {/* Warning */}
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 flex gap-3 border border-amber-200 dark:border-amber-900/30">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            يرجى التأكد من صحة المعلومات قبل إرسالها. سيتم مراجعتها قبل النشر.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.07 } as const}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(cat.path)}
                className={`${cat.color} border ${cat.border} rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 active:scale-95 transition-all`}
              >
                <Icon className="w-8 h-8" />
                <span className="font-bold text-sm">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
