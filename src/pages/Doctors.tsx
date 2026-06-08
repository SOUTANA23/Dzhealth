import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Phone, Shield, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useDebounce } from '../hooks/use-debounce';
import { NeonCard } from '../components/NeonCard';

type Doctor = {
  id: number;
  name: string;
  fee: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  is_verified: boolean;
  lat: number;
  lng: number;
  phone: string;
  specialties?: { name_arabic: string };
  wilayas?: { name_arabic: string };
  baladiyas?: { name_arabic: string };
};

type Specialty = { id: number; name_arabic: string };
type Wilaya = { id: number; name_arabic: string };

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const load = async () => {
      const [specRes, wilRes] = await Promise.all([
        supabase.from('specialties').select('id, name_arabic').order('name_arabic'),
        supabase.from('wilayas').select('id, name_arabic').order('name_arabic'),
      ]);
      if (specRes.data) setSpecialties(specRes.data);
      if (wilRes.data) setWilayas(wilRes.data);
    };
    load();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase
        .from('doctors')
        .select('*, specialties(name_arabic), wilayas(name_arabic), baladiyas(name_arabic)')
        .order('rating', { ascending: false });

      if (debouncedQuery) q = q.ilike('name', `%${debouncedQuery}%`);
      if (selectedSpecialty) q = q.eq('specialty_id', selectedSpecialty);
      if (selectedWilaya) q = q.eq('wilaya_id', selectedWilaya);

      const { data } = await q.limit(30);
      setDoctors((data as Doctor[]) || []);
      setLoading(false);
    };
    fetch();
  }, [debouncedQuery, selectedSpecialty, selectedWilaya]);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      {/* Header */}
      <div className="bg-[#0a1628] px-4 pt-12 pb-4 sticky top-0 z-30">
        <h1 className="text-white font-bold text-xl mb-4">الأطباء</h1>

        <div className="relative mb-3">
          <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث عن طبيب..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedSpecialty || ''}
              onChange={e => setSelectedSpecialty(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-2.5 px-3 text-gray-400 focus:outline-none focus:border-cyan-500/40 text-xs appearance-none"
            >
              <option value="">التخصص</option>
              {specialties.map(s => (
                <option key={s.id} value={s.id}>{s.name_arabic}</option>
              ))}
            </select>
            <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative flex-1">
            <select
              value={selectedWilaya || ''}
              onChange={e => setSelectedWilaya(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-2.5 px-3 text-gray-400 focus:outline-none focus:border-cyan-500/40 text-xs appearance-none"
            >
              <option value="">الولاية</option>
              {wilayas.map(w => (
                <option key={w.id} value={w.id}>{w.name_arabic}</option>
              ))}
            </select>
            <ChevronDown className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد نتائج</p>
          </div>
        ) : (
          doctors.map(doc => (
            <NeonCard
              key={doc.id}
              color="cyan"
              className="p-4"
              onClick={() => navigate(`/doctors/${doc.id}`)}
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={doc.image_url || 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={doc.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  {doc.is_verified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">{doc.name}</h3>
                      <p className="text-cyan-400 text-xs mt-0.5">{(doc as any).specialties?.name_arabic}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
                        <span className="text-gray-400 text-xs truncate">
                          {(doc as any).baladiyas?.name_arabic} - {(doc as any).wilayas?.name_arabic}
                        </span>
                      </div>
                    </div>
                    {doc.phone && (
                      <a
                        href={`tel:${doc.phone}`}
                        onClick={e => e.stopPropagation()}
                        className="w-9 h-9 bg-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0"
                      >
                        <Phone className="w-4 h-4 text-green-400" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-xs font-bold">{doc.rating}</span>
                      <span className="text-gray-500 text-xs">({doc.reviews_count})</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <span className="text-cyan-400 text-xs font-semibold">{doc.fee} دج</span>
                  </div>
                </div>
              </div>
            </NeonCard>
          ))
        )}
      </div>
    </div>
  );
}
