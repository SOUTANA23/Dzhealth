import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Stethoscope, ArrowRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { WILAYAS, SPECIALTIES_AR } from "@/lib/data.ts";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast.ts";
import { TextInput, TextareaInput, WilayaSelect, FormField } from "./_components/form-fields.tsx";
import { cn } from "@/lib/utils.ts";

export default function AddDoctor() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES_AR[0]);
  const [address, setAddress] = useState("");
  const [wilayaCode, setWilayaCode] = useState("23");
  const [phone, setPhone] = useState("");
  const [fee, setFee] = useState("");
  const [about, setAbout] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addDoctor = useMutation(api.doctors.addDoctor);

  const handleSubmit = async () => {
    if (!name.trim()) return showWarningToast("الرجاء إدخال اسم الطبيب");
    if (!address.trim()) return showWarningToast("الرجاء إدخال العنوان");
    if (!phone.trim()) return showWarningToast("الرجاء إدخال رقم الهاتف");
    setIsSubmitting(true);
    try {
      const wilaya = WILAYAS.find((w) => w.code === wilayaCode)?.ar ?? "";
      await addDoctor({ name: name.trim(), specialty, wilaya, wilaya_code: wilayaCode, address: address.trim(), phone: phone.trim(), fee: fee ? Number(fee) : 0, about: about.trim() || undefined });
      showSuccessToast("تم إضافة الطبيب بنجاح!", { description: "سيتم مراجعته قبل النشر" });
      navigate(-1);
    } catch (err) {
      if (err instanceof ConvexError) showErrorToast((err.data as { message: string }).message);
      else showErrorToast("حدث خطأ، يرجى المحاولة مجدداً");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-gradient-to-br from-teal-600 to-teal-400 pt-12 pb-5 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="cursor-pointer w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
        <Stethoscope className="w-5 h-5 text-white" />
        <h1 className="text-white font-bold text-lg">إضافة طبيب</h1>
      </div>
      <Unauthenticated>
        <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
          <p className="text-muted-foreground text-sm">يجب تسجيل الدخول لإضافة طبيب</p>
          <SignInButton />
        </div>
      </Unauthenticated>
      <Authenticated>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-5 space-y-4 pb-20">
          <TextInput label="اسم الطبيب" placeholder="د. محمد بن علي" value={name} onChange={setName} />
          <FormField label="التخصص">
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
              className="w-full h-12 rounded-xl border border-border bg-card text-sm px-3 outline-none text-foreground cursor-pointer">
              {SPECIALTIES_AR.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <TextInput label="العنوان" placeholder="شارع، حي، مدينة" value={address} onChange={setAddress} />
          <WilayaSelect value={wilayaCode} onChange={setWilayaCode} />
          <TextInput label="رقم الهاتف" placeholder="0555 XX XX XX" value={phone} onChange={setPhone} type="tel" />
          <TextInput label="سعر الكشف (دج)" placeholder="2000" value={fee} onChange={setFee} type="number" />
          <TextareaInput label="نبذة عن الطبيب (اختياري)" placeholder="تخصصات وخبرات الطبيب..." value={about} onChange={setAbout} />
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold bg-teal-600 hover:bg-teal-700">
            {isSubmitting ? "جاري الحفظ..." : "إضافة الطبيب"}
          </Button>
        </motion.div>
      </Authenticated>
    </div>
  );
}
