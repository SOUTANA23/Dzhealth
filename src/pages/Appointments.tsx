import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import { NeonCard } from '../components/NeonCard';

type Appointment = {
  id: number;
  appointment_date: string;
  appointment_time: string;
  visit_type: string;
  status: string;
  doctors?: { name: string; image_url: string; specialties?: { name_arabic: string } };
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  cancelled: 'ملغى',
  completed: 'مكتمل',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed: 'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
  completed: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
};

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('appointments')
      .select('*, doctors(name, image_url, specialties(name_arabic))')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: false })
      .then(({ data }) => {
        setAppointments((data as Appointment[]) || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <div className="bg-[#0a1628] px-4 pt-12 pb-4">
        <h1 className="text-white font-bold text-xl">المواعيد</h1>
      </div>

      <div className="px-4 mt-3 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">لا توجد مواعيد</p>
            <button
              onClick={() => navigate('/doctors')}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 text-sm"
            >
              احجز موعدك الآن
            </button>
          </div>
        ) : (
          appointments.map(apt => (
            <NeonCard key={apt.id} color="cyan" className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={(apt as any).doctors?.image_url || 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{(apt as any).doctors?.name}</p>
                  <p className="text-cyan-400 text-xs">{(apt as any).doctors?.specialties?.name_arabic}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 text-xs">{apt.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 text-xs">{apt.appointment_time}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${STATUS_COLORS[apt.status] || 'text-gray-400 bg-white/5 border-white/10'}`}>
                  {STATUS_LABELS[apt.status] || apt.status}
                </span>
              </div>
            </NeonCard>
          ))
        )}
      </div>
    </div>
  );
}
