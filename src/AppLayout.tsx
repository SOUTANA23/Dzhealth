import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav.tsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-16 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
