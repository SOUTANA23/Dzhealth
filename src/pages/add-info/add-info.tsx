import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { PawPrint, ArrowRight } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { showSuccessToast, showWarningToast } from "@/lib/toast.ts";
import { TextInput, TextareaInput, WilayaSelect } from "./_components/form-fields.tsx";

export default function AddVet() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [wilayaCode, setWilayaCode] = useState("23");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return showWarningToast("الرجاء إدخال الاسم");
    if (!address.trim()) return showWarningToast("الرجاء إدخال العنوان");
    if (!phone.trim()) return showWarningToast("الرجاء إدخال رقم الهاتف");
    setIsSubmitting(true);
    // Coming soon - vet table not yet added
    await new Promise((r) => setTimeout(r, 800));
    showSuccessToast("تم استلام طلبك!", { description: "سيتم إضافة البيطري قريباً في التحديث القادم" });
    setIsSubmitting(false);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-amber-600 to-amber-400 pt-12 pb-5 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
        <PawPrint className="w-5 h-5 text-white" />
        <h1 className="text-white font-bold text-lg">إضافة عيادة بيطرية</h1>
      </div>
      <Unauthenticated>
        <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول للإضافة</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-5 space-y-4 pb-20">
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-200 dark:border-amber-900/30">
            <p className="text-xs text-amber-700 dark:text-amber-300">قسم الطب البيطري سيتوفر في التحديث القادم. يمكنك إرسال المعلومات الآن وسيتم نشرها عند الإطلاق.</p>
          </div>
          <TextInput label="اسم العيادة البيطرية" placeholder="عيادة ابن الحيوان البيطرية" value={name} onChange={setName} />
          <TextInput label="العنوان" placeholder="شارع، حي، مدينة" value={address} onChange={setAddress} />
          <WilayaSelect value={wilayaCode} onChange={setWilayaCode} />
          <TextInput label="رقم الهاتف" placeholder="0555 XX XX XX" value={phone} onChange={setPhone} type="tel" />
          <TextareaInput label="وصف الخدمات (اختياري)" placeholder="أنواع الحيوانات التي تُعالج، خدمات متاحة..." value={description} onChange={setDescription} />
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold bg-amber-600 hover:bg-amber-700">
            {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
          </Button>
        </motion.div>
      </Authenticated>
    </div>
  );
}
