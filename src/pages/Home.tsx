import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Search,
  Bell,
  MapPin,
  Phone,
  Star,
  ChevronLeft,
  Stethoscope,
  Building2,
  ShoppingBag,
  Droplets,
  Wrench,
  ShieldCheck,
  Leaf,
  MoreHorizontal,
  Verified,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { SAMPLE_DONORS } from "@/lib/data.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { cn } from "@/lib/utils.ts";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

const services = [
  { key: "doctors" as const, icon: Stethoscope, color: "bg-teal-50 text-teal-600", path: "/doctors" },
  { key: "hospitals" as const, icon: Building2, color: "bg-blue-50 text-blue-600", path: "/hospitals" },
  { key: "pharmacies" as const, icon: ShoppingBag, color: "bg-green-50 text-green-600", path: "/pharmacies" },
  { key: "bloodDonors" as const, icon: Droplets, color: "bg-red-50 text-red-600", path: "/donors" },
  { key: "medicalEquipment" as const, icon: Wrench, color: "bg-orange-50 text-orange-600", path: "/equipment" },
  { key: "civilProtection" as const, icon: ShieldCheck, color: "bg-purple-50 text-purple-600", path: "/civil" },
  { key: "herbalMedicine" as const, icon: Leaf, color: "bg-lime-50 text-lime-600", path: "/herbal" },
  { key: "more" as const, icon: MoreHorizontal, color: "bg-gray-50 text-gray-600", path: "/more" },
] as const;

function HomeContent() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const currentUser = useQuery(api.users.getCurrentUser, {});

  const doctorsData = useQuery(api.doctors.list, {
    paginationOpts: { numItems: 6, cursor: null },
  });

  const doctors = doctorsData?.page ?? [];

  const displayName = currentUser?.name ?? "مستخدم";
  const initial = displayName.charAt(0);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-6 px-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
              <span className="text-white font-bold text-sm">{initial}</span>
            </div>
            <div>
              <p className="text-white/80 text-xs">{t("greeting")} 👋</p>
              <h2 className="text-white font-bold text-sm">{displayName}</h2>
            </div>
          </div>
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
          </button>
        </div>
        <p className="text-white/70 text-xs mb-4">{t("howCanWeHelp")}</p>

        {/* Search bar */}
        <div
          className="bg-white rounded-2xl flex items-center gap-3 px-4 h-12 shadow-sm cursor-pointer"
          onClick={() => navigate("/search")}
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm text-muted-foreground">{t("search")}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 space-y-6">
        {/* Services grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">{t("mainServices")}</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={service.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(service.path)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", service.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-center text-foreground/80 leading-tight">
                    {t(service.key)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Featured doctors */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">{t("featuredDoctors")}</h3>
            <button
              onClick={() => navigate("/doctors")}
              className="text-primary text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              {t("seeAll")} <ChevronLeft className="w-3 h-3" />
            </button>
          </div>

          {doctors.length === 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="min-w-[160px] h-44 rounded-2xl shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ direction: "rtl" }}>
              {doctors.map((doc, i) => (
                <DoctorCard key={doc._id} doc={doc} index={i} onClick={() => navigate(`/doctors/${doc._id}`)} />
              ))}
            </div>
          )}
        </section>

        {/* Blood donors */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">{t("nearbyDonors")}</h3>
            <button
              onClick={() => navigate("/donors")}
              className="text-primary text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              {t("seeAll")} <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
          {SAMPLE_DONORS.filter((d) => d.is_available).slice(0, 1).map((donor) => (
            <div
              key={donor._id}
              className="bg-gradient-to-l from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-2xl p-4 border border-red-100 dark:border-red-900/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-base">{donor.blood_type}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{donor.blood_type} - {donor.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{donor.wilaya}</span>
                    </div>
                  </div>
                </div>
                <a href={`tel:${donor.phone}`}>
                  <button className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                    <Phone className="w-4 h-4 text-white" />
                  </button>
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{donor.phone}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function DoctorCard({ doc, index, onClick }: { doc: Doc<"doctors">; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-3 shadow-sm border border-border min-w-[160px] cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative mb-2">
        <img
          src={doc.image ?? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"}
          alt={doc.name}
          className="w-full h-24 object-cover rounded-xl"
        />
        {doc.is_verified && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Verified className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <h4 className="font-bold text-xs text-foreground truncate">{doc.name}</h4>
      <p className="text-[10px] text-muted-foreground truncate mt-0.5">{doc.specialty}</p>
      <div className="flex items-center gap-1 mt-1.5">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span className="text-[11px] font-semibold">{doc.rating}</span>
        <span className="text-[10px] text-muted-foreground">({doc.review_count})</span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <MapPin className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground truncate">{doc.wilaya}</span>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      <AuthLoading>
        <HomeSkeleton />
      </AuthLoading>
      <Authenticated>
        <HomeContent />
      </Authenticated>
      <Unauthenticated>
        <HomeUnauthenticated />
      </Unauthenticated>
    </>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-primary to-emerald-600 h-44" />
      <div className="px-5 py-5 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeUnauthenticated() {
  const navigate = useNavigate();
  const { t } = useAppSettings();
  const [search, setSearch] = useState("");

  const doctorsData = useQuery(api.doctors.list, {
    paginationOpts: { numItems: 6, cursor: null },
  });
  const doctors = doctorsData?.page ?? [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-6 px-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-xs">{t("greeting")} 👋</p>
            <h2 className="text-white font-bold text-sm">DZHEALTH</h2>
          </div>
          <SignInButton className="h-9 px-4 text-xs rounded-xl bg-white text-primary hover:bg-white/90" />
        </div>
        <p className="text-white/70 text-xs mb-4">{t("howCanWeHelp")}</p>
        <div
          className="bg-white rounded-2xl flex items-center gap-3 px-4 h-12 shadow-sm cursor-pointer"
          onClick={() => navigate("/search")}
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm text-muted-foreground">{t("search")}</span>
        </div>
      </div>

      <div className="px-5 py-5 space-y-6">
        <section>
          <div className="grid grid-cols-4 gap-3">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={service.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(service.path)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", service.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-center text-foreground/80 leading-tight">
                    {t(service.key)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">{t("featuredDoctors")}</h3>
            <button onClick={() => navigate("/doctors")} className="text-primary text-xs font-medium flex items-center gap-1 cursor-pointer">
              {t("seeAll")} <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ direction: "rtl" }}>
            {doctors.length === 0
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="min-w-[160px] h-44 rounded-2xl shrink-0" />)
              : doctors.map((doc, i) => (
                  <DoctorCard key={doc._id} doc={doc} index={i} onClick={() => navigate(`/doctors/${doc._id}`)} />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}
