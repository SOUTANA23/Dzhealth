import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { BLOOD_TYPES } from '../lib/utils';

type Wilaya = { id: number; name_arabic: string };

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [selectedWilaya, setSelectedWilaya] = useState<number | null>(profile?.wilaya_id || null);
  const [bloodType, setBloodType] = useState(profile?.blood_type || '');
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    supabase.from('wilayas').select('id, name_arabic').order('name_arabic').then(({ data }) => {
      if (data) setWilayas(data);
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setPhone(profile.phone || '');
      setSelectedWilaya(profile.wilaya_id || null);
      setBloodType(profile.blood_type || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile({
      full_name: name,
      phone,
      wilaya_id: selectedWilaya || undefined,
      blood_type: bloodType || undefined,
    });
    setLoading(false);
    if (!error) {
      setToast('تم حفظ التغييرات بنجاح');
      setTimeout(() => { setToast(''); navigate(-1); }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-[#0a1628]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-white rtl:rotate-180" />
        </button>
        <h1 className="text-white font-bold text-lg">تعديل الملف الشخصي</h1>
        <div className="w-10" />
      </div>

      {toast && (
        <div className="mx-4 mt-3 bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm text-center">
          {toast}
        </div>
      )}

      <div className="px-4 mt-6 space-y-5">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-cyan-500/30">
              {name ? name[0]?.toUpperCase() : 'S'}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">البريد الإلكتروني</label>
            <input
              type="email"
              disabled
              placeholder="example@mail.com"
              className="w-full bg-[#0d1b2a]/50 border border-white/5 rounded-xl py-3.5 px-4 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0778185043"
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          {/* Wilaya */}
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">اختر الولاية</label>
            <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto">
              {wilayas.slice(0, 12).map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWilaya(w.id)}
                  className={`py-2 px-3 rounded-xl text-xs transition-all ${
                    selectedWilaya === w.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-[#0d1b2a] border border-white/10 text-gray-400'
                  }`}
                >
                  {w.name_arabic}
                </button>
              ))}
            </div>
          </div>

          {/* Blood type */}
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">فصيلة الدم</label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map(bt => (
                <button
                  key={bt}
                  onClick={() => setBloodType(bt)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    bloodType === bt
                      ? 'bg-red-600 text-white'
                      : 'bg-[#0d1b2a] border border-white/10 text-gray-400'
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold text-base disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  );
}
