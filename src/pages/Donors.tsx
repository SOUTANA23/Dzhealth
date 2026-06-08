import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Phone, MapPin, Plus, AlertCircle, Loader2 } from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { BLOOD_TYPES } from "@/lib/data.ts";
import { cn } from "@/lib/utils.ts";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty.tsx";
import { Droplets } from "lucide-react";

export default function Donors() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");

  const seedBloodDonors = useMutation(api.donors.seedBloodDonors);

  useEffect(() => {
    seedBloodDonors().catch(() => {});
  }, [seedBloodDonors]);

  const donors = useQuery(api.donors.listBloodDonors, {
    blood_type: selectedType !== "all" ? selectedType : undefined,
  });

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 pt-12 pb-6 px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">{t("bloodDonorsTitle")}</h1>
          {donors !== undefined && (
            <span className="mr-auto text-white/80 text-sm">{donors.length} متبرع</span>
          )}
        </div>

        {/* Emergency button */}
        <button
          onClick={() => toast.error("جاري إرسال طلب طوارئ...", { icon: "🚨" })}
          className="w-full h-12 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-white/30 transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-sm">{t("emergency")}</span>
        </button>
      </div>

      {/* Blood type chips */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedType("all")}
            className={cn(
              "shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-colors cursor-pointer",
              selectedType === "all"
                ? "bg-red-500 text-white"
                : "bg-card border border-border text-foreground",
            )}
          >
            {t("all")}
          </button>
          {BLOOD_TYPES.map((bt) => (
            <button
              key={bt}
              onClick={() => setSelectedType(bt)}
              className={cn(
                "shrink-0 px-4 h-9 rounded-full text-sm font-bold transition-colors cursor-pointer",
                selectedType === bt
                  ? "bg-red-500 text-white"
                  : "bg-card border border-border text-foreground",
              )}
            >
              {bt}
            </button>
          ))}
        </div>
      </div>

      {/* Donor list */}
      <div className="px-5 pb-24 space-y-3 mt-2">
        {donors === undefined ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))
        ) : donors.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Droplets /></EmptyMedia>
              <EmptyTitle>لا يوجد متبرعون</EmptyTitle>
              <EmptyDescription>
                {selectedType !== "all"
                  ? `لا يوجد متبرعون بفصيلة ${selectedType} حالياً`
                  : "كن أول متبرع في منطقتك"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          donors.map((donor, i) => (
            <motion.div
              key={donor._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0",
                donor.is_available ? "bg-red-500" : "bg-muted",
              )}>
                <span className={cn(
                  "font-bold text-sm",
                  donor.is_available ? "text-white" : "text-muted-foreground"
                )}>
                  {donor.blood_type}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm">{donor.hide_name ? "متبرع مجهول" : donor.name}</p>
                  {donor.is_available ? (
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {t("availableNow")}
                    </span>
                  ) : (
                    <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                      غير متاح
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{donor.wilaya}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{donor.phone}</p>
              </div>
              <a href={`tel:${donor.phone}`}>
                <button
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0",
                    donor.is_available
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-muted hover:bg-muted/80",
                  )}
                >
                  <Phone className={cn("w-4 h-4", donor.is_available ? "text-white" : "text-muted-foreground")} />
                </button>
              </a>
            </motion.div>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/donors/register")}
        className="fixed bottom-20 left-5 w-14 h-14 bg-red-500 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors z-40"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}
