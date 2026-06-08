import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FilterChip } from '../components/FilterChip';
import { NeonCard } from '../components/NeonCard';

type Equipment = {
  id: number;
  equipment_type: string;
  condition: string;
  phone: string;
  description: string;
  is_available: boolean;
  wilayas?: { name_arabic: string };
  baladiyas?: { name_arabic: string };
};

const TYPES = ['الكل', 'كرسي متحرك', 'عكاز', 'سرير طبي', 'جهاز أكسجين', 'أطراف اصطناعية', 'أخرى'];

const CONDITION_COLORS: Record<string, string> = {
  'جديد': 'text-green-400',
  'مشابه للجديد': 'text-cyan-400',
  'جيدة': 'text-blue-400',
  'مقبولة': 'text-yellow-400',
};

export default function Equipment() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Equipment[]>([]);
  const [filter, setFilter] = useState('الكل');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase
        .from('equipment_donors')
        .select('*, wilayas(name_arabic), baladiyas(name_arabic)')
        .order('created_at', { ascending: false });

      if (filter !== 'الكل') q = q.eq('equipment_type', filter);

      const { data } = await q;
      setItems((data as Equipment[]) || []);
      setLoading(false);
    };
    fetch();
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <div className="bg-gradient-to-b from-green-900/40 to-[#060d1a] px-4 pt-12 pb-4">
        <h1 className="text-white font-bold text-xl mb-1">المعدات الطبية</h1>
        <p className="text-gray-400 text-sm mb-4">
          {items.length} {filter !== 'الكل' ? filter : 'معدة'} متاح
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TYPES.map(t => (
            <FilterChip key={t} label={t} active={filter === t} onClick={() => setFilter(t)} color="green" />
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد نتائج</p>
          </div>
        ) : (
          items.map(item => (
            <NeonCard key={item.id} color="green" className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 ${item.is_available ? 'text-green-400' : 'text-gray-500'}`}>
                      {item.is_available ? 'متاح' : 'غير متاح'}
                    </span>
                    <span className={`text-xs ${CONDITION_COLORS[item.condition] || 'text-gray-400'}`}>
                      {item.condition}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">{item.equipment_type}</h3>
                  {item.description && (
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400 text-xs">
                      {(item as any).baladiyas?.name_arabic} - {(item as any).wilayas?.name_arabic}
                    </span>
                  </div>
                  {item.phone && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500 text-xs">{item.phone}</span>
                    </div>
                  )}
                </div>
                {item.phone && (
                  <a href={`tel:${item.phone}`} className="w-10 h-10 bg-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-400" />
                  </a>
                )}
              </div>
            </NeonCard>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/add-equipment')}
        className="fixed bottom-24 left-4 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 z-40"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}
