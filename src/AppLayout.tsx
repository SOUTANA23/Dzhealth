import { Outlet } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-1)] theme-transition">
      <main className="pb-20 max-w-md mx-auto relative">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
