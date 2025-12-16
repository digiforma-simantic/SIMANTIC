import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebaradmin from "../../components/Kasi/Sidebarkasi";
import Headeradmin from "../../components/Kasi/Headerkasi";
import { rfcApprovalAPI } from "../../services/api";

const DashboardKasi = () => {
  /* =======================
     USER LOGIN (SSO)
  ======================== */
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const displayName = user?.name || "Pengguna Kasi";

  /* =======================
     RFC DATA
  ======================== */
  const [rfcApprovals, setRfcApprovals] = useState([]);

  const fetchDaftarApprovals = async () => {
    try {
      const res = await rfcApprovalAPI.getByLevel("kepala_seksi");
      setRfcApprovals(res.data || []);
    } catch (error) {
      console.error("Gagal mengambil RFC approvals", error);
    }
  };

  useEffect(() => {
    fetchDaftarApprovals();
  }, []);

  /* =======================
     SUMMARY COUNTS
  ======================== */
  const summary = {
    pending: rfcApprovals.filter(a => a.decision === null).length,
    approved: rfcApprovals.filter(a => a.decision === "approved").length,
    rejected: rfcApprovals.filter(a => a.decision === "rejected").length,
    accepted: rfcApprovals.filter(a => a.rfc?.status === "approved").length,
  };

  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">
      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="px-10 py-8">
          {/* ================= WELCOME ================= */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-3xl font-semibold text-gray-900">
              {displayName}
            </h1>
          </div>

          {/* ================= SUMMARY CARDS ================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Status Approval</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard title="Ditunggu" value={summary.pending} />
              <SummaryCard title="Disetujui" value={summary.approved} />
              <SummaryCard title="Ditolak" value={summary.rejected} />
              <SummaryCard title="Diterima" value={summary.accepted} />
            </div>
          </div>

          {/* ================= DAFTAR RFC ================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Daftar RFC</h2>
              <Link
                to="/Kasi/DaftarApprovalKasi"
                className="text-sm text-[#02294A] font-semibold hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-4">
              {rfcApprovals.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 border rounded-xl p-4 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.decision === "approved"
                          ? "bg-green-500"
                          : item.decision === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-400"
                      }`}
                    />

                    <div>
                      <p className="font-medium text-sm">
                        {item?.rfc?.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          RFC #{item?.rfc?.id}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          {new Date(item?.rfc?.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/Kasi/DetailApprovalKasi/${item?.rfc?.id}`}
                    className="text-xs font-medium text-[#005BBB] hover:underline"
                  >
                    Cek Detail
                  </Link>
                </div>
              ))}

              {rfcApprovals.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Tidak ada data RFC
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =======================
   COMPONENT CARD
======================== */
const SummaryCard = ({ title, value }) => (
  <div className="bg-gray-50 rounded-xl p-6 text-center border">
    <p className="text-sm text-gray-600 mb-2">{title}</p>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

export default DashboardKasi;
