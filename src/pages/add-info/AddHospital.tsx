import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Building2, ArrowRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { WILAYAS } from "@/lib/data.ts";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast.ts";
import { TextInput, TextareaInput, WilayaSelect, ToggleChips, ToggleRow } from "./_components/form-fields.tsx";
import { cn } from "@/lib/utils.ts";

const HOSPITAL_SERVICES = ["طوارئ", "جراحة", "طب الأطفال", "نساء وتوليد", "طب القلب", "أمراض الدم", "أشعة", "مختبر", "طب الأسنان", "طب العيون", "أمراض الكلى", "علاج السرطان"];

export default function AddHospital() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [wilayaCode, setWilayaCode] = useState("23");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"public" | "private">("public");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addHospital = useMutation(api.facilities.addHospital);

  const toggleService = (s: string) =>
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const handleSubmit = async () => {
    if (!name.trim()) return showWarningToast("الرجاء إدخال اسم المستشفى");
    if (!address.trim()) return showWarningToast("الرجاء إدخال العنوان");
    if (!phone.trim()) return showWarningToast("الرجاء إدخال رقم الهاتف");
    setIsSubmitting(true);
    try {
      const wilaya = WILAYAS.find((w) => w.code === wilayaCode)?.ar ?? "";
      await addHospital({ name: name.trim(), address: address.trim(), wilaya, wilaya_code: wilayaCode, phone: phone.trim(), type, services: selectedServices.length > 0 ? selectedServices : undefined });
      showSuccessToast("تم إضافة المستشفى بنجاح!", { description: "سيتم مراجعته قبل النشر" });
      navigate(-1);
    } catch (err) {
      if (err instanceof ConvexError) showErrorToast((err.data as { message: string }).message);
      else showErrorToast("حدث خطأ، يرجى المحاولة مجدداً");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 pt-12 pb-5 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
        <Building2 className="w-5 h-5 text-white" />
        <h1 className="text-white font-bold text-lg">إضافة مستشفى</h1>
      </div>
      <Unauthenticated>
        <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول لإضافة مستشفى</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-5 space-y-4 pb-20">
          <TextInput label="اسم المستشفى" placeholder="مستشفى ابن سينا" value={name} onChange={setName} />
          <TextInput label="العنوان" placeholder="شارع، حي، مدينة" value={address} onChange={setAddress} />
          <WilayaSelect value={wilayaCode} onChange={setWilayaCode} />
          <TextInput label="رقم الهاتف" placeholder="038 XX XX XX" value={phone} onChange={setPhone} type="tel" />
          <ToggleChips
            label="النوع"
            options={[{ value: "public", label: "عمومي" }, { value: "private", label: "خاص" }]}
            value={type}
            onChange={(v) => setType(v as "public" | "private")}
            colorFn={(v, active) => active ? (v === "public" ? "bg-blue-500 text-white" : "bg-purple-500 text-white") : "bg-card border border-border"}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">الخدمات (اختياري)</p>
            <div className="flex flex-wrap gap-2">
              {HOSPITAL_SERVICES.map((s) => (
                <button key={s} type="button" onClick={() => toggleService(s)}
                  className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer", selectedServices.includes(s) ? "bg-blue-500 text-white" : "bg-card border border-border")}
                >{s}</button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "جاري الحفظ..." : "إضافة المستشفى"}
          </Button>
        </motion.div>
      </Authenticated>
    </div>
  );
}
