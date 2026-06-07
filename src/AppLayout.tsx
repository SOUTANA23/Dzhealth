import { Outlet } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#060d1a] text-white">
      <main className="pb-20 max-w-md mx-auto relative">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
