import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Leaf, ArrowRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { WILAYAS } from "@/lib/data.ts";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast.ts";
import { TextInput, TextareaInput, WilayaSelect, ToggleChips } from "./_components/form-fields.tsx";

type HerbalSpecialty = "herbs" | "cupping" | "honey" | "ruqya" | "acupuncture" | "general";

const SPECIALTIES: { value: HerbalSpecialty; label: string; color: string }[] = [
  { value: "herbs", label: "أعشاب طبية", color: "bg-green-600 text-white" },
  { value: "cupping", label: "حجامة", color: "bg-red-500 text-white" },
  { value: "honey", label: "عسل", color: "bg-amber-500 text-white" },
  { value: "ruqya", label: "رقية شرعية", color: "bg-indigo-600 text-white" },
  { value: "acupuncture", label: "وخز بالإبر", color: "bg-teal-600 text-white" },
  { value: "general", label: "عام", color: "bg-lime-600 text-white" },
];

export default function AddHerbal() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState<HerbalSpecialty>("herbs");
  const [address, setAddress] = useState("");
  const [wilayaCode, setWilayaCode] = useState("23");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addHerbal = useMutation(api.herbal.add);

  const handleSubmit = async () => {
    if (!name.trim()) return showWarningToast("الرجاء إدخال الاسم");
    if (!address.trim()) return showWarningToast("الرجاء إدخال العنوان");
    if (!phone.trim()) return showWarningToast("الرجاء إدخال رقم الهاتف");
    setIsSubmitting(true);
    try {
      const wilaya = WILAYAS.find((w) => w.code === wilayaCode)?.ar ?? "";
      await addHerbal({ name: name.trim(), specialty, wilaya, wilaya_code: wilayaCode, phone: phone.trim(), address: address.trim(), description: description.trim() || undefined });
      showSuccessToast("تم إضافة ممارس الطب البديل بنجاح!", { description: "سيتم مراجعته قبل النشر" });
      navigate(-1);
    } catch (err) {
      if (err instanceof ConvexError) showErrorToast((err.data as { message: string }).message);
      else showErrorToast("حدث خطأ، يرجى المحاولة مجدداً");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-lime-700 to-green-500 pt-12 pb-5 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
        <Leaf className="w-5 h-5 text-white" />
        <h1 className="text-white font-bold text-lg">إضافة ممارس طب بديل</h1>
      </div>
      <Unauthenticated>
        <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول للإضافة</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-5 space-y-4 pb-20">
          <TextInput label="الاسم أو اسم المركز" placeholder="مركز الأعشاب الطبية" value={name} onChange={setName} />
          <ToggleChips
            label="التخصص"
            options={SPECIALTIES}
            value={specialty}
            onChange={(v) => setSpecialty(v as HerbalSpecialty)}
            colorFn={(v, active) => { const found = SPECIALTIES.find((s) => s.value === v); return active ? (found?.color ?? "") : "bg-card border border-border"; }}
          />
          <TextInput label="العنوان" placeholder="شارع، حي، مدينة" value={address} onChange={setAddress} />
          <WilayaSelect value={wilayaCode} onChange={setWilayaCode} />
          <TextInput label="رقم الهاتف" placeholder="0555 XX XX XX" value={phone} onChange={setPhone} type="tel" />
          <TextareaInput label="وصف (اختياري)" placeholder="نبذة عن الخدمات المقدمة..." value={description} onChange={setDescription} />
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold bg-lime-600 hover:bg-lime-700">
            {isSubmitting ? "جاري الحفظ..." : "إضافة الممارس"}
          </Button>
        </motion.div>
      </Authenticated>
    </div>
  );
}
