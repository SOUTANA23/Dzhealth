import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import { EQUIPMENT_TYPES, EQUIPMENT_CONDITIONS } from '../lib/utils';

type Wilaya = { id: number; name_arabic: string };
type Baladiya = { id: number; wilaya_id: number; name_arabic: string };

export default function AddEquipment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipType, setEquipType] = useState('');
  const [condition, setCondition] = useState('');
  const [wilayaId, setWilayaId] = useState<number | null>(null);
  const [baladiyaId, setBaladiyaId] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
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
    if (wilayaId) {
      supabase.from('baladiyas').select('id, wilaya_id, name_arabic').eq('wilaya_id', wilayaId).then(({ data }) => {
        if (data) setBaladiyas(data);
      });
    }
  }, [wilayaId]);

  const handleAdd = async () => {
    if (!equipType || !phone) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('equipment_donors').insert({
      user_id: user?.id,
      equipment_type: equipType,
      condition,
      wilaya_id: wilayaId,
      baladiya_id: baladiyaId,
      phone,
      description,
      is_available: true,
    });
    setLoading(false);
    if (!error) navigate('/equipment');
    else setError('حدث خطأ، حاول مجدداً');
  };

  return (
    <div className="min-h-screen bg-[#060d1a] pb-8">
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-[#0a1628]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-white rtl:rotate-180" />
        </button>
        <h1 className="text-white font-bold text-lg">تسجيل متبرع جديد</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 mt-6 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        {/* Equipment type */}
        <div>
          <label className="text-gray-400 text-sm mb-3 block">نوع المعدة *</label>
          <div className="grid grid-cols-3 gap-2">
            {EQUIPMENT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setEquipType(t)}
                className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                  equipType === t
                    ? 'bg-green-600 text-white'
                    : 'bg-[#0d1b2a] border border-white/10 text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="text-gray-400 text-sm mb-3 block">الحالة</label>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  condition === c
                    ? 'bg-green-600 text-white'
                    : 'bg-[#0d1b2a] border border-white/10 text-gray-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Wilaya */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">الولاية</label>
          <select
            value={wilayaId || ''}
            onChange={e => setWilayaId(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-green-500/40"
          >
            <option value="">اختر الولاية</option>
            {wilayas.map(w => <option key={w.id} value={w.id}>{w.name_arabic}</option>)}
          </select>
        </div>

        {/* Baladiya */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">البلدية</label>
          <select
            value={baladiyaId || ''}
            onChange={e => setBaladiyaId(e.target.value ? Number(e.target.value) : null)}
            disabled={!wilayaId}
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-green-500/40 disabled:opacity-50"
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
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-green-500/40"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">الوصف</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="وصف مختصر عن المعدة..."
            rows={3}
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-green-500/40 resize-none"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl text-white font-bold text-base disabled:opacity-60 shadow-lg shadow-green-600/20"
        >
          {loading ? 'جاري الإضافة...' : 'إضافة'}
        </button>
      </div>
    </div>
  );
}
