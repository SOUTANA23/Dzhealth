import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import { AppSettingsProvider } from "./hooks/use-app-settings.ts";
import { useServiceWorker } from "./hooks/use-service-worker.ts";
import AuthCallback from "./pages/auth/Callback.tsx";
import Login from "./pages/auth/Login.tsx";
import Signup from "./pages/auth/Signup.tsx";
import Splash from "./pages/Splash.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AppLayout from "./AppLayout.tsx";
import Home from "./pages/Home.tsx";
import Doctors from "./pages/Doctors.tsx";
import DoctorDetail from "./pages/DoctorDetail.tsx";
import Donors from "./pages/Donors.tsx";
import RegisterDonor from "./pages/RegisterDonor.tsx";
import Equipment from "./pages/Equipment.tsx";
import AddEquipment from "./pages/AddEquipment.tsx";
import Pharmacies from "./pages/Pharmacies.tsx";
import Hospitals from "./pages/Hospitals.tsx";
import SearchPage from "./pages/Search.tsx";
import AddInfo from "./pages/AddInfo.tsx";
import Profile from "./pages/Profile.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import NotFound from "./pages/NotFound.tsx";
import Appointments from "./pages/Appointments.tsx";
import Notifications from "./pages/Notifications.tsx";
import CivilProtection from "./pages/CivilProtection.tsx";
import HerbalMedicine from "./pages/HerbalMedicine.tsx";
import AddHospital from "./pages/add-info/AddHospital.tsx";
import AddDoctor from "./pages/add-info/AddDoctor.tsx";
import AddPharmacy from "./pages/add-info/AddPharmacy.tsx";
import AddCivil from "./pages/add-info/AddCivil.tsx";
import AddHerbal from "./pages/add-info/AddHerbal.tsx";
import AddVet from "./pages/add-info/AddVet.tsx";
import { toast } from "sonner";

function AppWithSW() {
  useServiceWorker();
  return null;
}

function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center space-y-3 px-6">
        <p className="text-3xl">🚧</p>
        <h2 className="font-bold text-lg">قريباً</h2>
        <p className="text-sm text-muted-foreground">هذه الميزة ستكون متاحة قريباً</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <AppSettingsProvider>
        <AppWithSW />
        <BrowserRouter>
          <Routes>
            {/* Entry */}
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Auth */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* App Layout (with bottom nav) */}
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/donors" element={<Donors />} />
              <Route path="/donors/register" element={<RegisterDonor />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/equipment/add" element={<AddEquipment />} />
              <Route path="/pharmacies" element={<Pharmacies />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/add-info" element={<AddInfo />} />
              <Route path="/add-info/hospital" element={<AddHospital />} />
              <Route path="/add-info/doctor" element={<AddDoctor />} />
              <Route path="/add-info/pharmacy" element={<AddPharmacy />} />
              <Route path="/add-info/civil" element={<AddCivil />} />
              <Route path="/add-info/herbal" element={<AddHerbal />} />
              <Route path="/add-info/vet" element={<AddVet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/civil" element={<CivilProtection />} />
              <Route path="/herbal" element={<HerbalMedicine />} />
              <Route path="/more" element={<ComingSoon />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppSettingsProvider>
    </DefaultProviders>
  );
}
