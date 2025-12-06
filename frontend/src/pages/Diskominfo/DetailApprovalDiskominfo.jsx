import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headerdetailaset from "../../components/Diskominfo/Headerdetapp";

export default function DetailPengajuan() {
  const navigate = useNavigate();
  const [selectedTeknisi, setSelectedTeknisi] = useState("");

  const handleButuhInfo = () => {
    // Logic untuk butuh info
    console.log("Butuh Info clicked");
  };

  const handleSetujui = () => {
    // Logic untuk setujui
    console.log("Setujui clicked");
  };

  const handleTolak = () => {
    // Logic untuk tolak
    console.log("Tolak clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <Headerdetailaset />

      {/* Konten utama */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card Kiri - Informasi Pengaju */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Slamet Budianto</h2>
            <p className="text-gray-500 text-sm mb-6">Staff Dinas Kesehatan</p>
          </div>

          {/* Card Tengah - Detail RFC */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Judul RFC</h3>
              <p className="text-gray-600 text-sm">Pembaruan Aplikasi E-Kinerja</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Aset Terdampak</h3>
              <p className="text-gray-600 text-sm">Hardware</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Deskripsi Perubahan</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Diperlukan pembaruan pada modul pelaporan kinerja agar sesuai dengan format terbaru dari BKN
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Prioritas</h3>
              <p className="text-gray-600 text-sm">Pembaruan Aplikasi E-Kinerja</p>
            </div>
          </div>

          {/* Card Kanan - File Bukti & Jadwal */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">File Bukti</h3>
              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded">
                Low
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Jadwal</h3>
              <p className="text-gray-600 text-sm">12 Desember 2025</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Teknisi</h3>
              <div className="relative">
                <select
                  value={selectedTeknisi}
                  onChange={(e) => setSelectedTeknisi(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih teknisi yang tersedia</option>
                  <option value="teknisi1">Ahmad Rizki - Network Specialist</option>
                  <option value="teknisi2">Budi Santoso - System Administrator</option>
                  <option value="teknisi3">Citra Dewi - Hardware Technician</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleButuhInfo}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Butuh Info
          </button>
          <button
            onClick={handleSetujui}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Setujui
          </button>
          <button
            onClick={handleTolak}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Tolak
          </button>
        </div>
      </main>
    </div>
  );
}