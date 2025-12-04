import { Routes, Route, Navigate } from "react-router-dom";

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

import DashboardKasi from "./pages/Kasi/DashboardKasi";
import AsetSayaKasi from "./pages/Kasi/AsetSayaKasi";
import RiwayatApprovalKasi from "./pages/Kasi/RiwayatApprovalKasi";
import BantuanKasi from "./pages/Kasi/BantuanKasi";
import NotifikasiKasi from "./pages/Kasi/NotifikasiKasi";
import DataUserKasi from "./pages/Kasi/DataUserKasi";
import GantiPasswordKasi from "./pages/Kasi/GantiPasswordKasi";
import BantuanKasi1 from "./pages/Kasi/BantuanKasi1";
import BantuanKasi2 from "./pages/Kasi/BantuanKasi2";
import BantuanKasi3 from "./pages/Kasi/BantuanKasi3";
import BantuanKasi4 from "./pages/Kasi/BantuanKasi4";
import BantuanKasi5 from "./pages/Kasi/BantuanKasi5";
import DetailAsetKasi from "./pages/Kasi/DetailAsetKasi";
import DaftarApprovalKasi from "./pages/Kasi/DaftarApprovalKasi";
import DetailApprovalKasi from "./pages/Kasi/DetailApprovalKasi";
import StatusPengajuanKasi from "./pages/Kasi/StatusPengajuanKasi";
import DetailPermohonanKasi from "./pages/Kasi/DetailPermohonanKasi";

export default function App() {
  return (
    <Routes>

   

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
      <Route path="/UserStaffEdit/" element={<UserStaffEdit />} />
      <Route path="/DetailPengajuanStaff/:id" element={<DetailPengajuanStaff />} />

      {/* ADMIN */}
      <Route path="/Admin/dashboardadmin" element={<DashboardAdmin />} />
      <Route path="/Admin/daftaraset" element={<DaftarAset />} />
      <Route path="/Admin/asetsaya" element={<AsetSaya />} />
      <Route path="/DaftarApproval" element={<DaftarApproval />} />
      <Route path="/Admin/daftarapproval" element={<DaftarApproval />} />
      <Route path="/Admin/DetailPermohonan/:id" element={<DetailPermohonan />} />
      <Route path="/Admin/RiwayatApproval" element={<RiwayatApproval />} />
      <Route path="/DetailPengajuan/:id" element={<DetailPengajuan />} />
      <Route path="/Admin/DetailAsetSaya/:id" element={<DetailAsetSaya />} />
      <Route path="/DaftarDetailAset/:id" element={<DaftarDetailAset />} />
      <Route path="/FormDetailAset/:id" element={<FormDetailAset />} />
      <Route path="/Notifikasi" element={<Notifikasi />} />
      <Route path="/DataUser" element={<DataUser />} />
      <Route path="/GantiPassword" element={<GantiPassword />} />
      <Route path="/Admin/bantuan" element={<Bantuan />} />
      <Route path="/bantuan1" element={<Bantuan1 />} />
      <Route path="/bantuan2" element={<Bantuan2 />} />
      <Route path="/bantuan3" element={<Bantuan3 />} />
      <Route path="/bantuan4" element={<Bantuan4 />} />
      <Route path="/bantuan5" element={<Bantuan5 />} />

      {/* KASI - lowercase routes */}
      <Route path="/" element={<Navigate to="/staff/dashboardstaff" replace />} />
      <Route path="/kasi" element={<DashboardKasi />} />
      <Route path="/kasi/daftar-approval" element={<DaftarApprovalKasi />} />
      <Route path="/kasi/riwayat-approval" element={<RiwayatApprovalKasi />} />
      <Route path="/kasi/bantuan" element={<BantuanKasi />} />
      
      {/* KASI - uppercase routes (legacy) */}
      <Route path="/Kasi/AsetSayaKasi" element={<AsetSayaKasi />} />
      <Route path="/Kasi/RiwayatApprovalKasi" element={<RiwayatApprovalKasi />} />
      <Route path="/Kasi/BantuanKasi" element={<BantuanKasi />} />
      <Route path="/Kasi/NotifikasiKasi" element={<NotifikasiKasi />} />
      <Route path="/Kasi/DataUserKasi" element={<DataUserKasi />} />
      <Route path="/Kasi/GantiPasswordKasi" element={<GantiPasswordKasi />} />
      <Route path="/Kasi/DetailAsetKasi/:id" element={<DetailAsetKasi />} />
      <Route path="/Kasi/DaftarApprovalKasi" element={<DaftarApprovalKasi />} />
      <Route path="/Kasi/DetailApprovalKasi/:id" element={<DetailApprovalKasi />} />
      <Route path="/Kasi/StatusPengajuanKasi/:id" element={<StatusPengajuanKasi />} />
      <Route path="/Kasi/DetailPermohonanKasi/:id" element={<DetailPermohonanKasi />} />

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
      <Route path="/UserStaffEdit/" element={<UserStaffEdit />} />
      <Route path="/DetailPengajuanStaff/:id" element={<DetailPengajuanStaff />} />

      <Route path="/Admin/dashboardadmin" element={<DashboardAdmin />} />
      <Route path="/Admin/daftaraset" element={<DaftarAset />} />
      <Route path="/Admin/asetsaya" element={<AsetSaya />} />
      <Route path="/Admin/daftarapproval" element={<DaftarApproval />} />
      <Route path="/Admin/DetailPermohonan/:id" element={<DetailPermohonan />} />
      <Route path="/Admin/DetailApproval/:id" element={<DetailPermohonan />} />
      <Route path="/Admin/RiwayatApproval" element={<RiwayatApproval />} />
      <Route path="/DetailPengajuan/:id" element={<DetailPengajuan />} />
      <Route path="/Admin/DetailAsetSaya/:id" element={<DetailAsetSaya />} />
      <Route path="/DaftarDetailAset/:id" element={<DaftarDetailAset />} />
      <Route path="/FormDetailAset/:id" element={<FormDetailAset />} />
      <Route path="/Notifikasi" element={<Notifikasi />} />
      <Route path="/DataUser" element={<DataUser />} />
      <Route path="/GantiPassword" element={<GantiPassword />} />
      <Route path="/Admin/bantuan" element={<Bantuan />} />
      <Route path="/bantuan1" element={<Bantuan1 />} />
      <Route path="/bantuan2" element={<Bantuan2 />} />
      <Route path="/bantuan3" element={<Bantuan3 />} />
      <Route path="/bantuan4" element={<Bantuan4 />} />
      <Route path="/bantuan5" element={<Bantuan5 />} />

      <Route path="/Kasi/dashboardkasi" element={<DashboardKasi />} />
      <Route path="/Kasi/AsetSayaKasi" element={<AsetSayaKasi />} />
      <Route path="/Kasi/RiwayatApprovalKasi" element={<RiwayatApprovalKasi />} />
      <Route path="/Kasi/BantuanKasi" element={<BantuanKasi />} />
      <Route path="/Kasi/NotifikasiKasi" element={<NotifikasiKasi />} />
      <Route path="/DataUserKasi" element={<DataUserKasi />} />
      <Route path="/GantiPasswordKasi" element={<GantiPasswordKasi />} />
      <Route path="/BantuanKasi1" element={<BantuanKasi1 />} />
      <Route path="/BantuanKasi2" element={<BantuanKasi2 />} />
      <Route path="/BantuanKasi3" element={<BantuanKasi3 />} />
      <Route path="/BantuanKasi4" element={<BantuanKasi4 />} />
      <Route path="/BantuanKasi5" element={<BantuanKasi5 />} />

    </Routes>
  );
}
