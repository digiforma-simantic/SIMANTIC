import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const DashboardStaff = () => {
  // Ambil user dari localStorage hasil login SSO
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [rfcs, setRfcs] = useState([]);
  const [stats, setStats] = useState({ total: 0, gagal: 0, proses: 0, berhasil: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  useEffect(() => {
    async function fetchStaffData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch RFC yang dibuat oleh staff ini
        const response = await axios.get(`${API_BASE_URL}/api/v1/rfc`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data.data || [];
        setRfcs(data);

        // Hitung statistik
        const total = data.length;
        const gagal = data.filter(r => r.status === 'rejected').length;
        const berhasil = data.filter(r => r.status === 'approved').length;
        const proses = data.filter(r => r.status === 'pending').length;

        setStats({ total, gagal, proses, berhasil });
      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      fetchStaffData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4FAFF]">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4FAFF] font-geologica">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">

        {/* HEADER */}
        <Header />

        {/* BODY CONTENT */}
        <div className="px-6 py-6">

          {/* Welcome */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user?.name || "-"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{user?.roleName || user?.role} - {user?.dinas || "N/A"}</p>
          </div>

          {/* STATUS PERUBAHAN */}
          <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Status Perubahan</h2>

            {loadingData ? (
              <p className="text-center text-gray-500 py-4">Memuat statistik...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total", value: stats.total, color: "#001B33" },
                  { label: "Gagal", value: stats.gagal, color: "#C0392B" },
                  { label: "Proses", value: stats.proses, color: "#E67E22" },
                  { label: "Berhasil", value: stats.berhasil, color: "#27AE60" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#F7FBFF] rounded-xl border border-[#E6EEF7] flex flex-col items-center justify-center py-4"
                  >
                    <span className="text-xs text-gray-500 mb-1">{item.label}</span>
                    <span
                      className="text-3xl font-semibold"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PANTAU STATUS */}
          <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Pantau Status</h2>

            {loadingData ? (
              <p className="text-center text-gray-500 py-4">Memuat data RFC...</p>
            ) : rfcs.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada RFC yang diajukan</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {rfcs.slice(0, 6).map((rfc) => {
                  const statusColor = 
                    rfc.status === 'approved' ? 'bg-green-500' :
                    rfc.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500';
                  
                  return (
                    <div
                      key={rfc.id}
                      className="flex items-center justify-between bg-[#F7FBFF] border border-[#E6EEF7] rounded-xl px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-2 w-3 h-3 rounded-full ${statusColor}`} />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {rfc.title || 'Tanpa Judul'}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            #{rfc.rfc_service_id || rfc.id} &nbsp;&nbsp; {new Date(rfc.created_at).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </div>

                      {/* Navigasi */}
                      <Link
                        to={`/DetailPengajuanStaff/${rfc.id}`}
                        className="text-xs font-semibold text-[#005BBB] hover:underline"
                      >
                        Cek Detail
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardStaff;
