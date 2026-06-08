import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Phone, MapPin, Star, ChevronDown, Search } from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { cn } from "@/lib/utils.ts";
import { WILAYAS } from "@/lib/data.ts";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { Hospital } from "lucide-react";

type HospitalType = "all" | "public" | "private";

export default function Hospitals() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<HospitalType>("all");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("all");
  const [showWilayaPicker, setShowWilayaPicker] = useState(false);
  const [search, setSearch] = useState("");

  const seedHospitals = useMutation(api.facilities.seedHospitals);
  useEffect(() => {
    seedHospitals().catch(() => {});
  }, [seedHospitals]);

  const hospitals = useQuery(api.facilities.listHospitals, {
    type: filter !== "all" ? filter : undefined,
    wilaya_code: selectedWilaya !== "all" ? selectedWilaya : undefined,
  });

  const filtered = hospitals?.filter((h) =>
    search.trim() === "" || h.name.includes(search.trim()),
  );

  const FILTERS: { value: HospitalType; label: string }[] = [
    { value: "all", label: t("all") },
    { value: "public", label: t("public") },
    { value: "private", label: t("private") },
  ];

  const wilayaLabel = selectedWilaya === "all"
    ? "كل الولايات"
    : WILAYAS.find((w) => w.code === selectedWilaya)?.ar ?? "ولاية";

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 pt-12 pb-6 px-5">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">{t("hospitalsTitle")}</h1>
          {filtered !== undefined && (
            <span className="mr-auto text-white/80 text-sm">{filtered.length} مستشفى</span>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 h-10 bg-white/20 border border-white/30 rounded-xl px-3 mb-2">
          <Search className="w-4 h-4 text-white/70 shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن مستشفى..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-white/60 text-sm outline-none"
            dir="rtl"
          />
        </div>

        {/* Wilaya selector */}
        <div className="relative mt-1">
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
                    selectedWilaya === "all" && "text-blue-600 font-semibold",
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
                      selectedWilaya === w.code && "text-blue-600 font-semibold",
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
              filter === f.value ? "bg-blue-500 text-white" : "bg-card border border-border text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-24 space-y-4 mt-2">
        {filtered === undefined ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Hospital /></EmptyMedia>
              <EmptyTitle>لا توجد مستشفيات</EmptyTitle>
              <EmptyDescription>
                {search ? `لا نتائج لـ "${search}"` : "لا توجد مستشفيات مطابقة للفلتر المحدد"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          filtered.map((hospital, i) => (
            <motion.div
              key={hospital._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Header band */}
              <div className={cn(
                "h-28 flex items-center justify-center relative",
                hospital.type === "public"
                  ? "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40"
                  : "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/40 dark:to-pink-950/40",
              )}>
                <span className="text-5xl">🏥</span>
                <span className={cn(
                  "absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full font-bold",
                  hospital.type === "public" ? "bg-blue-500 text-white" : "bg-purple-500 text-white",
                )}>
                  {hospital.type === "public" ? t("public") : t("private")}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">{hospital.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold">{hospital.rating ?? "—"}</span>
                      </div>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{hospital.phone}</span>
                    </div>
                    {hospital.services && hospital.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hospital.services.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                        {hospital.services.length > 4 && (
                          <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
                            +{hospital.services.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <a href={`tel:${hospital.phone}`}>
                    <button className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
