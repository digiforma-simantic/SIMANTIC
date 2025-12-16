import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebaradmin from "../../components/Kabid/Sidebarkabid";
import Headeradmin from "../../components/Kabid/Headerkabid";
import { useAuth } from "../../contexts/AuthContext";
import { rfcApprovalAPI } from "../../services/api";

const DashboardKabid = () => {
  // Ambil user dari localStorage hasil login SSO
  const [user, setUser] = React.useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  React.useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);
  const displayName = user?.name || user?.userName || "Pengguna Kabid";

  /* =======================
       RFC DATA
    ======================== */
    const [rfcApprovals, setRfcApprovals] = useState([]);
  
    const fetchDaftarApprovals = async () => {
      try {
        const res = await rfcApprovalAPI.getByLevel("kepala_bidang");
        setRfcApprovals(res.data || []);
      } catch (error) {
        console.error("Gagal mengambil RFC approvals", error);
      }
    };
  
    useEffect(() => {
      fetchDaftarApprovals();
    }, []);

  const summary = {
    pending: rfcApprovals.filter(
      (a) => a.decision === null
    ).length,

    approved: rfcApprovals.filter(
      (a) => a.decision === "approved"
    ).length,

    rejected: rfcApprovals.filter(
      (a) => a.decision === "rejected"
    ).length,

    accepted: rfcApprovals.filter(
      (a) => a.rfc?.status === "approved"
    ).length,
  };

  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">
      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="px-10 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-3xl font-semibold text-gray-900">{displayName}</h1>
          </div>

          {/* Status Approval Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#001B33] mb-6">
              Status Approval
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Ditunggu</p>
                <p className="text-4xl font-bold text-gray-900">
                  {summary.pending}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Disetujui</p>
                <p className="text-4xl font-bold text-gray-900">
                  {summary.approved}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Ditolak</p>
                <p className="text-4xl font-bold text-gray-900">
                  {summary.rejected}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Diterima</p>
                <p className="text-4xl font-bold text-gray-900">
                  {summary.accepted}
                </p>
              </div>
            </div>
          </div>


          {/* Daftar RFC */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#001B33]">Daftar RFC</h2>
                <Link
                  to="/Kasi/DaftarApprovalKasi"
                  className="text-sm text-[#02294A] font-semibold hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>            

              <div className="space-y-4">
                {rfcApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item?.rfc?.color}`}></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{item?.rfc.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{item?.rfc?.id}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{item?.rfc?.created_at}</p>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to={`/Kabid/DetailApprovalKabid/${item?.rfc?.id}`} 
                      className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
                    >
                      Cek Detail
                    </Link>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKabid;