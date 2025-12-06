import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebarkadis from "../../components/Kadis/Sidebarkadis";
import Headerkadis from "../../components/Kadis/Headerkadis";

const RiwayatApprovalKadis = () => {
  const navigate = useNavigate();

  const approvals = [
    { id: 1, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "approved", color: "bg-green-500" },
    { id: 2, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "pending", color: "bg-blue-500" },
    { id: 3, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "approved", color: "bg-green-500" },
    { id: 4, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "pending", color: "bg-blue-500" },
    { id: 5, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "rejected", color: "bg-red-500" },
    { id: 6, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "pending", color: "bg-blue-500" },
    { id: 7, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "pending", color: "bg-blue-500" },
    { id: 8, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "warning", color: "bg-orange-500" },
    { id: 9, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "warning", color: "bg-orange-500" },
    { id: 10, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "warning", color: "bg-orange-500" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">
      <Sidebarkadis />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headerkadis />

        <div className="px-10 py-8">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Title */}
            <h2 className="text-lg font-semibold text-[#001B33] mb-6">Riwayat Approval</h2>

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{item.code}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/Kadis/DetailPermohonanKadis/${item.id}`)}
                    className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
                  >
                    Cek Detail
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatApprovalKadis;