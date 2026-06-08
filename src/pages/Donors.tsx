import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, AlertTriangle, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FilterChip } from '../components/FilterChip';
import { NeonCard } from '../components/NeonCard';
import { BLOOD_TYPES, getBloodTypeColor } from '../lib/utils';

type Donor = {
  id: number;
  name: string;
  blood_type: string;
  phone: string;
  hide_name: boolean;
  is_available: boolean;
  wilayas?: { name_arabic: string };
  baladiyas?: { name_arabic: string };
};

export default function Donors() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filter, setFilter] = useState('الكل');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase
        .from('blood_donors')
        .select('*, wilayas(name_arabic), baladiyas(name_arabic)')
        .order('is_available', { ascending: false });

      if (filter !== 'الكل') q = q.eq('blood_type', filter);

      const { data } = await q;
      setDonors((data as Donor[]) || []);
      setLoading(false);
    };
    fetch();
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-[#060d1a] px-4 pt-12 pb-4">
        <h1 className="text-white font-bold text-xl mb-1">متبرعو الدم</h1>
        <p className="text-gray-400 text-sm mb-4">ابحث عن متبرعين حسب فصيلة الدم</p>

        {/* Emergency button */}
        <button className="w-full flex items-center gap-3 bg-red-600/20 border border-red-500/40 rounded-xl px-4 py-3 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div className="text-right flex-1">
            <p className="text-red-400 font-semibold text-sm">حالة طارئة</p>
            <p className="text-gray-400 text-xs">اضغط هنا في حالات الطوارئ</p>
          </div>
        </button>

        {/* Blood type filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FilterChip label="الكل" active={filter === 'الكل'} onClick={() => setFilter('الكل')} color="red" />
          {BLOOD_TYPES.map(bt => (
            <FilterChip key={bt} label={bt} active={filter === bt} onClick={() => setFilter(bt)} color="red" />
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : donors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد نتائج</p>
          </div>
        ) : (
          donors.map(donor => (
            <NeonCard key={donor.id} color="red" className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 ${getBloodTypeColor(donor.blood_type)} rounded-2xl flex items-center justify-center font-bold text-white text-base flex-shrink-0`}>
                  {donor.blood_type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${donor.is_available ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span className={`text-xs ${donor.is_available ? 'text-green-400' : 'text-gray-500'}`}>
                      {donor.is_available ? 'متاح الآن' : 'غير متاح'}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm truncate">
                    {donor.hide_name ? 'متبرع مجهول' : donor.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">
                      {(donor as any).baladiyas?.name_arabic} - {(donor as any).wilayas?.name_arabic}
                    </span>
                  </div>
                  {donor.phone && <p className="text-gray-500 text-xs mt-0.5">{donor.phone}</p>}
                </div>
                {donor.phone && (
                  <a href={`tel:${donor.phone}`} className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            </NeonCard>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/register-donor')}
        className="fixed bottom-24 left-4 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 z-40"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}
