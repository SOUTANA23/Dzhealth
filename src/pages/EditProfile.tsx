import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Check, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/use-auth';
import { BLOOD_TYPES } from '../lib/utils';
import type { Baladiya } from '../context/AppContext';

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, wilayas, getBaladiyas, refreshProfile } = useApp();
  const { user } = useAuth();

  const [name,      setName]      = useState('');
  const [phone,     setPhone]     = useState('');
  const [wilayaId,  setWilayaId]  = useState<number | null>(null);
  const [baladiyaId, setBaladiyaId] = useState<number | null>(null);
  const [bloodType, setBloodType] = useState('');
  const [baladiyas, setBaladiyas] = useState<Baladiya[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  /* ── Prefill from profile ── */
  useEffect(() => {
    if (!profile) return;
    setName(profile.full_name || '');
    setPhone(profile.phone || '');
    setWilayaId(profile.wilaya_id || null);
    setBloodType(profile.blood_type || '');
  }, [profile]);

  /* ── Load baladiyas when wilaya changes ── */
  useEffect(() => {
    if (!wilayaId) { setBaladiyas([]); setBaladiyaId(null); return; }
    getBaladiyas(wilayaId).then(data => {
      setBaladiyas(data);
      // keep existing baladiya only if it belongs to new wilaya
      setBaladiyaId(prev =>
        data.some(b => b.id === prev) ? prev : null
      );
    });
  }, [wilayaId, getBaladiyas]);

  /* ── prefill baladiya once baladiyas loaded ── */
  useEffect(() => {
    if (profile?.wilaya_id === wilayaId && baladiyas.length > 0) {
      // baladiya_id is not in Profile type yet — read directly from DB once
      supabase
        .from('profiles')
        .select('baladiya_id')
        .eq('id', user?.id ?? '')
        .maybeSingle()
        .then(({ data }) => {
          if (data?.baladiya_id) setBaladiyaId(data.baladiya_id);
        });
    }
  // run once when baladiyas first populate
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baladiyas.length]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name:   name.trim(),
        phone:       phone.trim(),
        wilaya_id:   wilayaId  ?? null,
        baladiya_id: baladiyaId ?? null,
        blood_type:  bloodType || null,
        updated_at:  new Date().toISOString(),
      }, { onConflict: 'id' });

    setLoading(false);

    if (error) {
      showToast('حدث خطأ أثناء الحفظ', false);
    } else {
      await refreshProfile();
      showToast('تم حفظ التغييرات بنجاح', true);
      setTimeout(() => navigate(-1), 1200);
    }
  };

  /* ── Avatar initial ── */
  const initial = name ? name.trim()[0]?.toUpperCase() : (user?.email?.[0]?.toUpperCase() ?? 'U');

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-10 theme-transition">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-[var(--bg-header)] border-b border-[var(--border)]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-[var(--bg-item)] rounded-xl flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5 text-[var(--text-1)] rtl:rotate-180" />
        </button>
        <h1 className="text-[var(--text-1)] font-bold text-lg">تعديل الملف الشخصي</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/40 rounded-xl flex items-center justify-center disabled:opacity-50"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            : <Check className="w-5 h-5 text-cyan-400" />
          }
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mx-4 mt-3 rounded-xl px-4 py-3 text-sm text-center border ${
          toast.ok
            ? 'bg-green-500/15 border-green-500/30 text-green-400'
            : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="px-4 mt-6 space-y-5">

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-cyan-500/25">
              {initial}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Full name */}
        <Field label="الاسم الكامل">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className="input-field"
          />
        </Field>

        {/* Email — read-only */}
        <Field label="البريد الإلكتروني">
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="input-field opacity-50 cursor-not-allowed"
          />
        </Field>

        {/* Phone */}
        <Field label="رقم الهاتف">
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0778185043"
            className="input-field"
          />
        </Field>

        {/* Wilaya */}
        <Field label="الولاية">
          <div className="relative">
            <select
              value={wilayaId || ''}
              onChange={e => setWilayaId(e.target.value ? Number(e.target.value) : null)}
              className="input-field appearance-none pr-4 pl-10"
            >
              <option value="">اختر الولاية</option>
              {wilayas.map(w => (
                <option key={w.id} value={w.id}>{w.name_arabic}</option>
              ))}
            </select>
            <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[var(--text-3)] pointer-events-none" />
          </div>
        </Field>

        {/* Baladiya */}
        {baladiyas.length > 0 && (
          <Field label="البلدية">
            <div className="relative">
              <select
                value={baladiyaId || ''}
                onChange={e => setBaladiyaId(e.target.value ? Number(e.target.value) : null)}
                className="input-field appearance-none pr-4 pl-10"
              >
                <option value="">اختر البلدية</option>
                {baladiyas.map(b => (
                  <option key={b.id} value={b.id}>{b.name_arabic}</option>
                ))}
              </select>
              <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[var(--text-3)] pointer-events-none" />
            </div>
          </Field>
        )}

        {/* Blood type */}
        <Field label="فصيلة الدم">
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_TYPES.map(bt => (
              <button
                key={bt}
                onClick={() => setBloodType(prev => prev === bt ? '' : bt)}
                className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                  bloodType === bt
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                    : 'bg-[var(--bg-item)] border border-[var(--border)] text-[var(--text-2)] hover:border-red-500/40'
                }`}
              >
                {bt}
              </button>
            ))}
          </div>
        </Field>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold text-base shadow-lg shadow-cyan-500/20 disabled:opacity-60 transition-opacity"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  );
}

/* ── Tiny reusable field wrapper ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[var(--text-2)] text-xs mb-1.5 block font-medium">{label}</label>
      {children}
    </div>
  );
}
