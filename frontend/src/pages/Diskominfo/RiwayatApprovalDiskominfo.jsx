import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headerdetailaset from "../../components/Diskominfo/Headerriapp";

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
              <p className="text-gray-600 text-sm">Budi Santoso</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}