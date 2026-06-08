import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Phone, MapPin, Clock, Star, ChevronDown } from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { cn } from "@/lib/utils.ts";
import { WILAYAS } from "@/lib/data.ts";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { Building2 } from "lucide-react";

type FilterType = "all" | "24h" | "night";

export default function Pharmacies() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("all");
  const [showWilayaPicker, setShowWilayaPicker] = useState(false);

  const seedPharmacies = useMutation(api.facilities.seedPharmacies);
  useEffect(() => {
    seedPharmacies().catch(() => {});
  }, [seedPharmacies]);

  const pharmacies = useQuery(api.facilities.listPharmacies, {
    on_call_24h: filter === "24h" ? true : undefined,
    night_shift: filter === "night" ? true : undefined,
    wilaya_code: selectedWilaya !== "all" ? selectedWilaya : undefined,
  });

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: "all", label: t("all") },
    { value: "24h", label: t("onCall24h") },
    { value: "night", label: t("nightShift") },
  ];

  const wilayaLabel = selectedWilaya === "all"
    ? "كل الولايات"
    : WILAYAS.find((w) => w.code === selectedWilaya)?.ar ?? "ولاية";

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 pt-12 pb-6 px-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">{t("pharmaciesTitle")}</h1>
          {pharmacies !== undefined && (
            <span className="mr-auto text-white/80 text-sm">{pharmacies.length} صيدلية</span>
          )}
        </div>

        {/* Wilaya selector */}
        <div className="mt-3 relative">
          <button
            onClick={() => setShowWilayaPicker((v) => !v)}
            className="w-full h-10 bg-white/20 border border-white/30 rounded-xl flex items-center justify-between px-4 cursor-pointer hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{wilayaLabel}</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-white transition-transform", showWilayaPicker && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showWilayaPicker && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 left-0 z-50 bg-card border border-border rounded-2xl shadow-xl max-h-56 overflow-y-auto"
              >
                <button
                  onClick={() => { setSelectedWilaya("all"); setShowWilayaPicker(false); }}
                  className={cn(
                    "w-full text-right px-4 py-2.5 text-sm hover:bg-muted transition-colors cursor-pointer first:rounded-t-2xl",
                    selectedWilaya === "all" && "text-teal-600 font-semibold",
                  )}
                >
                  كل الولايات
                </button>
                {WILAYAS.map((w) => (
                  <button
                    key={w.code}
                    onClick={() => { setSelectedWilaya(w.code); setShowWilayaPicker(false); }}
                    className={cn(
                      "w-full text-right px-4 py-2.5 text-sm hover:bg-muted transition-colors cursor-pointer last:rounded-b-2xl",
                      selectedWilaya === w.code && "text-teal-600 font-semibold",
                    )}
                  >
                    {w.ar}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-5 pt-4 pb-2 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 h-9 rounded-full text-sm font-medium transition-colors cursor-pointer",
              filter === f.value ? "bg-teal-500 text-white" : "bg-card border border-border text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-24 space-y-3 mt-2">
        {pharmacies === undefined ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))
        ) : pharmacies.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Building2 /></EmptyMedia>
              <EmptyTitle>لا توجد صيدليات</EmptyTitle>
              <EmptyDescription>لا توجد صيدليات مطابقة للفلتر المحدد</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          pharmacies.map((pharmacy, i) => (
            <motion.div
              key={pharmacy._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-2xl p-4 border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">💊</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm">{pharmacy.name}</h3>
                    {pharmacy.on_call_24h && (
                      <span className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        24/7
                      </span>
                    )}
                    {pharmacy.night_shift && !pharmacy.on_call_24h && (
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {t("nightShift")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-muted-foreground">{pharmacy.phone}</p>
                    {pharmacy.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold">{pharmacy.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <a href={`tel:${pharmacy.phone}`}>
                  <button className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </button>
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
