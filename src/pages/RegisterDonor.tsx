import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import { BLOOD_TYPES } from '../lib/utils';

type Wilaya = { id: number; name_arabic: string };
type Baladiya = { id: number; wilaya_id: number; name_arabic: string };

export default function RegisterDonor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bloodType, setBloodType] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState<number | null>(null);
  const [selectedBaladiya, setSelectedBaladiya] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [hideName, setHideName] = useState(false);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [baladiyas, setBaladiyas] = useState<Baladiya[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('wilayas').select('id, name_arabic').order('name_arabic').then(({ data }) => {
      if (data) setWilayas(data);
    });
  }, []);

  useEffect(() => {
    if (selectedWilaya) {
      supabase.from('baladiyas').select('id, wilaya_id, name_arabic')
        .eq('wilaya_id', selectedWilaya)
        .then(({ data }) => {
          if (data) setBaladiyas(data);
        });
    }
  }, [selectedWilaya]);

  const handleSubmit = async () => {
    if (!bloodType || !phone) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('blood_donors').insert({
      user_id: user?.id,
      name: user?.user_metadata?.full_name || 'متبرع',
      blood_type: bloodType,
      wilaya_id: selectedWilaya,
      baladiya_id: selectedBaladiya,
      phone,
      is_available: isAvailable,
      hide_name: hideName,
    });
    setLoading(false);
    if (!error) {
      navigate('/donors');
    } else {
      setError('حدث خطأ، حاول مجدداً');
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] pb-8">
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-[#0a1628]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-white rtl:rotate-180" />
        </button>
        <h1 className="text-white font-bold text-lg">سجل كمتبرع</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 mt-6 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        {/* Blood type */}
        <div>
          <label className="text-gray-400 text-sm mb-3 block">فصيلة الدم *</label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_TYPES.map(bt => (
              <button
                key={bt}
                onClick={() => setBloodType(bt)}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  bloodType === bt
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-[#0d1b2a] border border-white/10 text-gray-400'
                }`}
              >
                {bt}
              </button>
            ))}
          </div>
        </div>

        {/* Wilaya */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">الولاية</label>
          <select
            value={selectedWilaya || ''}
            onChange={e => setSelectedWilaya(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-red-500/40"
          >
            <option value="">اختر الولاية</option>
            {wilayas.map(w => <option key={w.id} value={w.id}>{w.name_arabic}</option>)}
          </select>
        </div>

        {/* Baladiya */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">البلدية</label>
          <select
            value={selectedBaladiya || ''}
            onChange={e => setSelectedBaladiya(e.target.value ? Number(e.target.value) : null)}
            disabled={!selectedWilaya}
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-red-500/40 disabled:opacity-50"
          >
            <option value="">اختر البلدية</option>
            {baladiyas.map(b => <option key={b.id} value={b.id}>{b.name_arabic}</option>)}
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">رقم الهاتف *</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0778185043"
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-red-500/40"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { label: 'متاح للتبرع الآن', sub: 'يمكن الاتصال بي في الحالات الطارئة', value: isAvailable, set: setIsAvailable },
            { label: 'إخفاء الاسم', sub: 'سيظهر اسمك كـ "متبرع مجهول"', value: hideName, set: setHideName },
          ].map(({ label, sub, value, set }) => (
            <div key={label} className="flex items-center justify-between bg-[#0d1b2a] border border-white/10 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
              </div>
              <button
                onClick={() => set((v: boolean) => !v)}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${value ? 'bg-red-600' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all duration-200 ${value ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-white font-bold text-base disabled:opacity-60 shadow-lg shadow-red-600/20"
        >
          {loading ? 'جاري التسجيل...' : 'تسجيل'}
        </button>
      </div>
    </div>
  );
}
