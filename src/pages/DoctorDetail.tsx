import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Heart,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Share2,
  Clock,
  Users,
  TrendingUp,
  Verified,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { cn } from "@/lib/utils.ts";
import { SignInButton } from "@/components/ui/signin.tsx";

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

function getDatesForNextDays(count: number) {
  const dates: { label: string; value: string; day: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    dates.push({
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      value: d.toISOString().split("T")[0],
      day: dayNames[d.getDay()],
    });
  }
  return dates;
}

export default function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const doctor = useQuery(
    api.doctors.getById,
    id ? { id: id as Id<"doctors"> } : "skip",
  );

  const reviews = useQuery(
    api.doctors.getReviews,
    id ? { doctor_id: id as Id<"doctors"> } : "skip",
  );

  const bookAppointment = useMutation(api.appointments.book);

  const dates = getDatesForNextDays(7);

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: doctor?.name ?? "", text: doctor?.specialty ?? "", url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط");
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("الرجاء اختيار التاريخ والوقت");
      return;
    }
    try {
      await bookAppointment({
        doctor_id: id as Id<"doctors">,
        date: selectedDate,
        time: selectedTime,
      });
      toast.success("تم حجز الموعد بنجاح!");
      setShowBooking(false);
      setSelectedDate("");
      setSelectedTime("");
    } catch {
      toast.error("حدث خطأ أثناء الحجز");
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Skeleton className="h-72 w-full" />
        <div className="px-5 py-5 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Clock, label: `${doctor.experience_years} ${t("years")}`, sublabel: t("experience") },
    { icon: Users, label: `${doctor.patients_count.toLocaleString()}+`, sublabel: t("patients") },
    { icon: TrendingUp, label: `${doctor.satisfaction}%`, sublabel: t("satisfaction") },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero */}
      <div className="relative h-72">
        <img
          src={doctor.image ?? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"}
          alt={doctor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-5 pt-12">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button onClick={share} className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center cursor-pointer">
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center cursor-pointer"
            >
              <Heart className={cn("w-4 h-4", isFavorite ? "text-red-400 fill-red-400" : "text-white")} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 right-5 left-5">
          <div className="flex items-center gap-1.5 mb-1">
            <h1 className="text-white font-bold text-xl">{doctor.name}</h1>
            {doctor.is_verified && <Verified className="w-5 h-5 text-primary" />}
          </div>
          <p className="text-white/80 text-sm">{doctor.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-white/70" />
            <span className="text-white/70 text-xs">{doctor.address}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 space-y-5">
        {/* Rating + fee */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-sm">{doctor.rating}</span>
            <span className="text-xs text-muted-foreground">({doctor.review_count} {t("reviews")})</span>
          </div>
          <div className="bg-primary/10 rounded-xl px-3 py-1.5">
            <span className="text-primary font-bold text-sm">{doctor.fee.toLocaleString()} د.ج</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.sublabel} className="bg-card rounded-2xl p-3 text-center border border-border">
                <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="font-bold text-sm">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground">{stat.sublabel}</p>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <a href={`tel:${doctor.phone}`}>
            <button className="w-full h-12 bg-primary rounded-2xl flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-primary/90 transition-colors">
              <Phone className="w-4 h-4 text-primary-foreground" />
              <span className="text-primary-foreground text-[10px]">{t("call")}</span>
            </button>
          </a>
          <button className="w-full h-12 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 text-[10px]">رسالة</span>
          </button>
          <a
            href={doctor.lat && doctor.lng ? `https://www.openstreetmap.org/?mlat=${doctor.lat}&mlon=${doctor.lng}&zoom=16` : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full h-12 bg-green-50 dark:bg-green-950/30 rounded-2xl flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-green-600 text-[10px]">{t("clinicLocation")}</span>
            </button>
          </a>
        </div>

        {/* About */}
        {doctor.about && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-bold text-sm mb-2">{t("about")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about}</p>
          </div>
        )}

        {/* Tags */}
        {doctor.tags.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-2">{t("tags")}</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.tags.map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-3">آراء المرضى ({reviews.length})</h3>
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review._id} className="bg-card rounded-2xl p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn("w-3.5 h-3.5", i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground")}
                        />
                      ))}
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book button */}
        <Authenticated>
          <Button
            className="w-full h-14 rounded-2xl text-base font-bold"
            onClick={() => setShowBooking(true)}
          >
            <Calendar className="w-5 h-5 ml-2" />
            {t("book")}
          </Button>
        </Authenticated>
        <Unauthenticated>
          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">سجل دخولك لحجز موعد</p>
            <SignInButton className="w-full h-12 rounded-2xl" />
          </div>
        </Unauthenticated>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowBooking(false)}>
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg">حجز موعد</h3>
                <button onClick={() => setShowBooking(false)} className="cursor-pointer w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Date picker */}
              <div className="mb-5">
                <p className="font-semibold text-sm mb-3">اختر التاريخ</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      className={cn(
                        "shrink-0 flex flex-col items-center gap-0.5 px-4 py-3 rounded-2xl text-sm cursor-pointer transition-colors border",
                        selectedDate === d.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border",
                      )}
                    >
                      <span className="text-[10px] opacity-70">{d.day}</span>
                      <span className="font-bold">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div className="mb-6">
                <p className="font-semibold text-sm mb-3">اختر الوقت</p>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors border",
                        selectedTime === time
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:border-primary/30",
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleBook}
                className="w-full h-12 rounded-2xl font-bold"
                disabled={!selectedDate || !selectedTime}
              >
                تأكيد الحجز
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
