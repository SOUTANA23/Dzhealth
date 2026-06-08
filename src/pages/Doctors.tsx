import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Search, SlidersHorizontal, Phone, MapPin, Star, Verified } from "lucide-react";
import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { SPECIALTIES_AR, WILAYAS } from "@/lib/data.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useDebounce } from "@/hooks/use-debounce.ts";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

export default function Doctors() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const searchResults = useQuery(
    api.doctors.search,
    debouncedSearch.trim() ? { query: debouncedSearch } : "skip"
  );

  const { results: allDoctors, isLoading, status, loadMore } = usePaginatedQuery(
    api.doctors.list,
    {
      wilaya_code: selectedWilaya || undefined
    },
    { initialNumItems: 20 }
  );

  const doctors: Doc<"doctors">[] = debouncedSearch.trim() ?
  searchResults ?? [] :
  allDoctors;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-6 px-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg">{t("allDoctors")}</h1>
        </div>
        <div className="bg-white rounded-2xl flex items-center gap-3 px-4 h-12 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchDoctor")}
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground" />
          
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 pt-4 pb-2 flex gap-2">
        <select
          value={selectedWilaya}
          onChange={(e) => setSelectedWilaya(e.target.value)}
          className="flex-1 h-10 rounded-xl border border-border bg-card text-sm px-3 outline-none text-foreground cursor-pointer">
          
          <option value="">{t("wilaya")}: {t("all")}</option>
          {WILAYAS.map((w) =>
          <option key={w.code} value={w.code}>{w.ar}</option>
          )}
        </select>
        <button className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center cursor-pointer">
          <SlidersHorizontal className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Results */}
      <div className="px-5 pb-6 space-y-3 mt-2">
        {isLoading && !debouncedSearch ?
        Array.from({ length: 4 }).map((_, i) =>
        <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ) :
        doctors.length === 0 ?
        <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">لا توجد نتائج</p>
          </div> :

        <>
            {doctors.map((doc, i) =>
          <motion.div
            key={doc._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate(`/doctors/${doc._id}`)}
            className="bg-card rounded-2xl p-4 border border-border shadow-sm flex gap-3 cursor-pointer hover:shadow-md transition-shadow">
            
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm truncate">{doc.name}</h3>
                    {doc.is_verified &&
                <Verified className="w-3.5 h-3.5 text-primary shrink-0" />
                }
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground truncate">{doc.address}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold">{doc.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({doc.review_count})</span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary">{doc.fee.toLocaleString()} د.ج</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img
                src={doc.image ?? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"}
                alt={doc.name}
                className="w-16 h-16 rounded-xl object-cover" />
              
                  <a href={`tel:${doc.phone}`} onClick={(e) => e.stopPropagation()}>
                    


                
                  </a>
                </div>
              </motion.div>
          )}

            {!debouncedSearch && status === "CanLoadMore" &&
          <button
            onClick={() => loadMore(10)}
            className="w-full py-3 text-primary text-sm font-medium cursor-pointer hover:underline">
            
                عرض المزيد
              </button>
          }
          </>
        }
      </div>
    </div>);

}