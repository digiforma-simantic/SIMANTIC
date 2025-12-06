import React from "react";
import Headerdetapp from "../../components/Kabid/Headerdetapp";
import { FileText } from "lucide-react";

const DetailApprovalKabid = () => {
  return (
    <div className="min-h-screen bg-[#F7FCFF]">

      {/* HEADER */}
      <Headerdetapp />

      {/* CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT CARD - INFO & ACTION BUTTONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            
            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Slamet Budianto
              </h2>
              <p className="text-gray-500">#0001</p>
            </div>

            {/* ACTION BUTTONS (2×2 GRID) */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Butuh Info */}
              <button className="w-full bg-[#1E63F8] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                Butuh Info
              </button>

              {/* Setujui */}
              <button className="w-full bg-[#03B344] hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
                Setujui
              </button>

              {/* Tolak */}
              <button className="w-full bg-[#B30000] hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition">
                Tolak
              </button>

              {/* Teruskan */}
              <button className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition">
                Teruskan
              </button>

            </div>
          </div>

          {/* RIGHT CARD - DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            {/* Judul RFC */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Judul RFC</h3>
              <p className="text-gray-500">Staff Dinas Kesehatan</p>
            </div>

            {/* Aset Terdampak */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aset Terdampak</h3>
              <p className="text-gray-600">Komputer</p>
            </div>

            {/* Deskripsi Permintaan */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Permintaan</h3>
              <p className="text-gray-600 leading-relaxed">
                Diperlukan pembaruan pada modul pelaporan kinerja agar sesuai dengan 
                format terbaru dari BKN.
              </p>
            </div>

            {/* Prioritas */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prioritas</h3>
              <p className="text-gray-600">Low</p>
            </div>

            {/* File Bukti */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">File Bukti</h3>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Dokumen Plr.File</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailApprovalKabid;