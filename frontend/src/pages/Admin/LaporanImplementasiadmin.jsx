
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebaradmin";
import Header from "../../components/Admin/Headeradmin";
import { Link } from "react-router-dom";

function LaporanImplementasiAdmin() {
  // Hardcode data laporan implementasi
  const [laporan, setLaporan] = useState([
    {
      id: 1,
      title: "Implementasi SSO SIMANTIC",
      rfc_service_id: "RFC-001",
      rfc_id: "1001",
      status: "berhasil",
      description: "Integrasi SSO berjalan lancar tanpa kendala.",
      attachments: [
        "https://example.com/attachment1.pdf",
        "https://example.com/attachment2.png"
      ],
      completed_at: "2025-12-10 14:30:00"
    },
    {
      id: 2,
      title: "Upgrade Database Server",
      rfc_service_id: "RFC-002",
      rfc_id: "1002",
      status: "gagal",
      description: "Upgrade gagal karena masalah kompatibilitas versi.",
      attachments: [],
      completed_at: "2025-12-12 09:00:00"
    },
    {
      id: 3,
      title: "Maintenance Jaringan",
      rfc_service_id: "RFC-003",
      rfc_id: "1003",
      status: "butuh maintanance",
      description: "Ditemukan potensi gangguan, perlu maintenance lanjutan.",
      attachments: ["https://example.com/attachment3.jpg"],
      completed_at: "2025-12-14 16:00:00"
    }
  ]);
  const [loading] = useState(false);

  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">
      {/* SIDEBAR */}
      <Sidebar />
      {/* MAIN */}
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        {/* HEADER */}
        <Header />
        {/* CONTENT */}
        <div className="p-6">
          <div className="bg-white shadow-sm rounded-xl border border-[#E6EEF7] p-6">
            {/* TITLE */}
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Laporan Implementasi ({laporan.length})
            </h2>
            {/* GRID LIST */}
            {loading ? (
              <p className="text-center text-gray-500 py-8">Memuat data...</p>
            ) : laporan.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada laporan implementasi</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {laporan.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#F9FCFF] border border-[#E6EEF7] rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* STATUS ICON */}
                      <span className={`w-3 h-3 rounded-full ${
                        item.status === 'berhasil' ? 'bg-green-500' : 
                        item.status === 'gagal' ? 'bg-red-500' : 
                        'bg-orange-500'
                      }`}></span>
                      {/* TITLE + INFO */}
                      <div>
                        <p className="font-semibold text-gray-900">{item.title || `RFC ID: ${item.rfc_id}`}</p>
                        <p className="text-xs text-gray-500">
                          RFC Service ID: {item.rfc_service_id} • {item.completed_at}
                        </p>
                        <p className="text-xs font-medium text-gray-700 mt-1">
                          Status: <span className={
                            item.status === 'berhasil' ? 'text-green-600' : 
                            item.status === 'gagal' ? 'text-red-600' : 'text-orange-600'}>
                            {item.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* CTA */}
                    <Link
                      to={`/Admin/DetailLaporanImplementasiadmin/${item.id}`}
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Cek Detail
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaporanImplementasiAdmin;
