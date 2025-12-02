import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

// STAFF
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
import UserStaffEdit from "./pages/Staff/UserStaffEdit";
import DetailPengajuanStaff from "./pages/Staff/DetailPengajuanStaff";

// ADMIN
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import DaftarAset from "./pages/Admin/DaftarAset";
import AsetSaya from "./pages/Admin/AsetSaya";
import DaftarApproval from "./pages/Admin/DaftarApproval";
import DetailPermohonan from "./pages/Admin/DetailPermohonan";
import RiwayatApproval from "./pages/Admin/RiwayatApproval";
import DetailPengajuan from "./pages/Admin/DetailPengajuan";
import DetailAsetSaya from "./pages/Admin/DetailAsetSaya";
import DaftarDetailAset from "./pages/Admin/DaftarDetailAset";
import FormDetailAset from "./pages/Admin/FormDetailAset";
import Notifikasi from "./pages/Admin/Notifikasi";
import DataUser from "./pages/Admin/DataUser";
import GantiPassword from "./pages/Admin/GantiPassword";
import Bantuan from "./pages/Admin/Bantuan";
import Bantuan1 from "./pages/Admin/Bantuan1";
import Bantuan2 from "./pages/Admin/Bantuan2";
import Bantuan3 from "./pages/Admin/Bantuan3";
import Bantuan4 from "./pages/Admin/Bantuan4";
import Bantuan5 from "./pages/Admin/Bantuan5";

export default function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* STAFF MAIN ROUTES */}
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
      <Route path="/staff/detail-aset/:id" element={<DetailAsetStaff />} />
      <Route path="/staff/userstaff/edit" element={<UserStaffEdit />} />
      <Route path="/staff/detail-pengajuan/:id" element={<DetailPengajuanStaff />} />

      {/* ADMIN MAIN ROUTES */}
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/daftar-aset" element={<DaftarAset />} />
      <Route path="/admin/aset-saya" element={<AsetSaya />} />
      <Route path="/admin/daftar-approval" element={<DaftarApproval />} />
      <Route path="/admin/detail-permohonan/:id" element={<DetailPermohonan />} />
      <Route path="/admin/riwayat-approval" element={<RiwayatApproval />} />
      <Route path="/admin/detail-pengajuan/:id" element={<DetailPengajuan />} />
      <Route path="/admin/detail-aset-saya/:id" element={<DetailAsetSaya />} />
      <Route path="/admin/daftar-detail-aset/:id" element={<DaftarDetailAset />} />
      <Route path="/admin/form-detail-aset/:id" element={<FormDetailAset />} />
      <Route path="/admin/notifikasi" element={<Notifikasi />} />
      <Route path="/admin/data-user" element={<DataUser />} />
      <Route path="/admin/ganti-password" element={<GantiPassword />} />
      <Route path="/admin/bantuan" element={<Bantuan />} />
      <Route path="/admin/bantuan1" element={<Bantuan1 />} />
      <Route path="/admin/bantuan2" element={<Bantuan2 />} />
      <Route path="/admin/bantuan3" element={<Bantuan3 />} />
      <Route path="/admin/bantuan4" element={<Bantuan4 />} />
      <Route path="/admin/bantuan5" element={<Bantuan5 />} />

      {/* REDIRECT / ALIAS ROUTES */}
      <Route path="/home" element={<Navigate to="/staff/dashboardstaff" replace />} />
      <Route path="/aset" element={<Navigate to="/staff/asetstaff" replace />} />
      <Route path="/NotifikasiStaff" element={<Navigate to="/staff/notifikasistaff" replace />} />
      <Route path="/UserStaff" element={<Navigate to="/staff/userstaff" replace />} />
      <Route path="/GantiPasswordStaff" element={<Navigate to="/staff/gantipasswordstaff" replace />} />

      {/* 404 fallback (optional) */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}
