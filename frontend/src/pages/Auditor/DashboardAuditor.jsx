import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebaradmin from "../../components/Auditor/Sidebarauditor";
import Headeradmin from "../../components/Auditor/Headerauditor";

const DashboardAuditor = () => {
  // Data untuk Patch Compliance
  const patchCompliance = [
    { id: 1, status: 'Compliance', name: 'Dinas Kehutanan', period: 'Q4 2025', badge: 'Compliance', badgeColor: 'bg-blue-900' },
    { id: 2, status: 'Compliance', name: 'Diskominfo', period: 'Q4 2025', badge: 'Compliance', badgeColor: 'bg-blue-900' },
    { id: 3, status: 'Non-Compliance', name: 'Dinas Kesehatan', period: 'Q4 2025', badge: 'Non-Compliance', badgeColor: 'bg-red-700' },
  ];

  // Data untuk Change Summary
  const changeSummary = [
    { id: 1, priority: 'Low', name: 'Migrasi Aplikasi Antrian RSUD', rfcNumber: '#RFC-0001', date: '17 Agustus 2025', badgeColor: 'bg-blue-900' },
    { id: 2, priority: 'Medium', name: 'Upgrade Server Database SPBE', rfcNumber: '#RFC-0001', date: '17 Agustus 2025', badgeColor: 'bg-orange-600' },
    { id: 3, priority: 'High', name: 'Patch Emergency CVE-2025-1234', rfcNumber: '#RFC-0001', date: '17 Agustus 2025', badgeColor: 'bg-red-600' },
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
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">
      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="px-10 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-3xl font-semibold text-gray-900">{user?.name || "-"}</h1>
          </div>

          {/* Status Approval Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#001B33] mb-6">Status Approval</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Compliant</p>
                <p className="text-4xl font-bold text-gray-900">9</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Non-Compliant</p>
                <p className="text-4xl font-bold text-gray-900">7</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Change Direview</p>
                <p className="text-4xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          {/* Grid untuk Patch Compliance dan Change Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Patch Compliance */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#001B33]">Patch Compliance</h2>
                <Link
                  to="/Auditor/PatchCompliance"
                  className="text-sm text-[#02294A] font-semibold hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>            

              <div className="space-y-4">
                {patchCompliance.map((item) => (
                  <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`${item.badgeColor} text-white text-xs font-medium px-3 py-1 rounded`}>
                        {item.badge}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-gray-900 mb-1">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.period}</p>
                      </div>

                      <Link 
                        to={`/Auditor/DetailPatchCompliance/${item.id}`} 
                        className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
                      >
                        Cek Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#001B33]">Change Summary</h2>
                <Link
                  to="/Auditor/ChangeSummary"
                  className="text-sm text-[#02294A] font-semibold hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="space-y-4">
                {changeSummary.map((item) => (
                  <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`${item.badgeColor} text-white text-xs font-medium px-3 py-1 rounded`}>
                        {item.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-gray-900 mb-1">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">{item.rfcNumber}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>

                      <Link 
                        to={`/Auditor/DetailChangeSummary/${item.id}`} 
                        className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
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
    </div>
  );
};

export default DashboardAuditor;