import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Search, ChevronRight, Phone, Star, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/use-auth';
import { useNotifications } from '../hooks/use-notifications';
import { NeonCard } from '../components/NeonCard';
import { getInitials } from '../lib/utils';

const SERVICES = [
  { key: 'doctors', label: 'الأطباء', path: '/doctors', icon: '🩺', color: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/30', iconBg: 'bg-cyan-500/20' },
  { key: 'hospitals', label: 'المستشفيات', path: '/hospitals', icon: '🏥', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', iconBg: 'bg-blue-500/20' },
  { key: 'pharmacies', label: 'الصيدليات', path: '/pharmacies', icon: '💊', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', iconBg: 'bg-green-500/20' },
  { key: 'donors', label: 'متبرع الدم', path: '/donors', icon: '🩸', color: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', iconBg: 'bg-red-500/20' },
  { key: 'equipment', label: 'المعدات الطبية', path: '/equipment', icon: '♿', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/30', iconBg: 'bg-orange-500/20' },
  { key: 'herbal', label: 'الطب البديل', path: '/add-info', icon: '🌿', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', iconBg: 'bg-emerald-500/20' },
  { key: 'civil', label: 'الحماية المدنية', path: '/add-info', icon: '🚒', color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', iconBg: 'bg-yellow-500/20' },
  { key: 'more', label: 'المزيد', path: '/search', icon: '⋯', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', iconBg: 'bg-purple-500/20' },
];

type Doctor = {
  id: number;
  name: string;
  specialty_id: number;
  wilaya_id: number;
  fee: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  is_verified: boolean;
  specialties?: { name_arabic: string };
  wilayas?: { name_arabic: string };
};

type Donor = {
  id: number;
  name: string;
  blood_type: string;
  phone: string;
  hide_name: boolean;
  is_available: boolean;
  wilayas?: { name_arabic: string };
};

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [docRes, donRes] = await Promise.all([
        supabase
          .from('doctors')
          .select('*, specialties(name_arabic), wilayas(name_arabic)')
          .order('rating', { ascending: false })
          .limit(5),
        supabase
          .from('blood_donors')
          .select('*, wilayas(name_arabic)')
          .eq('is_available', true)
          .limit(3),
      ]);
      if (docRes.data) setDoctors(docRes.data as Doctor[]);
      if (donRes.data) setDonors(donRes.data as Donor[]);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'مستخدم';
  const initials = getInitials(displayName);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a1628] to-transparent px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-500/40" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-cyan-500/40">
                {initials}
              </div>
            )}
            <div>
              <p className="text-gray-400 text-sm">مرحباً 👋</p>
              <h2 className="text-white font-bold text-base">{displayName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-1 bg-white/5 rounded-xl px-3 py-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-gray-400 text-xs">عنابة</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4">كيف يمكننا مساعدتك اليوم؟</p>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث عن طبيب، تخصص، ولاية..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40 transition-colors text-sm"
          />
        </form>
      </div>

      <div className="px-4 space-y-6 pb-4">
        {/* Services Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-base">الخدمات الرئيسية</h3>
            <button onClick={() => navigate('/search')} className="text-cyan-400 text-sm flex items-center gap-1">
              عرض الكل <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {SERVICES.map(svc => (
              <button
                key={svc.key}
                onClick={() => navigate(svc.path)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-b ${svc.color} border ${svc.border} transition-transform duration-150 active:scale-95`}
              >
                <div className={`w-10 h-10 ${svc.iconBg} rounded-xl flex items-center justify-center text-xl`}>
                  {svc.icon}
                </div>
                <span className="text-gray-300 text-[10px] text-center leading-tight">{svc.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Doctors */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-base">أطباء مميزون</h3>
            <button onClick={() => navigate('/doctors')} className="text-cyan-400 text-sm flex items-center gap-1">
              عرض الكل <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {doctors.map(doc => (
              <NeonCard
                key={doc.id}
                color="cyan"
                className="flex-shrink-0 w-40 p-3"
                onClick={() => navigate(`/doctors/${doc.id}`)}
              >
                <div className="relative mb-2">
                  <img
                    src={doc.image_url || 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={doc.name}
                    className="w-full h-28 object-cover rounded-xl"
                  />
                  {doc.is_verified && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-white font-semibold text-xs leading-tight mb-1 truncate">{doc.name}</p>
                <p className="text-cyan-400 text-[10px] mb-2 truncate">{(doc as any).specialties?.name_arabic}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">{doc.rating}</span>
                  </div>
                  <span className="text-gray-400 text-[10px]">({doc.reviews_count})</span>
                </div>
              </NeonCard>
            ))}
          </div>
        </section>

        {/* Nearby Blood Donors */}
        {donors.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-base">متبرعو الدم بالقرب منك</h3>
              <button onClick={() => navigate('/donors')} className="text-cyan-400 text-sm flex items-center gap-1">
                عرض الكل <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
            {donors.map(donor => (
              <NeonCard key={donor.id} color="red" className="p-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                    {donor.blood_type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-green-400 text-xs">متاح الآن</span>
                    </div>
                    <p className="text-white font-semibold text-sm truncate">
                      {donor.hide_name ? 'متبرع مجهول' : donor.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 text-xs">{(donor as any).wilayas?.name_arabic}</span>
                    </div>
                  </div>
                  {donor.phone && !donor.hide_name && (
                    <a href={`tel:${donor.phone}`} className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
                {donor.phone && (
                  <p className="text-gray-500 text-xs mt-2">{donor.phone}</p>
                )}
              </NeonCard>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
