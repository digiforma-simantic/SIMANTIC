import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardStaff from "./pages/Staff/DashboardStaff";
import AsetStaff from "./pages/Staff/AsetStaff";
import NotifikasiStaff from "./pages/Staff/NotifikasiStaff";
import BantuanStaff from "./pages/Staff/BantuanStaff";
import BantuanStaff1 from "./pages/Staff/BantuanStaff1";
import BantuanStaff2 from "./pages/Staff/BantuanStaff2";
import BantuanStaff3 from "./pages/Staff/BantuanStaff3";
import BantuanStaff4 from "./pages/Staff/BantuanStaff4";
import BantuanStaff5 from "./pages/Staff/BantuanStaff5";
import UserStaff from "./pages/Staff/UserStaff";
import GantiPasswordStaff from "./pages/Staff/GantiPasswordStaff";
import DetailAsetStaff from "./pages/Staff/DetailAsetStaff";
import DetailPengajuanStaff from "./pages/Staff/DetailPengajuanStaff";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";

export default function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* STAFF */}
      <Route path="/staff/dashboardstaff" element={<DashboardStaff />} />
      <Route path="/staff/asetstaff" element={<AsetStaff />} />
      <Route path="/staff/notifikasistaff" element={<NotifikasiStaff />} />
      <Route path="/staff/bantuanstaff" element={<BantuanStaff />} />
      <Route path="/staff/bantuanstaff1" element={<BantuanStaff1 />} />
      <Route path="/staff/bantuanstaff2" element={<BantuanStaff2 />} />
      <Route path="/staff/bantuanstaff3" element={<BantuanStaff3 />} />
      <Route path="/staff/bantuanstaff4" element={<BantuanStaff4 />} />
      <Route path="/staff/bantuanstaff5" element={<BantuanStaff5 />} />
      <Route path="/staff/userstaff" element={<UserStaff />} />
      <Route path="/staff/gantipasswordstaff" element={<GantiPasswordStaff />} />
      <Route path="/DetailAsetStaff/:id" element={<DetailAsetStaff />} />
      <Route path="/DetailPengajuanStaff/:id" element={<DetailPengajuanStaff />} />

      {/* ADMIN */}
      <Route path="/Admin/dashboardadmin" element={<DashboardAdmin />} />

      {/* REDIRECTS */}
      <Route path="/home" element={<Navigate to="/staff/dashboardstaff" replace />} />
      <Route path="/aset" element={<Navigate to="/staff/asetstaff" replace />} />
      <Route path="/bantuanstaff" element={<Navigate to="/staff/bantuanstaff" replace />} />
      <Route path="/bantuanstaff1" element={<BantuanStaff1 />} />
      <Route path="/bantuanstaff2" element={<BantuanStaff2 />} />
      <Route path="/bantuanstaff3" element={<BantuanStaff3 />} />
      <Route path="/bantuanstaff4" element={<BantuanStaff4 />} />
      <Route path="/bantuanstaff5" element={<BantuanStaff5 />} />
      <Route path="/NotifikasiStaff" element={<NotifikasiStaff />} />
      <Route path="/UserStaff" element={<UserStaff />} />
      <Route path="/GantiPasswordStaff" element={<GantiPasswordStaff />} />
      <Route path="/DetailAsetStaff/:id" element={<DetailAsetStaff />} />
      <Route path="/DetailPengajuanStaff/:id" element={<DetailPengajuanStaff />} />

      <Route path="/admin/dashboardadmin" element={<DashboardAdmin />} />

    </Routes>
  );
}
