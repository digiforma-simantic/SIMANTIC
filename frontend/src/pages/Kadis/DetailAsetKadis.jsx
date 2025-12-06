import React from "react";
import { Link } from "react-router-dom";
import Headerdetailaset from "../../components/Kadis/Headerdetas";

export default function DetailAset() {
  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">

      {/* Header yang diambil dari components */}
      <Headerdetailaset />

      {/* Konten utama */}
      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">

        {/* Card Identitas Aset */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 flex flex-col justify-center border border-gray-200 h-38">
          <h2 className="text-lg font-semibold text-[#001729] mb-1">
            Laptop M-25-001
          </h2>
          <h4 className="text-lg font-semibold text-[#001729] mb-1">0001</h4>
        </div>s

        {/* Card Informasi Kiri */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">Penanggung Jawab</p>
            <p className="text-gray-500 text-sm">Suhandoyo</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Status Aset</p>
            <p className="text-gray-500 text-sm">Aktif</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Kategori Aset</p>
            <p className="text-gray-500 text-sm">Hardware</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Lokasi Aset</p>
            <p className="text-gray-500 text-sm">Gedung A, Lantai 5, Area Karyawan</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Risiko</p>
            <p className="text-gray-500 text-sm">Low</p>
          </div>
        </div>

        {/* Card Informasi Kanan */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">CI Code</p>
            <p className="text-gray-500 text-sm">CI-000245</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Versi</p>
            <p className="text-gray-500 text-sm">Firmware BIOS v1.14.2</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">OS (Operation System)</p>
            <p className="text-gray-500 text-sm">Windows 11 Pro 64-bit</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">IP Address</p>
            <p className="text-gray-500 text-sm">10.10.5.123</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Relasi Antar Aset</p>
            <p className="text-gray-500 text-sm">
              Laptop ini terhubung ke Server Active Directory dan Printer Jaringan Lantai 5
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
