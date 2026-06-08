import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { WILAYAS, BLOOD_TYPES } from "@/lib/data.ts";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast.ts";
import { cn } from "@/lib/utils.ts";
import { motion } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import { useAuth } from "@/hooks/use-auth.ts";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Authenticated, Unauthenticated } from "convex/react";

export default function RegisterDonor() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedBT, setSelectedBT] = useState("O+");
  const [selectedWilaya, setSelectedWilaya] = useState("23");
  const [available, setAvailable] = useState(true);
  const [hideName, setHideName] = useState(false);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerBloodDonor = useMutation(api.donors.registerBloodDonor);

  const wilayaObj = WILAYAS.find((w) => w.code === selectedWilaya);

  const handleSubmit = async () => {
    if (!phone.trim()) {
      showWarningToast("الرجاء إدخال رقم الهاتف");
      return;
    }
    setIsSubmitting(true);
    try {
      await registerBloodDonor({
        name: hideName ? "متبرع مجهول" : (user?.profile.name ?? "متبرع"),
        blood_type: selectedBT,
        wilaya: wilayaObj?.ar ?? "غير محدد",
        wilaya_code: selectedWilaya,
        phone: phone.trim(),
        is_available: available,
        hide_name: hideName,
      });
      showSuccessToast("تم تسجيلك كمتبرع بنجاح!", { description: "شكراً لك على إنقاذ الأرواح 🩸" });
      navigate(-1);
    } catch (err) {
      if (err instanceof ConvexError) {
        const e = err.data as { message: string };
        showErrorToast(e.message);
      } else {
        showErrorToast("حدث خطأ، يرجى المحاولة مجدداً");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto" dir="rtl">
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-base">{t("registerDonor")}</h1>
      </div>

      <Unauthenticated>
        <div className="px-5 py-12 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول لتسجيل نفسك كمتبرع</p>
          <SignInButton />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="px-5 py-5 space-y-5 pb-10">
          {/* Blood type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t("bloodType")}</Label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map((bt) => (
                <button
                  key={bt}
                  onClick={() => setSelectedBT(bt)}
                  className={cn(
                    "h-12 rounded-xl font-bold text-base transition-colors cursor-pointer",
                    selectedBT === bt ? "bg-red-500 text-white shadow-md" : "bg-card border border-border",
                  )}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          {/* Wilaya */}
          <div className="space-y-1.5">
            <Label className="text-sm">{t("wilaya")}</Label>
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="w-full h-12 rounded-xl border border-border bg-card text-sm px-3 outline-none text-foreground cursor-pointer"
            >
              {WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>{w.ar}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-sm">{t("phone")}</Label>
            <Input
              type="tel"
              placeholder="0555 12 34 56"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Toggles */}
          <div className="bg-card rounded-2xl border border-border divide-y divide-border">
            <ToggleRow label={t("availableNow")} value={available} onChange={setAvailable} />
            <ToggleRow label={t("hideName")} value={hideName} onChange={setHideName} />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl text-base font-bold bg-red-500 hover:bg-red-600"
          >
            {isSubmitting ? "جاري الحفظ..." : t("registerDonor")}
          </Button>
        </div>
      </Authenticated>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={cn("w-12 h-6 rounded-full transition-colors cursor-pointer relative", value ? "bg-primary" : "bg-border")}
      >
        <motion.div
          animate={{ x: value ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
