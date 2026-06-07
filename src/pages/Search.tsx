import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, ChevronDown, MapPin, Star, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useDebounce } from '../hooks/use-debounce';

type Doctor = {
  id: number;
  name: string;
  fee: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  is_verified: boolean;
  specialties?: { name_arabic: string };
  wilayas?: { name_arabic: string };
  baladiyas?: { name_arabic: string };
};

type Specialty = { id: number; name_arabic: string };

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    supabase.from('specialties').select('id, name_arabic').order('name_arabic').then(({ data }) => {
      if (data) setSpecialties(data);
    });
  }, []);

  useEffect(() => {
    const doSearch = async () => {
      if (!debounced && !selectedSpec) {
        setDoctors([]);
        return;
      }
      setLoading(true);
      let q = supabase
        .from('doctors')
        .select('*, specialties(name_arabic), wilayas(name_arabic), baladiyas(name_arabic)')
        .order('rating', { ascending: false });

      if (debounced) q = q.ilike('name', `%${debounced}%`);
      if (selectedSpec) q = q.eq('specialty_id', selectedSpec);

      const { data } = await q.limit(20);
      setDoctors((data as Doctor[]) || []);
      setLoading(false);
    };
    doSearch();
  }, [debounced, selectedSpec]);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <div className="bg-[#0a1628] px-4 pt-12 pb-4 sticky top-0 z-30">
        <h1 className="text-white font-bold text-xl mb-4">البحث</h1>
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="ابحث عن طبيب، تخصص، دولة..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${showFilters ? 'bg-cyan-500' : 'bg-[#0d1b2a] border border-white/10'}`}
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSpec(null)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${!selectedSpec ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-transparent text-gray-400 border-gray-700'}`}
            >
              الكل
            </button>
            {specialties.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSpec(selectedSpec === s.id ? null : s.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${selectedSpec === s.id ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-transparent text-gray-400 border-gray-700'}`}
              >
                {s.name_arabic}
              </button>
            ))}
          </div>
        )}

        {(debounced || selectedSpec) && !loading && (
          <p className="text-gray-500 text-xs mt-2">نتائج البحث ({doctors.length})</p>
        )}
      </div>

      <div className="px-4 py-3 space-y-3">
        {!debounced && !selectedSpec ? (
          <div className="py-8">
            <p className="text-gray-500 text-sm text-center mb-4">التخصصات الشائعة</p>
            <div className="grid grid-cols-2 gap-2">
              {specialties.slice(0, 8).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSpec(s.id)}
                  className="flex items-center gap-3 bg-[#0d1b2a] border border-white/10 rounded-xl px-4 py-3 text-right"
                >
                  <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center text-lg">🩺</div>
                  <span className="text-gray-300 text-sm">{s.name_arabic}</span>
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد نتائج</p>
          </div>
        ) : (
          doctors.map(doc => (
            <button
              key={doc.id}
              onClick={() => navigate(`/doctors/${doc.id}`)}
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-2xl p-4 flex gap-3 hover:border-cyan-500/30 transition-all text-right"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={doc.image_url || 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover"
                />
                {doc.is_verified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{doc.name}</p>
                <p className="text-cyan-400 text-xs mt-0.5">{(doc as any).specialties?.name_arabic}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-400 text-xs">{(doc as any).baladiyas?.name_arabic} - {(doc as any).wilayas?.name_arabic}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs">{doc.rating}</span>
                    <span className="text-gray-500 text-xs">({doc.reviews_count})</span>
                  </div>
                  <span className="text-cyan-400 text-xs">{doc.fee} دج</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
