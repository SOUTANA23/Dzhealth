import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Building2, Stethoscope, Cat, Pill, Shield, Leaf } from 'lucide-react';

const INFO_TYPES = [
  {
    icon: Building2,
    label: 'مستشفى',
    desc: 'أضف مستشفى جديد',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Stethoscope,
    label: 'طبيب',
    desc: 'أضف طبيباً جديداً',
    color: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Cat,
    label: 'طب بيطري',
    desc: 'أضف عيادة بيطرية',
    color: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/30',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: Pill,
    label: 'صيدلية',
    desc: 'أضف صيدلية جديدة',
    color: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/30',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
  },
  {
    icon: Shield,
    label: 'حماية مدنية',
    desc: 'أضف محطة حماية مدنية',
    color: 'from-red-500/20 to-red-600/10',
    border: 'border-red-500/30',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
  },
  {
    icon: Leaf,
    label: 'طب بديل',
    desc: 'أضف عيادة طب طبيعي',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
];

export default function AddInfo() {
  const navigate = useNavigate();

  const handleSelect = (label: string) => {
    alert(`سيتم فتح نموذج إضافة ${label} قريباً`);
  };

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <div className="bg-[#0a1628] px-4 pt-12 pb-4">
        <h1 className="text-white font-bold text-xl">إضافة معلومات</h1>
        <p className="text-gray-400 text-sm mt-1">ساهم في إثراء قاعدة البيانات</p>
      </div>

      <div className="px-4 mt-4">
        {/* Warning */}
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-5">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300 text-sm leading-relaxed">
            تأكد من صحة المعلومات قبل الإرسال. ستخضع جميع المعلومات المضافة للمراجعة قبل النشر.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3">
          {INFO_TYPES.map(({ icon: Icon, label, desc, color, border, iconBg, iconColor }) => (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              className={`flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-b ${color} border ${border} text-right transition-transform duration-150 active:scale-95`}
            >
              <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
