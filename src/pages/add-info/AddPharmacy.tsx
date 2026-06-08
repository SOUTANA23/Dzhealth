import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { WILAYAS } from "@/lib/data.ts";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast.ts";
import { TextInput, WilayaSelect, ToggleRow } from "./_components/form-fields.tsx";

export default function AddPharmacy() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [wilayaCode, setWilayaCode] = useState("23");
  const [phone, setPhone] = useState("");
  const [on_call_24h, setOnCall24h] = useState(false);
  const [night_shift, setNightShift] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addPharmacy = useMutation(api.facilities.addPharmacy);

  const handleSubmit = async () => {
    if (!name.trim()) return showWarningToast("الرجاء إدخال اسم الصيدلية");
    if (!address.trim()) return showWarningToast("الرجاء إدخال العنوان");
    if (!phone.trim()) return showWarningToast("الرجاء إدخال رقم الهاتف");
    setIsSubmitting(true);
    try {
      const wilaya = WILAYAS.find((w) => w.code === wilayaCode)?.ar ?? "";
      await addPharmacy({ name: name.trim(), address: address.trim(), wilaya, wilaya_code: wilayaCode, phone: phone.trim(), on_call_24h, night_shift });
      showSuccessToast("تم إضافة الصيدلية بنجاح!", { description: "سيتم مراجعتها قبل النشر" });
      navigate(-1);
    } catch (err) {
      if (err instanceof ConvexError) showErrorToast((err.data as { message: string }).message);
      else showErrorToast("حدث خطأ، يرجى المحاولة مجدداً");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-green-600 to-green-400 pt-12 pb-5 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
        <ShoppingBag className="w-5 h-5 text-white" />
        <h1 className="text-white font-bold text-lg">إضافة صيدلية</h1>
      </div>
      <Unauthenticated>
        <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول لإضافة صيدلية</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-5 space-y-4 pb-20">
          <TextInput label="اسم الصيدلية" placeholder="صيدلية الأمل" value={name} onChange={setName} />
          <TextInput label="العنوان" placeholder="شارع، حي، مدينة" value={address} onChange={setAddress} />
          <WilayaSelect value={wilayaCode} onChange={setWilayaCode} />
          <TextInput label="رقم الهاتف" placeholder="038 XX XX XX" value={phone} onChange={setPhone} type="tel" />
          <div className="bg-card rounded-2xl border border-border divide-y divide-border">
            <ToggleRow label="متاح 24 ساعة / 7 أيام" value={on_call_24h} onChange={setOnCall24h} />
            <ToggleRow label="خدمة الليل" value={night_shift} onChange={setNightShift} />
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold bg-green-600 hover:bg-green-700">
            {isSubmitting ? "جاري الحفظ..." : "إضافة الصيدلية"}
          </Button>
        </motion.div>
      </Authenticated>
    </div>
  );
}
