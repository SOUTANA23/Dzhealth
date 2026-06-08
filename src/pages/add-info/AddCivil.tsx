import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { WILAYAS } from "@/lib/data.ts";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast.ts";
import { TextInput, WilayaSelect, ToggleChips, ToggleRow } from "./_components/form-fields.tsx";

type CivilType = "ambulance" | "fire" | "rescue" | "general";

const CIVIL_TYPES: { value: CivilType; label: string; color: string }[] = [
  { value: "general", label: "عام", color: "bg-purple-500 text-white" },
  { value: "ambulance", label: "إسعاف", color: "bg-red-500 text-white" },
  { value: "fire", label: "إطفاء", color: "bg-orange-500 text-white" },
  { value: "rescue", label: "إنقاذ", color: "bg-blue-500 text-white" },
];

export default function AddCivil() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [wilayaCode, setWilayaCode] = useState("23");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<CivilType>("general");
  const [region, setRegion] = useState("");
  const [is_24h, setIs24h] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addCivil = useMutation(api.civil.add);

  const handleSubmit = async () => {
    if (!name.trim()) return showWarningToast("الرجاء إدخال اسم الوحدة");
    if (!address.trim()) return showWarningToast("الرجاء إدخال العنوان");
    if (!phone.trim()) return showWarningToast("الرجاء إدخال رقم الهاتف");
    setIsSubmitting(true);
    try {
      const wilaya = WILAYAS.find((w) => w.code === wilayaCode)?.ar ?? "";
      await addCivil({ name: name.trim(), address: address.trim(), wilaya, wilaya_code: wilayaCode, phone: phone.trim(), type, is_24h, region: region.trim() || undefined });
      showSuccessToast("تم إضافة وحدة الحماية المدنية بنجاح!", { description: "سيتم مراجعتها قبل النشر" });
      navigate(-1);
    } catch (err) {
      if (err instanceof ConvexError) showErrorToast((err.data as { message: string }).message);
      else showErrorToast("حدث خطأ، يرجى المحاولة مجدداً");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-red-600 to-purple-600 pt-12 pb-5 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
        <ShieldCheck className="w-5 h-5 text-white" />
        <h1 className="text-white font-bold text-lg">إضافة وحدة حماية مدنية</h1>
      </div>
      <Unauthenticated>
        <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول للإضافة</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-5 space-y-4 pb-20">
          <TextInput label="اسم الوحدة" placeholder="وحدة الإسعاف المركزية" value={name} onChange={setName} />
          <ToggleChips
            label="النوع"
            options={CIVIL_TYPES}
            value={type}
            onChange={(v) => setType(v as CivilType)}
            colorFn={(v, active) => { const found = CIVIL_TYPES.find((t) => t.value === v); return active ? (found?.color ?? "") : "bg-card border border-border"; }}
          />
          <TextInput label="العنوان" placeholder="شارع، حي، مدينة" value={address} onChange={setAddress} />
          <WilayaSelect value={wilayaCode} onChange={setWilayaCode} />
          <TextInput label="رقم الهاتف" placeholder="14 أو رقم مباشر" value={phone} onChange={setPhone} type="tel" />
          <TextInput label="المنطقة / الحي (اختياري)" placeholder="حي الشعبة" value={region} onChange={setRegion} />
          <div className="bg-card rounded-2xl border border-border">
            <ToggleRow label="متاح 24 ساعة / 7 أيام" value={is_24h} onChange={setIs24h} />
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold bg-red-600 hover:bg-red-700">
            {isSubmitting ? "جاري الحفظ..." : "إضافة الوحدة"}
          </Button>
        </motion.div>
      </Authenticated>
    </div>
  );
}
