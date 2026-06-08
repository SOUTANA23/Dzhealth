import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const STATUS_CONFIG = {
  pending: { label: "قيد الانتظار", icon: AlertCircle, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
  confirmed: { label: "مؤكد", icon: CheckCircle, color: "text-green-500 bg-green-50 dark:bg-green-950/30" },
  cancelled: { label: "ملغى", icon: XCircle, color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
  completed: { label: "مكتمل", icon: CheckCircle, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
} as const;

function AppointmentsContent() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const appointments = useQuery(api.appointments.list, {});
  const cancelMutation = useMutation(api.appointments.cancel);

  const handleCancel = async (id: Id<"appointments">) => {
    try {
      await cancelMutation({ id });
      toast.success("تم إلغاء الموعد");
    } catch {
      toast.error("حدث خطأ");
    }
  };

  if (!appointments) {
    return (
      <div className="px-5 pt-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-5">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <Calendar className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-base">لا توجد مواعيد</h3>
          <p className="text-sm text-muted-foreground mt-1">احجز موعدك الأول مع أحد أطبائنا</p>
        </div>
        <Button onClick={() => navigate("/doctors")} className="rounded-xl px-6">
          ابحث عن طبيب
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-6 space-y-3 mt-4">
      {appointments.map((appt, i) => {
        const statusConf = STATUS_CONFIG[appt.status];
        const StatusIcon = statusConf.icon;
        return (
          <motion.div
            key={appt._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl border border-border p-4 space-y-3"
          >
            {/* Doctor info */}
            <div className="flex items-center gap-3">
              <img
                src={appt.doctor?.image ?? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"}
                alt={appt.doctor?.name ?? ""}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{appt.doctor?.name ?? "طبيب"}</h3>
                <p className="text-xs text-muted-foreground truncate">{appt.doctor?.specialty}</p>
              </div>
              <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1", statusConf.color)}>
                <StatusIcon className="w-3 h-3" />
                {statusConf.label}
              </span>
            </div>

            {/* Date/time */}
            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">
                  {format(new Date(appt.date), "d MMMM yyyy", { locale: ar })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{appt.time}</span>
              </div>
            </div>

            {/* Actions */}
            {appt.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleCancel(appt._id)}
                  className="flex-1 h-9 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 text-xs font-medium cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  إلغاء الموعد
                </button>
                {appt.doctor?.phone && (
                  <a href={`tel:${appt.doctor.phone}`} className="flex-1">
                    <button className="w-full h-9 rounded-xl bg-primary text-primary-foreground text-xs font-medium cursor-pointer hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                      <Phone className="w-3 h-3" />
                      اتصال بالطبيب
                    </button>
                  </a>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Appointments() {
  const { t } = useAppSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-6 px-5">
        <h1 className="text-white font-bold text-lg">{t("appointments")}</h1>
        <p className="text-white/70 text-xs mt-1">إدارة مواعيدك الطبية</p>
      </div>

      <AuthLoading>
        <div className="px-5 pt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </AuthLoading>

      <Authenticated>
        <AppointmentsContent />
      </Authenticated>

      <Unauthenticated>
        <div className="flex flex-col items-center justify-center py-20 gap-4 px-5">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-base">سجل دخولك لعرض مواعيدك</h3>
            <p className="text-sm text-muted-foreground mt-1">تتبع مواعيدك الطبية بسهولة</p>
          </div>
          <SignInButton className="rounded-xl px-6 h-11" />
        </div>
      </Unauthenticated>
    </div>
  );
}
