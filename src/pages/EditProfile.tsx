import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAppSettings } from "@/hooks/use-app-settings.tsx";
import { WILAYAS, BLOOD_TYPES } from "@/lib/data.ts";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ConvexError } from "convex/values";

export default function EditProfile() {
  const { t } = useAppSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-y-auto" dir="rtl">
      <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-bold text-base">{t("editProfile")}</h1>
        <div className="w-5" />
      </div>
      <Unauthenticated>
        <div className="px-5 py-12 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول لتعديل ملفك الشخصي</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <EditProfileForm />
      </Authenticated>
    </div>
  );
}

function EditProfileForm() {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser, {});
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("23");
  const [selectedBloodType, setSelectedBloodType] = useState("O+");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Pre-fill form from real user data once loaded
  useEffect(() => {
    if (user && !initialized) {
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
      setSelectedWilaya(user.wilaya_code ?? "23");
      setSelectedBloodType(user.blood_type ?? "O+");
      setInitialized(true);
    }
  }, [user, initialized]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("الرجاء إدخال الاسم الكامل");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
        wilaya_code: selectedWilaya,
        blood_type: selectedBloodType,
      });
      toast.success("تم حفظ الملف الشخصي بنجاح ✓");
      navigate(-1);
    } catch (err) {
      if (err instanceof ConvexError) {
        const e = err.data as { message: string };
        toast.error(e.message);
      } else {
        toast.error("حدث خطأ، يرجى المحاولة مجدداً");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="px-5 py-5 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const initials = name.trim().charAt(0) || "م";

  return (
    <div className="px-5 py-5 space-y-5 pb-10">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">{initials}</span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">انقر لتغيير الصورة</p>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label className="text-sm">{t("fullName")}</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك الكامل"
          className="h-12 rounded-xl"
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label className="text-sm">{t("phone")}</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0555 12 34 56"
          type="tel"
          className="h-12 rounded-xl"
        />
      </div>

      {/* Wilaya */}
      <div className="space-y-2">
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
        {/* Quick-select top cities */}
        <div className="grid grid-cols-4 gap-2">
          {WILAYAS.filter((w) => ["16", "23", "25", "31", "19", "05", "06", "09"].includes(w.code)).map((w) => (
            <button
              key={w.code}
              onClick={() => setSelectedWilaya(w.code)}
              className={cn(
                "px-2 py-2 rounded-xl text-[11px] font-medium transition-colors cursor-pointer text-center",
                selectedWilaya === w.code
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground",
              )}
            >
              {w.ar}
            </button>
          ))}
        </div>
      </div>

      {/* Blood type */}
      <div className="space-y-2">
        <Label className="text-sm">{t("bloodType")}</Label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_TYPES.map((bt) => (
            <button
              key={bt}
              onClick={() => setSelectedBloodType(bt)}
              className={cn(
                "h-11 rounded-xl font-bold text-sm transition-colors cursor-pointer",
                selectedBloodType === bt
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-card border border-border text-foreground",
              )}
            >
              {bt}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl text-base font-bold mt-2"
      >
        {isSubmitting ? "جاري الحفظ..." : t("save")}
      </Button>
    </div>
  );
}
