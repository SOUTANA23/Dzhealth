import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  Droplets,
  Settings,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { cn } from "@/lib/utils.ts";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { showSuccessToast } from "@/lib/toast.ts";

type NotifType = Doc<"notifications">["type"];

const TYPE_CONFIG: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  appointment: { icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  donor: { icon: Droplets, color: "text-red-500", bg: "bg-red-50" },
  system: { icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
  promo: { icon: Tag, color: "text-amber-500", bg: "bg-amber-50" },
};

function NotifCard({
  notif,
  index,
  onRead,
}: {
  notif: Doc<"notifications">;
  index: number;
  onRead: (id: Doc<"notifications">["_id"]) => void;
}) {
  const navigate = useNavigate();
  const cfg = TYPE_CONFIG[notif.type];
  const Icon = cfg.icon;
  const timeAgo = formatDistanceToNow(new Date(notif._creationTime), { addSuffix: true, locale: ar });

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30, height: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 } as const}
      className={cn(
        "flex gap-3 px-4 py-4 rounded-2xl border transition-colors cursor-pointer",
        notif.is_read ? "bg-card border-border" : "bg-primary/5 border-primary/20",
      )}
      onClick={() => {
        if (!notif.is_read) onRead(notif._id);
        if (notif.link) navigate(notif.link);
      }}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
        <Icon className={cn("w-5 h-5", cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-semibold leading-tight", !notif.is_read && "text-primary")}>
            {notif.title}
          </p>
          {!notif.is_read && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.body}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1.5">{timeAgo}</p>
      </div>
    </motion.div>
  );
}

function NotificationsContent() {
  const navigate = useNavigate();
  const notifications = useQuery(api.notifications.listNotifications, {});
  const unread = useQuery(api.notifications.unreadCount, {});
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const seedNotifications = useMutation(api.notifications.seedNotifications);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    await seedNotifications({});
    setSeeded(true);
  };

  const handleMarkAll = async () => {
    await markAllRead({});
    showSuccessToast("تم تعيين جميع الإشعارات كمقروءة");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-5 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <div>
              <h1 className="text-white font-bold text-lg">الإشعارات</h1>
              {(unread ?? 0) > 0 && (
                <p className="text-white/70 text-xs">{unread} إشعار غير مقروء</p>
              )}
            </div>
          </div>
          {(unread ?? 0) > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-white" />
              <span className="text-white text-xs">قراءة الكل</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {notifications === undefined ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Bell className="w-9 h-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">لا توجد إشعارات</p>
              <p className="text-sm text-muted-foreground mt-1">ستظهر هنا إشعاراتك عند توفرها</p>
            </div>
            {!seeded && (
              <Button variant="outline" size="sm" onClick={handleSeed} className="rounded-xl">
                تحميل إشعارات تجريبية
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif, i) => (
              <NotifCard
                key={notif._id}
                notif={notif}
                index={i}
                onRead={(id) => markRead({ notificationId: id })}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function Notifications() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-background flex flex-col">
          <div className="bg-gradient-to-br from-primary to-emerald-600 pt-12 pb-5 px-5">
            <Skeleton className="h-8 w-40 bg-white/20" />
          </div>
          <div className="px-4 py-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6" dir="rtl">
          <Bell className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">سجل دخولك لعرض الإشعارات</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <NotificationsContent />
      </Authenticated>
    </>
  );
}
