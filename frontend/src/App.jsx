import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import DashboardStaff from "./pages/Staff/DashboardStaff";
import AsetStaff from "./pages/Staff/AsetStaff";
import NotifikasiStaff from "./pages/Staff/NotifikasiStaff";
import BantuanStaff from "./pages/Staff/BantuanStaff";
import BantuanStaff1 from "./pages/Staff/BantuanStaff1";
import BantuanStaff2 from "./pages/Staff/BantuanStaff2";
import BantuanStaff3 from "./pages/Staff/BantuanStaff3";
import BantuanStaff4 from "./pages/Staff/BantuanStaff4";
import UserStaff from "./pages/Staff/UserStaff";
import DetailAsetStaff from "./pages/Staff/DetailAsetStaff";
import DetailPengajuanStaff from "./pages/Staff/DetailPengajuanStaff";

import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import PantauStatusAdmin from "./pages/Admin/PantauStatusAdmin";
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
import Bantuan from "./pages/Admin/Bantuan";
import Bantuan1 from "./pages/Admin/Bantuan1";
import Bantuan2 from "./pages/Admin/Bantuan2";
import Bantuan3 from "./pages/Admin/Bantuan3";
import Bantuan4 from "./pages/Admin/Bantuan4";

import DashboardKasi from "./pages/Kasi/DashboardKasi";
import AsetSayaKasi from "./pages/Kasi/AsetSayaKasi";
import RiwayatApprovalKasi from "./pages/Kasi/RiwayatApprovalKasi";
import BantuanKasi from "./pages/Kasi/BantuanKasi";
import NotifikasiKasi from "./pages/Kasi/NotifikasiKasi";
import DataUserKasi from "./pages/Kasi/DataUserKasi";
import BantuanKasi1 from "./pages/Kasi/BantuanKasi1";
import BantuanKasi2 from "./pages/Kasi/BantuanKasi2";
import BantuanKasi3 from "./pages/Kasi/BantuanKasi3";
import BantuanKasi4 from "./pages/Kasi/BantuanKasi4";
import DetailAsetKasi from "./pages/Kasi/DetailAsetKasi";
import DaftarApprovalKasi from "./pages/Kasi/DaftarApprovalKasi";
import DetailApprovalKasi from "./pages/Kasi/DetailApprovalKasi";
import DetailPermohonanKasi from "./pages/Kasi/DetailPermohonanKasi";

import DashboardKabid from "./pages/Kabid/DashboardKabid";
import AsetSayaKabid from "./pages/Kabid/AsetSayaKabid";
import RiwayatApprovalKabid from "./pages/Kabid/RiwayatApprovalKabid";
import BantuanKabid from "./pages/Kabid/BantuanKabid";
import NotifikasiKabid from "./pages/Kabid/NotifikasiKabid";
import DataUserKabid from "./pages/Kabid/DataUserKabid";
import BantuanKabid1 from "./pages/Kabid/BantuanKabid1";
import BantuanKabid2 from "./pages/Kabid/BantuanKabid2";
import BantuanKabid3 from "./pages/Kabid/BantuanKabid3";
import BantuanKabid4 from "./pages/Kabid/BantuanKabid4";
import DetailAsetKabid from "./pages/Kabid/DetailAsetKabid";
import DaftarApprovalKabid from "./pages/Kabid/DaftarApprovalKabid";
import DetailApprovalKabid from "./pages/Kabid/DetailApprovalKabid";
import DetailPermohonanKabid from "./pages/Kabid/DetailPermohonanKabid";

import DashboardKadis from "./pages/Kadis/DashboardKadis";
import AsetSayaKadis from "./pages/Kadis/AsetSayaKadis";
import RiwayatApprovalKadis from "./pages/Kadis/RiwayatApprovalKadis";
import BantuanKadis from "./pages/Kadis/BantuanKadis";
import NotifikasiKadis from "./pages/Kadis/NotifikasiKadis";
import DataUserKadis from "./pages/Kadis/DataUserKadis";
import BantuanKadis1 from "./pages/Kadis/BantuanKadis1";
import BantuanKadis2 from "./pages/Kadis/BantuanKadis2";
import BantuanKadis3 from "./pages/Kadis/BantuanKadis3";
import BantuanKadis4 from "./pages/Kadis/BantuanKadis4";
import DetailAsetKadis from "./pages/Kadis/DetailAsetKadis";
import DaftarApprovalKadis from "./pages/Kadis/DaftarApprovalKadis";
import DetailApprovalKadis from "./pages/Kadis/DetailApprovalKadis";
import DetailPermohonanKadis from "./pages/Kadis/DetailPermohonanKadis";
import StatusPengajuanAdmin from "./pages/Admin/StatusPengajuanAdmin";

import DashboardAuditor from "./pages/Auditor/DashboardAuditor";
import NotifikasiAuditor from "./pages/Auditor/NotifikasiAuditor";
import BantuanAuditor from "./pages/Auditor/BantuanAuditor";
import BantuanAuditor1 from "./pages/Auditor/BantuanAuditor1";
import BantuanAuditor2 from "./pages/Auditor/BantuanAuditor2";
import BantuanAuditor3 from "./pages/Auditor/BantuanAuditor3";
import BantuanAuditor4 from "./pages/Auditor/BantuanAuditor4";
import DataUserAuditor from "./pages/Auditor/DataUserAuditor";
import ChangeSummary from "./pages/Auditor/ChangeSummary";
import PatchCompliance from "./pages/Auditor/PatchCompliance";
import DetailChangeSummary from "./pages/Auditor/DetailChangeSummary";
import DetailPatchCompliance from "./pages/Auditor/DetailPatchCompliance";
import LaporanAuditor from "./pages/Auditor/LaporanAuditor";

import DashboardDiskominfo from "./pages/Diskominfo/DashboardDiskominfo";
import NotifikasiDiskominfo from "./pages/Diskominfo/NotifikasiDiskominfo";
import BantuanDiskominfo from "./pages/Diskominfo/BantuanDiskominfo";
import BantuanDiskominfo1 from "./pages/Diskominfo/BantuanDiskominfo1";
import BantuanDiskominfo2 from "./pages/Diskominfo/BantuanDiskominfo2";
import BantuanDiskominfo3 from "./pages/Diskominfo/BantuanDiskominfo3";
import BantuanDiskominfo4 from "./pages/Diskominfo/BantuanDiskominfo4";
import DataUserDiskominfo from "./pages/Diskominfo/DataUserDiskominfo";
import DaftarAsetDiskominfo from "./pages/Diskominfo/DaftarAsetDiskominfo";
import DetailAsetDiskominfo from "./pages/Diskominfo/DetailAsetDiskominfo";
import DaftarApprovalDiskominfo from "./pages/Diskominfo/DaftarApprovalDiskominfo";
import DaftarRiwayatDiskominfo from "./pages/Diskominfo/DaftarRiwayatDiskominfo";
import DetailApprovalDiskominfo from "./pages/Diskominfo/DetailApprovalDiskominfo";
import RiwayatApprovalDiskominfo from "./pages/Diskominfo/RiwayatApprovalDiskominfo";
import SsoCallback from "./pages/SsoCallback";
import DevLogin from "./pages/DevLogin";
import DevBypass from "./pages/DevBypass";

function App() {
  return (
    <Routes>
      {/* DEV BYPASS - Skip login, langsung masuk dashboard */}
      <Route path="/dev-bypass" element={<DevBypass />} />
      
      {/* DEV LOGIN - Development Only */}
      <Route path="/dev-login" element={<DevLogin />} />
      
      {/* SSO CALLBACK */}
      <Route path="/api/sso/callback" element={<SsoCallback />} />
      <Route path="/sso/callback" element={<SsoCallback />} />

      {/* STAFF */}
      <Route path="/staff/dashboardstaff" element={<DashboardStaff />} />
      <Route path="/staff/asetstaff" element={<AsetStaff />} />
      <Route path="/staff/notifikasistaff" element={<NotifikasiStaff />} />
      <Route path="/staff/bantuanstaff" element={<BantuanStaff />} />
      <Route path="/staff/bantuanstaff1" element={<BantuanStaff1 />} />
      <Route path="/staff/bantuanstaff2" element={<BantuanStaff2 />} />
      <Route path="/staff/bantuanstaff3" element={<BantuanStaff3 />} />
      <Route path="/staff/bantuanstaff4" element={<BantuanStaff4 />} />
      <Route path="/staff/userstaff" element={<UserStaff />} />
      <Route path="/DetailAsetStaff/:id" element={<DetailAsetStaff />} />
      <Route path="/DetailPengajuanStaff/:id" element={<DetailPengajuanStaff />} />

      {/* ADMIN */}
      <Route path="/Admin/dashboardadmin" element={<DashboardAdmin />} />
      <Route path="/Admin/daftaraset" element={<DaftarAset />} />
      <Route path="/Admin/asetsaya" element={<AsetSaya />} />
      <Route path="/DaftarApproval" element={<DaftarApproval />} />
      <Route path="/Admin/daftarapproval" element={<DaftarApproval />} />
      <Route path="/Admin/PantauStatus" element={<PantauStatusAdmin />} />
      <Route path="/Admin/DetailPermohonan/:id" element={<DetailPermohonan />} />
      <Route path="/Admin/StatusPengajuan/:id" element={<StatusPengajuanAdmin />} />
      <Route path="/Admin/RiwayatApproval" element={<RiwayatApproval />} />
      <Route path="/DetailPengajuan/:id" element={<DetailPengajuan />} />
      <Route path="/Admin/DetailAsetSaya/:id" element={<DetailAsetSaya />} />
      <Route path="/DaftarDetailAset/:id" element={<DaftarDetailAset />} />
      <Route path="/FormDetailAset/:id" element={<FormDetailAset />} />
      <Route path="/Notifikasi" element={<Notifikasi />} />
      <Route path="/DataUser" element={<DataUser />} />
      <Route path="/Admin/bantuan" element={<Bantuan />} />
      <Route path="/bantuan1" element={<Bantuan1 />} />
      <Route path="/bantuan2" element={<Bantuan2 />} />
      <Route path="/bantuan3" element={<Bantuan3 />} />
      <Route path="/bantuan4" element={<Bantuan4 />} />

      {/* KASI */}
      <Route path="/Kasi/dashboardkasi" element={<DashboardKasi />} />
      <Route path="/Kasi/AsetSayaKasi" element={<AsetSayaKasi />} />
      <Route path="/Kasi/RiwayatApprovalKasi" element={<RiwayatApprovalKasi />} />
      <Route path="/Kasi/BantuanKasi" element={<BantuanKasi />} />
      <Route path="/Kasi/NotifikasiKasi" element={<NotifikasiKasi />} />
      <Route path="/Kasi/DataUserKasi" element={<DataUserKasi />} />
      <Route path="/Kasi/DetailAsetKasi/:id" element={<DetailAsetKasi />} />
      <Route path="/Kasi/DaftarApprovalKasi" element={<DaftarApprovalKasi />} />
      <Route path="/Kasi/DetailApprovalKasi/:id" element={<DetailApprovalKasi />} />
      <Route path="/Kasi/DetailPermohonanKasi/:id" element={<DetailPermohonanKasi />} />
      <Route path="/BantuanKasi1" element={<BantuanKasi1 />} />
      <Route path="/BantuanKasi2" element={<BantuanKasi2 />} />
      <Route path="/BantuanKasi3" element={<BantuanKasi3 />} />
      <Route path="/BantuanKasi4" element={<BantuanKasi4 />} />

      {/* KABID */}
      <Route path="/Kabid/dashboardkabid" element={<DashboardKabid />} />
      <Route path="/Kabid/AsetSayaKabid" element={<AsetSayaKabid />} />
      <Route path="/Kabid/RiwayatApprovalKabid" element={<RiwayatApprovalKabid />} />
      <Route path="/Kabid/BantuanKabid" element={<BantuanKabid />} />
      <Route path="/Kabid/NotifikasiKabid" element={<NotifikasiKabid />} />
      <Route path="/Kabid/DataUserKabid" element={<DataUserKabid />} />
      <Route path="/Kabid/DetailAsetKabid/:id" element={<DetailAsetKabid />} />
      <Route path="/Kabid/DaftarApprovalKabid" element={<DaftarApprovalKabid />} />
      <Route path="/Kabid/DetailApprovalKabid/:id" element={<DetailApprovalKabid />} />
      <Route path="/Kabid/DetailPermohonanKabid/:id" element={<DetailPermohonanKabid />} />
      <Route path="/BantuanKabid1" element={<BantuanKabid1 />} />
      <Route path="/BantuanKabid2" element={<BantuanKabid2 />} />
      <Route path="/BantuanKabid3" element={<BantuanKabid3 />} />
      <Route path="/BantuanKabid4" element={<BantuanKabid4 />} />

      {/* KADIS */}
      <Route path="/Kadis/dashboardkadis" element={<DashboardKadis />} />
      <Route path="/Kadis/AsetSayaKadis" element={<AsetSayaKadis />} />
      <Route path="/Kadis/RiwayatApprovalKadis" element={<RiwayatApprovalKadis />} />
      <Route path="/Kadis/BantuanKadis" element={<BantuanKadis />} />
      <Route path="/Kadis/NotifikasiKadis" element={<NotifikasiKadis />} />
      <Route path="/Kadis/DataUserKadis" element={<DataUserKadis />} />
      <Route path="/Kadis/DetailAsetKadis/:id" element={<DetailAsetKadis />} />
      <Route path="/Kadis/DaftarApprovalKadis" element={<DaftarApprovalKadis />} />
      <Route path="/Kadis/DetailApprovalKadis/:id" element={<DetailApprovalKadis />} />
      <Route path="/Kadis/DetailPermohonanKadis/:id" element={<DetailPermohonanKadis />} />
      <Route path="/BantuanKadis1" element={<BantuanKadis1 />} />
      <Route path="/BantuanKadis2" element={<BantuanKadis2 />} />
      <Route path="/BantuanKadis3" element={<BantuanKadis3 />} />
      <Route path="/BantuanKadis4" element={<BantuanKadis4 />} />

      {/* AUDITOR */}
      <Route path="/auditor/dashboardauditor" element={<DashboardAuditor />} />
      <Route path="/Auditor/NotifikasiAuditor" element={<NotifikasiAuditor />} />
      <Route path="/Auditor/BantuanAuditor" element={<BantuanAuditor />} />
      <Route path="/BantuanAuditor1" element={<BantuanAuditor1 />} />
      <Route path="/BantuanAuditor2" element={<BantuanAuditor2 />} />
      <Route path="/BantuanAuditor3" element={<BantuanAuditor3 />} />
      <Route path="/BantuanAuditor4" element={<BantuanAuditor4 />} />
      <Route path="/Auditor/DataUserAuditor" element={<DataUserAuditor />} />
      <Route path="/Auditor/ChangeSummary" element={<ChangeSummary />} />
      <Route path="/Auditor/PatchCompliance" element={<PatchCompliance />} />
      <Route path="/Auditor/DetailChangeSummary/:id" element={<DetailChangeSummary />} />
      <Route path="/Auditor/DetailPatchCompliance/:id" element={<DetailPatchCompliance />} />
      <Route path="/Auditor/LaporanAuditor" element={<LaporanAuditor />} />

      {/* DISKOMINFO */}
      <Route path="/diskominfo/dashboarddiskominfo" element={<DashboardDiskominfo />} />
      <Route path="/Diskominfo/NotifikasiDiskominfo" element={<NotifikasiDiskominfo />} />
      <Route path="/Diskominfo/BantuanDiskominfo" element={<BantuanDiskominfo />} />
      <Route path="/BantuanDiskominfo1" element={<BantuanDiskominfo1 />} />
      <Route path="/BantuanDiskominfo2" element={<BantuanDiskominfo2 />} />
      <Route path="/BantuanDiskominfo3" element={<BantuanDiskominfo3 />} />
      <Route path="/BantuanDiskominfo4" element={<BantuanDiskominfo4 />} />
      <Route path="/Diskominfo/DataUserDiskominfo" element={<DataUserDiskominfo />} />
      <Route path="/Diskominfo/DaftarAsetDiskominfo" element={<DaftarAsetDiskominfo />} />
      <Route path="/Diskominfo/DetailAsetDiskominfo/:id" element={<DetailAsetDiskominfo />} />
      <Route path="/Diskominfo/DaftarApprovalDiskominfo" element={<DaftarApprovalDiskominfo />} />
      <Route path="/Diskominfo/DaftarRiwayatDiskominfo" element={<DaftarRiwayatDiskominfo />} />
      <Route path="/Diskominfo/DetailApprovalDiskominfo/:id" element={<DetailApprovalDiskominfo />} />
      <Route path="/Diskominfo/RiwayatApprovalDiskominfo/:id" element={<RiwayatApprovalDiskominfo />} />

      {/* REDIRECTS */}
      <Route path="/home" element={<Navigate to="/staff/dashboardstaff" replace />} />
      <Route path="/aset" element={<Navigate to="/staff/asetstaff" replace />} />
      <Route path="/bantuanstaff" element={<Navigate to="/staff/bantuanstaff" replace />} />
      <Route path="/bantuanstaff1" element={<BantuanStaff1 />} />
      <Route path="/bantuanstaff2" element={<BantuanStaff2 />} />
      <Route path="/bantuanstaff3" element={<BantuanStaff3 />} />
      <Route path="/bantuanstaff4" element={<BantuanStaff4 />} />
      <Route path="/NotifikasiStaff" element={<NotifikasiStaff />} />
      <Route path="/UserStaff" element={<UserStaff />} />
      <Route path="/DetailAsetStaff/:id" element={<DetailAsetStaff />} />
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
      <Route path="/Admin/bantuan" element={<Bantuan />} />
      <Route path="/bantuan1" element={<Bantuan1 />} />
      <Route path="/bantuan2" element={<Bantuan2 />} />
      <Route path="/bantuan3" element={<Bantuan3 />} />
      <Route path="/bantuan4" element={<Bantuan4 />} />

      <Route path="/Kasi/dashboardkasi" element={<DashboardKasi />} />
      <Route path="/Kasi/AsetSayaKasi" element={<AsetSayaKasi />} />
      <Route path="/Kasi/RiwayatApprovalKasi" element={<RiwayatApprovalKasi />} />
      <Route path="/Kasi/BantuanKasi" element={<BantuanKasi />} />
      <Route path="/Kasi/NotifikasiKasi" element={<NotifikasiKasi />} />
      <Route path="/DataUserKasi" element={<DataUserKasi />} />
      <Route path="/BantuanKasi1" element={<BantuanKasi1 />} />
      <Route path="/BantuanKasi2" element={<BantuanKasi2 />} />
      <Route path="/BantuanKasi3" element={<BantuanKasi3 />} />
      <Route path="/BantuanKasi4" element={<BantuanKasi4 />} />

    </Routes>
  );
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
