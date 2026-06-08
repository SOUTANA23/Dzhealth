import { useState, useEffect } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FilterChip } from '../components/FilterChip';
import { NeonCard } from '../components/NeonCard';

type Hospital = {
  id: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  services: string[];
  beds_count: number;
  wilayas?: { name_arabic: string };
  baladiyas?: { name_arabic: string };
};

const FILTERS = ['الكل', 'عام', 'خاص'];

const TYPE_LABELS: Record<string, string> = {
  public: 'مستشفى عام',
  private: 'مستشفى خاص',
};

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filter, setFilter] = useState('الكل');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase
        .from('hospitals')
        .select('*, wilayas(name_arabic), baladiyas(name_arabic)')
        .order('name');

      if (filter === 'عام') q = q.eq('type', 'public');
      if (filter === 'خاص') q = q.eq('type', 'private');

      const { data } = await q;
      setHospitals((data as Hospital[]) || []);
      setLoading(false);
    };
    fetch();
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <div className="bg-gradient-to-b from-blue-900/30 to-[#060d1a] px-4 pt-12 pb-4">
        <h1 className="text-white font-bold text-xl mb-1">المستشفيات</h1>
        <p className="text-gray-400 text-sm mb-4">{hospitals.length} مستشفى</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map(f => (
            <FilterChip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} color="blue" />
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : hospitals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد مستشفيات</p>
          </div>
        ) : (
          hospitals.map(h => (
            <NeonCard key={h.id} color="blue" className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      h.type === 'public'
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                        : 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                    }`}>
                      {TYPE_LABELS[h.type] || h.type}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">{h.name}</h3>
                  {h.address && <p className="text-gray-400 text-xs mt-0.5">{h.address}</p>}
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">
                      {(h as any).baladiyas?.name_arabic} - {(h as any).wilayas?.name_arabic}
                    </span>
                  </div>
                  {h.services && h.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {h.services.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400">{s}</span>
                      ))}
                      {h.services.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400">+{h.services.length - 3}</span>
                      )}
                    </div>
                  )}
                  {h.phone && <p className="text-gray-500 text-xs mt-1">{h.phone}</p>}
                </div>
                {h.phone && (
                  <a href={`tel:${h.phone}`} className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-400" />
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
