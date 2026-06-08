import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Stethoscope,
  Building2,
  Pill,
  Droplets,
  User,
  MapPin,
  Phone,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { SPECIALTIES_AR } from "@/lib/data.ts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { cn } from "@/lib/utils.ts";
import { useDebounce } from "@/hooks/use-debounce.ts";

type Tab = "all" | "doctors" | "pharmacies" | "hospitals" | "donors";

const TABS: { value: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "all", label: "الكل", icon: Search },
  { value: "doctors", label: "أطباء", icon: Stethoscope },
  { value: "pharmacies", label: "صيدليات", icon: Pill },
  { value: "hospitals", label: "مستشفيات", icon: Building2 },
  { value: "donors", label: "متبرعون", icon: Droplets },
];

export default function SearchPage() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [debouncedQuery] = useDebounce(query, 300);

  const isSearching = debouncedQuery.trim().length > 0;

  // Specialty browse (when no query)
  const specialties = SPECIALTIES_AR.filter(
    (s) => !isSearching || s.includes(debouncedQuery),
  );

  // Live search queries (skipped when no query)
  const doctors = useQuery(
    api.doctors.search,
    isSearching && (activeTab === "all" || activeTab === "doctors")
      ? { query: debouncedQuery }
      : "skip",
  );
  const pharmacies = useQuery(
    api.facilities.listPharmacies,
    isSearching && (activeTab === "all" || activeTab === "pharmacies") ? {} : "skip",
  );
  const hospitals = useQuery(
    api.facilities.listHospitals,
    isSearching && (activeTab === "all" || activeTab === "hospitals") ? {} : "skip",
  );
  const donors = useQuery(
    api.donors.listBloodDonors,
    isSearching && (activeTab === "all" || activeTab === "donors") ? {} : "skip",
  );

  // Client-side text filter for non-search-indexed collections
  const filteredPharmacies = pharmacies?.filter((p) =>
    p.name.includes(debouncedQuery) || p.address.includes(debouncedQuery),
  );
  const filteredHospitals = hospitals?.filter((h) =>
    h.name.includes(debouncedQuery) || h.address.includes(debouncedQuery),
  );
  const filteredDonors = donors?.filter(
    (d) => !d.hide_name && d.name.includes(debouncedQuery),
  );

  const totalResults =
    (doctors?.length ?? 0) +
    (filteredPharmacies?.length ?? 0) +
    (filteredHospitals?.length ?? 0) +
    (filteredDonors?.length ?? 0);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-5 px-5">
        <h1 className="text-white font-bold text-lg mb-3">{t("searchNav")}</h1>
        {/* Search bar */}
        <div className="bg-white dark:bg-card rounded-2xl flex items-center gap-3 px-4 h-12 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن طبيب، صيدلية، مستشفى..."
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground text-foreground"
            autoFocus
            dir="rtl"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabs (only when searching) */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border"
          >
            <div className="flex gap-1 px-4 pt-3 pb-2 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium transition-colors cursor-pointer",
                      activeTab === tab.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground",
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 pt-4 pb-24">
        {!isSearching ? (
          /* Browse specialties */
          <>
            <p className="text-xs text-muted-foreground mb-3 font-medium">{t("specialty")}</p>
            <div className="space-y-2">
              {specialties.map((specialty, i) => (
                <motion.button
                  key={specialty}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(specialty)}`)}
                  className="w-full bg-card rounded-2xl p-4 border border-border flex items-center gap-3 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1 text-right">{specialty}</span>
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          /* Search results */
          <div className="space-y-5">
            {totalResults === 0 && doctors !== undefined && filteredPharmacies !== undefined && filteredHospitals !== undefined ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">لا نتائج لـ &ldquo;{debouncedQuery}&rdquo;</p>
                <p className="text-xs text-muted-foreground mt-1">جرّب كلمة بحث مختلفة</p>
              </div>
            ) : (
              <>
                {/* Doctors */}
                {(activeTab === "all" || activeTab === "doctors") && doctors && doctors.length > 0 && (
                  <Section title="أطباء" count={doctors.length}>
                    {doctors.slice(0, 5).map((doc, i) => (
                      <motion.button
                        key={doc._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate(`/doctors/${doc._id}`)}
                        className="w-full bg-card rounded-2xl p-3 border border-border flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors text-right"
                      >
                        <div className="w-11 h-11 rounded-xl bg-primary/10 overflow-hidden shrink-0">
                          {doc.image ? (
                            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{doc.specialty}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-medium">{doc.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{doc.wilaya}</span>
                          </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                      </motion.button>
                    ))}
                  </Section>
                )}

                {/* Pharmacies */}
                {(activeTab === "all" || activeTab === "pharmacies") && filteredPharmacies && filteredPharmacies.length > 0 && (
                  <Section title="صيدليات" count={filteredPharmacies.length}>
                    {filteredPharmacies.slice(0, 4).map((p, i) => (
                      <motion.button
                        key={p._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate("/pharmacies")}
                        className="w-full bg-card rounded-2xl p-3 border border-border flex items-center gap-3 cursor-pointer hover:border-teal-300 transition-colors text-right"
                      >
                        <div className="w-11 h-11 bg-teal-50 dark:bg-teal-950/30 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-xl">💊</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{p.name}</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">{p.address}</span>
                          </div>
                          {p.on_call_24h && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">24/7</span>
                          )}
                        </div>
                        <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()}>
                          <button className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors shrink-0">
                            <Phone className="w-3.5 h-3.5 text-white" />
                          </button>
                        </a>
                      </motion.button>
                    ))}
                  </Section>
                )}

                {/* Hospitals */}
                {(activeTab === "all" || activeTab === "hospitals") && filteredHospitals && filteredHospitals.length > 0 && (
                  <Section title="مستشفيات" count={filteredHospitals.length}>
                    {filteredHospitals.slice(0, 4).map((h, i) => (
                      <motion.button
                        key={h._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate("/hospitals")}
                        className="w-full bg-card rounded-2xl p-3 border border-border flex items-center gap-3 cursor-pointer hover:border-blue-300 transition-colors text-right"
                      >
                        <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-xl">🏥</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{h.name}</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">{h.address}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-medium">{h.rating}</span>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-medium mr-1",
                              h.type === "public" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700",
                            )}>
                              {h.type === "public" ? "عام" : "خاص"}
                            </span>
                          </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                      </motion.button>
                    ))}
                  </Section>
                )}

                {/* Blood donors */}
                {(activeTab === "all" || activeTab === "donors") && filteredDonors && filteredDonors.length > 0 && (
                  <Section title="متبرعو الدم" count={filteredDonors.length}>
                    {filteredDonors.slice(0, 3).map((d, i) => (
                      <motion.button
                        key={d._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate("/donors")}
                        className="w-full bg-card rounded-2xl p-3 border border-border flex items-center gap-3 cursor-pointer hover:border-red-300 transition-colors text-right"
                      >
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                          d.is_available ? "bg-red-500" : "bg-muted",
                        )}>
                          <span className={cn("font-bold text-sm", d.is_available ? "text-white" : "text-muted-foreground")}>
                            {d.blood_type}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{d.name}</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{d.wilaya}</span>
                          </div>
                        </div>
                        <a href={`tel:${d.phone}`} onClick={(e) => e.stopPropagation()}>
                          <button className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shrink-0">
                            <Phone className="w-3.5 h-3.5 text-white" />
                          </button>
                        </a>
                      </motion.button>
                    ))}
                  </Section>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{count} نتيجة</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
