import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { NeonCard } from '../components/NeonCard';

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAllRead } = useNotifications();

  return (
    <div className="min-h-screen bg-[#060d1a]">
      <div className="bg-[#0a1628] px-4 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">الإشعارات</h1>
        {notifications.length > 0 && (
          <button onClick={markAllRead} className="text-cyan-400 text-sm">تحديد الكل كمقروء</button>
        )}
      </div>

      <div className="px-4 mt-3 space-y-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500">لا توجد إشعارات</p>
          </div>
        ) : (
          notifications.map(n => (
            <NeonCard key={n.id} className={`p-4 ${!n.is_read ? 'border-cyan-500/30' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.is_read ? 'bg-cyan-400' : 'bg-transparent'}`} />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{n.title}</p>
                  {n.message && <p className="text-gray-400 text-xs mt-1">{n.message}</p>}
                  <p className="text-gray-600 text-xs mt-1.5">{timeAgo(n.created_at)}</p>
                </div>
              </div>
            </NeonCard>
          ))
        )}
      </div>
    </div>
  );
}
