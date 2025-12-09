import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import Headeradmin from "../../components/Admin/Headeradmin";
import { useAuth } from "../../contexts/AuthContext";

import tandaminus from "../../assets/tandaminusadmin.png";
import tandaseru from "../../assets/tandaseruadmin.png";

const DashboardAdmin = () => {
  const { user, loading } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const pantauStatus = [
    { id: 1, status: "approved", color: "bg-green-500" },
    { id: 2, status: "pending", color: "bg-blue-500" },
    { id: 3, status: "pending", color: "bg-blue-500" },
  ];

  useEffect(() => {
    // Fetch approvals berdasarkan role user
    async function fetchApprovals() {
      try {
        // TODO: Implementasi fetch dari API
        // const response = await axios.get('/api/v1/rfcs/pending-approval');
        // setApprovals(response.data);
        
        // Sementara pakai dummy data
        setApprovals([
          { id: 1, title: "Install Aplikasi Kerja", date: "17 Agustus 2025", priority: "high" },
          { id: 2, title: "Update Server", date: "18 Agustus 2025", priority: "medium" },
        ]);
        setLoadingApprovals(false);
      } catch (error) {
        console.error("Error fetching approvals:", error);
        setLoadingApprovals(false);
      }
    }

    if (user) {
      fetchApprovals();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FCFF]">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">

      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">

        <Headeradmin />

        <div className="px-10 py-8">

          <div className="mb-8">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-3xl font-semibold text-gray-900">{user?.name || 'User'}</h1>
            <p className="text-sm text-gray-500 mt-1">{user?.roleName || user?.role} - {user?.dinas || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-6">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[#001B33]">Daftar Approval</h2>

                <Link
                  className="text-xs font-semibold text-[#005BBB] hover:underline"
                  to="/Admin/DaftarApproval"
                >
                  Lihat Semua
                </Link>
              </div>

              {loadingApprovals ? (
                <p className="text-center text-gray-500 py-4">Memuat data approval...</p>
              ) : approvals.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Tidak ada approval pending</p>
              ) : (
                <div className="space-y-4">
                  {approvals.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-[#F9FCFF] border border-[#E6EEF7] rounded-xl p-4">

                      <div className="flex items-start gap-3">
                        <img src={item.priority === 'high' ? tandaseru : tandaminus} className="w-5" />
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-[10px] text-gray-500">{item.date}</p>
                        </div>
                      </div>

                      <Link to={`/Admin/DetailPermohonan/${item.id}`} className="text-xs text-[#005BBB] hover:underline">
                        Cek Detail
                      </Link>

                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[#001B33]">Pantau Status</h2>
                <span className="text-xs text-gray-500">Admin saja</span>
              </div>

              <div className="space-y-4">
                {pantauStatus.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">Install Aplikasi Kerja</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">#000{item.id}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">17 Agustus 2025</p>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to={`/Admin/StatusPengajuan/${item.id}`} 
                      className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
                    >
                      Cek Status
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
