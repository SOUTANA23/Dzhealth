import { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FilterChip } from '../components/FilterChip';
import { NeonCard } from '../components/NeonCard';

type Pharmacy = {
  id: number;
  name: string;
  address: string;
  phone: string;
  on_call_24h: boolean;
  night_shift: boolean;
  wilayas?: { name_arabic: string };
  baladiyas?: { name_arabic: string };
};

const FILTERS = ['الكل', 'مفتوح 24/24', 'مناوبة الليل'];

export default function Pharmacies() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filter, setFilter] = useState('الكل');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase
        .from('pharmacies')
        .select('*, wilayas(name_arabic), baladiyas(name_arabic)')
        .order('on_call_24h', { ascending: false });

      if (filter === 'مفتوح 24/24') q = q.eq('on_call_24h', true);
      if (filter === 'مناوبة الليل') q = q.eq('night_shift', true);

      const { data } = await q;
      setPharmacies((data as Pharmacy[]) || []);
      setLoading(false);
    };
    fetch();
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <div className="bg-gradient-to-b from-[#0a1a20] to-[#060d1a] px-4 pt-12 pb-4">
        <h1 className="text-white font-bold text-xl mb-1">الصيدليات</h1>
        <p className="text-gray-400 text-sm mb-4">{pharmacies.length} صيدلية قريبة منك</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map(f => (
            <FilterChip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} color="cyan" />
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : pharmacies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد صيدليات</p>
          </div>
        ) : (
          pharmacies.map(ph => (
            <NeonCard key={ph.id} color="cyan" className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {ph.on_call_24h && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full">
                        مفتوح 24/24
                      </span>
                    )}
                    {ph.night_shift && (
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full">
                        مناوبة الليل
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm">{ph.name}</h3>
                  {ph.address && (
                    <p className="text-gray-400 text-xs mt-0.5">{ph.address}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">
                      {(ph as any).baladiyas?.name_arabic} - {(ph as any).wilayas?.name_arabic}
                    </span>
                  </div>
                  {ph.phone && <p className="text-gray-500 text-xs mt-0.5">{ph.phone}</p>}
                </div>
                {ph.phone && (
                  <a href={`tel:${ph.phone}`} className="w-10 h-10 bg-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-400" />
                  </a>
                )}
              </div>
            </NeonCard>
          ))
        )}
      </div>
    </div>
  );
}
