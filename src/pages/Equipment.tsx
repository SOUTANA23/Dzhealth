import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Phone, MapPin, Plus } from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { EQUIPMENT_TYPES_AR } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { Stethoscope } from "lucide-react";

const EQUIPMENT_ICONS: Record<string, string> = {
  "كرسي متحرك": "🦽",
  "سرير طبي": "🛏️",
  "عكاز / مشاية": "🦯",
  "جهاز أكسجين": "💨",
  "جهاز ضغط": "🩺",
  "جهاز سكري": "💉",
  "أجهزة أخرى": "🏥",
};

const conditionStyle = (c: string) => {
  if (c === "جيدة") return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";
  if (c === "مقبولة") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";
};

export default function Equipment() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");

  const seedEquipment = useMutation(api.donors.seedEquipment);
  useEffect(() => {
    seedEquipment().catch(() => {});
  }, [seedEquipment]);

  const equipment = useQuery(api.donors.listEquipment, {
    type: selectedType !== "all" ? selectedType : undefined,
  });

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 pt-12 pb-6 px-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">{t("medicalEquipmentTitle")}</h1>
          {equipment !== undefined && (
            <span className="mr-auto text-white/80 text-sm">{equipment.length} جهاز</span>
          )}
        </div>
        <p className="text-white/70 text-xs mt-1 mr-8">
          أجهزة طبية متاحة للإعارة أو الهبة
        </p>
      </div>

      {/* Type chips */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedType("all")}
            className={cn(
              "shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-colors cursor-pointer",
              selectedType === "all" ? "bg-green-500 text-white" : "bg-card border border-border",
            )}
          >
            {t("all")}
          </button>
          {EQUIPMENT_TYPES_AR.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-colors cursor-pointer",
                selectedType === type ? "bg-green-500 text-white" : "bg-card border border-border",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-24 space-y-3 mt-2">
        {equipment === undefined ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))
        ) : equipment.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Stethoscope /></EmptyMedia>
              <EmptyTitle>لا توجد أجهزة</EmptyTitle>
              <EmptyDescription>
                {selectedType !== "all"
                  ? `لا توجد أجهزة من نوع "${selectedType}" حالياً`
                  : "كن أول من يضيف جهازاً طبياً"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          equipment.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3"
            >
              <div className="w-14 h-14 bg-green-50 dark:bg-green-950/30 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-2xl">{EQUIPMENT_ICONS[item.type] ?? "🏥"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{item.type}</p>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block", conditionStyle(item.condition))}>
                  {t("condition")}: {item.condition}
                </span>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">{item.description}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.wilaya}</span>
                </div>
              </div>
              <a href={`tel:${item.phone}`}>
                <button className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </button>
              </a>
            </motion.div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/equipment/add")}
        className="fixed bottom-20 left-5 w-14 h-14 bg-green-500 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors z-40"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}
