import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Phone, MessageCircle, MapPin, Star, Shield, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RatingBar } from '../components/RatingBar';

type Doctor = {
  id: number;
  name: string;
  fee: number;
  rating: number;
  reviews_count: number;
  years_experience: number;
  patients_count: number;
  satisfaction_rate: number;
  about: string;
  tags: string[];
  image_url: string;
  is_verified: boolean;
  phone: string;
  address: string;
  reviews_distribution: Record<string, number>;
  specialties?: { name_arabic: string };
  wilayas?: { name_arabic: string };
  baladiyas?: { name_arabic: string };
};

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('doctors')
        .select('*, specialties(name_arabic), wilayas(name_arabic), baladiyas(name_arabic)')
        .eq('id', Number(id))
        .maybeSingle();
      setDoctor(data as Doctor);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: doctor?.name, text: doctor?.about, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex flex-col items-center justify-center gap-3">
        <p className="text-gray-400">الطبيب غير موجود</p>
        <button onClick={() => navigate(-1)} className="text-cyan-400">رجوع</button>
      </div>
    );
  }

  const dist = doctor.reviews_distribution || {};
  const totalRevs = doctor.reviews_count || 1;

  return (
    <div className="min-h-screen bg-[#060d1a] pb-28">
      {/* Hero */}
      <div className="relative h-72">
        <img
          src={doctor.image_url || 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={doctor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060d1a]/50 via-transparent to-[#060d1a]" />

        <div className="absolute top-12 inset-x-0 flex items-center justify-between px-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-white rtl:rotate-180" />
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setSaved(v => !v)} className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Heart className={`w-5 h-5 ${saved ? 'text-red-400 fill-red-400' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Name & Specialty */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-white font-bold text-xl">{doctor.name}</h1>
            {doctor.is_verified && <Shield className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />}
          </div>
          <p className="text-cyan-400 text-sm">{(doctor as any).specialties?.name_arabic}</p>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-400 text-sm">{(doctor as any).baladiyas?.name_arabic} - {(doctor as any).wilayas?.name_arabic}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{doctor.rating}</span>
            <span className="text-gray-500 text-sm">({doctor.reviews_count} تقييم)</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'سنوات الخبرة', value: doctor.years_experience },
            { label: 'مرضى', value: `${(doctor.patients_count / 1000).toFixed(1)}K+` },
            { label: 'نسبة الرضا', value: `${doctor.satisfaction_rate}%` },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-3 text-center">
              <p className="text-cyan-400 font-bold text-lg">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          {doctor.phone && (
            <a href={`tel:${doctor.phone}`} className="flex flex-col items-center gap-1.5 bg-[#0d1b2a] border border-green-500/30 rounded-2xl p-3">
              <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-gray-400 text-xs">اتصال</span>
            </a>
          )}
          <a href={`sms:${doctor.phone}`} className="flex flex-col items-center gap-1.5 bg-[#0d1b2a] border border-blue-500/30 rounded-2xl p-3">
            <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-xs">رسالة</span>
          </a>
          <button className="flex flex-col items-center gap-1.5 bg-[#0d1b2a] border border-orange-500/30 rounded-2xl p-3">
            <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-gray-400 text-xs">الموقع</span>
          </button>
        </div>

        {/* About */}
        {doctor.about && (
          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-semibold mb-2">نبذة عن الطبيب</h3>
            <p className={`text-gray-400 text-sm leading-relaxed ${!showFullAbout ? 'line-clamp-3' : ''}`}>
              {doctor.about}
            </p>
            <button onClick={() => setShowFullAbout(v => !v)} className="text-cyan-400 text-sm mt-2 flex items-center gap-1">
              {showFullAbout ? 'عرض أقل' : 'عرض المزيد'}
              {showFullAbout ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Tags */}
        {doctor.tags && doctor.tags.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2">التخصصات</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Distribution */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{doctor.rating}</p>
              <div className="flex justify-center mt-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3 h-3 ${s <= Math.round(doctor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">({doctor.reviews_count})</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5,4,3,2,1].map(s => (
                <RatingBar key={s} star={s} percentage={Math.round(((dist[String(s)] || 0) / totalRevs) * 100)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Book Appointment button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 max-w-md mx-auto">
        <button
          onClick={() => setShowBooking(true)}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-cyan-500/30 transition-transform duration-150 active:scale-95"
        >
          احجز موعد
        </button>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal doctor={doctor} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}

function BookingModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [visitType, setVisitType] = useState<'in_person' | 'online'>('in_person');

  const TIMES = ['09:00', '10:30', '12:00', '14:00', '16:00', '18:00'];
  const DAYS_AR = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  const handleConfirm = async () => {
    // Would insert appointment to Supabase
    alert('تم حجز الموعد بنجاح!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end">
      <div className="w-full max-w-md mx-auto bg-[#0a1628] rounded-t-3xl p-5 border-t border-white/10 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">حجز موعد</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 mb-5">
          <img src={doctor.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <p className="text-white font-semibold text-sm">{doctor.name}</p>
            <p className="text-cyan-400 text-xs">{(doctor as any).specialties?.name_arabic}</p>
            <p className="text-gray-500 text-xs">{(doctor as any).baladiyas?.name_arabic}</p>
          </div>
        </div>

        <h3 className="text-white font-semibold text-sm mb-3">اختر التاريخ</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {dates.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(i)}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl transition-all ${
                i === selectedDate
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              <span className="text-xs">{d.getDate()}</span>
              <span className="text-[10px] mt-0.5">{DAYS_AR[d.getDay()]}</span>
            </button>
          ))}
        </div>

        <h3 className="text-white font-semibold text-sm mb-3">اختر الوقت</h3>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {TIMES.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                time === selectedTime
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <h3 className="text-white font-semibold text-sm mb-3">نوع الزيارة</h3>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[{ key: 'in_person', label: 'حضوري' }, { key: 'online', label: 'أونلاين' }].map(vt => (
            <button
              key={vt.key}
              onClick={() => setVisitType(vt.key as 'in_person' | 'online')}
              className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                visitType === vt.key
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              {vt.label}
            </button>
          ))}
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">رسوم الطبيب</span>
            <span className="text-white">{doctor.fee} دج</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">رسوم المنصة</span>
            <span className="text-white">100 دج</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between text-sm font-bold">
            <span className="text-white">المجموع</span>
            <span className="text-cyan-400">{doctor.fee + 100} دج</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold text-base"
        >
          تأكيد الحجز
        </button>
      </div>
    </div>
  );
}
