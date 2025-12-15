
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Diskominfo/Sidebardiskominfo";
import Header from "../../components/Diskominfo/Headerdiskominfo";

const RiwayatApprovalDiskominfo = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Semua");

  const approvals = [
    { id: 1, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", status: "Disetujui" },
    { id: 2, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", status: "Disetujui" },
    { id: 3, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", status: "Ditolak" },
    { id: 4, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", status: "Butuh Info" }
  ];

  const filters = [
    { label: "Semua", value: "Semua" },
    { label: "Disetujui", value: "Disetujui" },
    { label: "Ditolak", value: "Ditolak" },
    { label: "Butuh Info", value: "Butuh Info" }
  ];

  const filteredApprovals = activeFilter === "Semua" 
    ? approvals 
    : approvals.filter(item => item.status === activeFilter);

  const getStatusColor = (status) => {
    switch(status) {
      case "Disetujui": return "bg-green-500";
      case "Ditolak": return "bg-red-500";
      case "Butuh Info": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getButtonStyle = (filter) => {
    if (activeFilter === filter) {
      return "bg-green-600 text-white shadow-md";
    }
    
    switch(filter) {
      case "Disetujui": return "bg-white text-green-600 border border-green-600 hover:bg-green-50";
      case "Ditolak": return "bg-white text-red-600 border border-red-600 hover:bg-red-50";
      case "Butuh Info": return "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50";
      default: return "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <Sidebar isOpen={true} />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-0 md:ml-64">
        {/* HEADER */}
        <Header />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* SEARCH BAR DIHAPUS */}

          {/* RIWAYAT APPROVAL SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Riwayat Approval</h2>

            {/* FILTER BUTTONS */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${getButtonStyle(filter.value)}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* LIST */}
            <div className="space-y-4">
              {filteredApprovals.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Status Indicator Dot */}
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)} shrink-0`}></div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-base text-gray-900 mb-1">{item.title}</p>
                        <div className="flex items-center gap-2 text-gray-500">
                          <p className="text-sm">{item.rfcNumber}</p>
                          <span className="text-sm">•</span>
                          <p className="text-sm">{item.date}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/Diskominfo/RiwayatApprovalDiskominfo/${item.id}`)}
                      className="text-sm font-medium text-gray-900 hover:underline whitespace-nowrap ml-4"
                    >
                      Cek Detail
                    </button>
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

export default RiwayatApprovalDiskominfo;