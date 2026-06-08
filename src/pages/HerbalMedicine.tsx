import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Leaf,
  Phone,
  MapPin,
  Star,
  ArrowRight,
  Flower2,
  Droplets,
  Moon,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { cn } from "@/lib/utils.ts";
import { WILAYAS } from "@/lib/data.ts";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

type HerbalSpecialty = Doc<"herbal_medicine">["specialty"];

const SPECIALTY_CONFIG: Record<HerbalSpecialty, { label: string; icon: typeof Leaf; color: string; bg: string; activeBg: string }> = {
  herbs:       { label: "أعشاب طبية", icon: Leaf,    color: "text-green-600",  bg: "bg-green-50",  activeBg: "bg-green-600" },
  cupping:     { label: "حجامة",      icon: Droplets, color: "text-red-500",    bg: "bg-red-50",    activeBg: "bg-red-500" },
  honey:       { label: "عسل",        icon: Flower2,  color: "text-amber-500",  bg: "bg-amber-50",  activeBg: "bg-amber-500" },
  ruqya:       { label: "رقية شرعية", icon: Moon,     color: "text-indigo-600", bg: "bg-indigo-50", activeBg: "bg-indigo-600" },
  acupuncture: { label: "وخز بالإبر", icon: Zap,      color: "text-teal-600",   bg: "bg-teal-50",   activeBg: "bg-teal-600" },
  general:     { label: "عام",        icon: Leaf,     color: "text-lime-600",   bg: "bg-lime-50",   activeBg: "bg-lime-600" },
};

function PractitionerCard({ p, index }: { p: Doc<"herbal_medicine">; index: number }) {
  const cfg = SPECIALTY_CONFIG[p.specialty];
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 } as const}
      className="bg-card rounded-2xl border border-border p-4 space-y-3"
    >
      <div className="flex gap-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
          <Icon className={cn("w-6 h-6", cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold leading-tight">{p.name}</p>
              {p.is_verified && <BadgeCheck className="w-4 h-4 text-primary shrink-0" />}
            </div>
            {p.rating !== undefined && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold">{p.rating.toFixed(1)}</span>
                {p.review_count !== undefined && (
                  <span className="text-[10px] text-muted-foreground">({p.review_count})</span>
                )}
              </div>
            )}
          </div>
          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block", cfg.bg, cfg.color)}>
            {cfg.label}
          </span>
        </div>
      </div>

      {p.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
      )}

      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground truncate">{p.address}، {p.wilaya}</p>
      </div>

      <a
        href={`tel:${p.phone}`}
        className={cn(
          "flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer",
          cfg.activeBg,
        )}
      >
        <Phone className="w-4 h-4" />
        {p.phone}
      </a>
    </motion.div>
  );
}

export default function HerbalMedicine() {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const seedHerbal = useMutation(api.herbal.seed);
  const practitioners = useQuery(api.herbal.list, {
    wilaya_code: selectedWilaya || undefined,
    specialty: selectedSpecialty || undefined,
  });

  const filtered = practitioners ?? [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-lime-700 to-green-500 pt-12 pb-5 px-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">الطب البديل</h1>
            <p className="text-white/70 text-xs">أعشاب · حجامة · عسل · رقية · وخز بالإبر</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pt-4 space-y-3">
        {/* Specialty chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedSpecialty(null)}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer",
              !selectedSpecialty ? "bg-lime-600 text-white" : "bg-card border border-border",
            )}
          >
            الكل
          </button>
          {(Object.entries(SPECIALTY_CONFIG) as [HerbalSpecialty, typeof SPECIALTY_CONFIG[HerbalSpecialty]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedSpecialty(selectedSpecialty === key ? null : key)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1",
                selectedSpecialty === key ? `${cfg.activeBg} text-white` : "bg-card border border-border text-foreground",
              )}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Wilaya */}
        <select
          value={selectedWilaya}
          onChange={(e) => setSelectedWilaya(e.target.value)}
          className="w-full h-11 rounded-xl border border-border bg-card text-sm px-3 outline-none text-foreground cursor-pointer"
        >
          <option value="">كل الولايات</option>
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.code}>{w.ar}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="px-4 py-3 space-y-3 pb-20">
        {practitioners === undefined ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Leaf className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">لا يوجد ممارسون في هذا التصفية</p>
            <button onClick={() => seedHerbal({})} className="text-primary text-xs underline cursor-pointer">
              تحميل البيانات التجريبية
            </button>
          </div>
        ) : (
          filtered.map((p, i) => <PractitionerCard key={p._id} p={p} index={i} />)
        )}
      </div>
    </div>
  );
}
