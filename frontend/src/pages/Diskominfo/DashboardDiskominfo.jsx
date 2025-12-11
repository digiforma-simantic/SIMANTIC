import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebardiskominfo from "../../components/Diskominfo/Sidebardiskominfo";
import Headerdiskominfo from "../../components/Diskominfo/Headerdiskominfo";

const DashboardDiskominfo = () => {
  // Data untuk Daftar Approval
  const approvalList = [
    { id: 1, priority: 'Low', name: 'Install Aplikasi Kerja', rfcNumber: '#RFC-001', date: '17 Agustus 2025', badgeColor: 'bg-[#1e3a5f]' },
    { id: 2, priority: 'Medium', name: 'Install Aplikasi Kerja', rfcNumber: '#RFC-001', date: '17 Agustus 2025', badgeColor: 'bg-[#1e3a5f]' },
    { id: 3, priority: 'High', name: 'Install Aplikasi Kerja', rfcNumber: '#RFC-001', date: '17 Agustus 2025', badgeColor: 'bg-[#1e3a5f]' },
  ];

  // Ambil user dari localStorage hasil login SSO
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

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebardiskominfo />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">

        {/* Header dengan nama user kanan atas */}
        <div className="flex items-center justify-between mb-4">
          <Headerdiskominfo />
          <div className="flex items-center gap-2">
            {/* ...icon search, bell, profile... */}
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-1">Selamat datang,</p>
            <h1 className="text-3xl font-bold text-gray-900">{(() => {
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                try {
                  const user = JSON.parse(storedUser);
                  return user?.name || "-";
                } catch {
                  return "-";
                }
              }
              return "-";
            })()}</h1>
          </div>

          {/* Status Approval Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Status Approval</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center">
                    <p className="text-sm text-gray-700 mb-2 font-medium">Ditunggu</p>
                    <p className="text-4xl font-bold text-gray-900">9</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center">
                    <p className="text-sm text-gray-700 mb-2 font-medium">Disetujui</p>
                    <p className="text-4xl font-bold text-gray-900">7</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center">
                    <p className="text-sm text-gray-700 mb-2 font-medium">Ditolak</p>
                    <p className="text-4xl font-bold text-gray-900">8</p>
                </div>
            </div>
          </div>

          {/* Daftar Approval */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Daftar Approval</h2>

              <Link
                to="/Diskominfo/DaftarApprovalDiskominfo"
                className="text-sm text-gray-900 font-medium hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-4">
              {approvalList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-3 flex-1">
                      <span
                        className={`${item.badgeColor} text-white text-[10px] font-semibold px-2.5 py-1 rounded`}
                      >
                        {item.priority}
                      </span>

                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 mb-1">
                          {item.name}
                        </p>

                        <div className="flex items-center gap-2 text-gray-500">
                          <p className="text-xs">{item.rfcNumber}</p>
                          <span className="text-xs">•</span>
                          <p className="text-xs">{item.date}</p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT (CEK DETAIL) */}
                    <Link
                      to={`/Diskominfo/DetailApprovalDiskominfo/${item.id}`}
                      className="text-sm font-medium text-gray-700 hover:underline whitespace-nowrap ml-4"
                    >
                      Cek Detail
                    </Link>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDiskominfo;
