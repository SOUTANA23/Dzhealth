import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAuth } from './hooks/use-auth';
import { AppLayout } from './AppLayout';

import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Donors from './pages/Donors';
import RegisterDonor from './pages/RegisterDonor';
import Equipment from './pages/Equipment';
import AddEquipment from './pages/AddEquipment';
import Search from './pages/Search';
import AddInfo from './pages/AddInfo';
import Pharmacies from './pages/Pharmacies';
import Hospitals from './pages/Hospitals';
import Notifications from './pages/Notifications';
import Appointments from './pages/Appointments';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
            <Route path="/home" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/register-donor" element={<RegisterDonor />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/add-equipment" element={<AddEquipment />} />
            <Route path="/add-info" element={<AddInfo />} />
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
