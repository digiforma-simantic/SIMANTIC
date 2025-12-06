import React, { useState } from "react";
import Headerdetailaset from "../../components/Admin/Headerdetas";

export default function DetailAset() {
  const [formData, setFormData] = useState({
    ciCode: "",
    versi: "",
    os: "",
    ip: "",
    relasi: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // cegah reload halaman
    console.log("Data terkirim:", formData);
    alert("Data berhasil dikirim!");
  };

  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">

      {/* Header */}
      <Headerdetailaset />

      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">

        {/* --- ASSET TITLE CARD --- */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 flex flex-col justify-center border border-gray-200 h-38">
          <h2 className="text-lg font-semibold text-[#001729] mb-1">Laptop M-25-001</h2>
        </div>

        {/* --- LEFT INFO CARD --- */}
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
            <p className="text-gray-500 text-sm">Gedung A, Lantai 5</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Risiko</p>
            <p className="text-gray-500 text-sm">Low</p>
          </div>
        </div>

        {/* --- RIGHT FORM --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6"
        >

          {/* CI CODE */}
          <div>
            <p className="font-semibold text-[#001729] mb-1">CI Code</p>
            <input
              type="text"
              name="ciCode"
              value={formData.ciCode}
              onChange={handleChange}
              placeholder="Masukkan CI Code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          {/* VERSI */}
          <div>
            <p className="font-semibold text-[#001729] mb-1">Versi</p>
            <input
              type="text"
              name="versi"
              value={formData.versi}
              onChange={handleChange}
              placeholder="Masukkan versi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          {/* OS */}
          <div>
            <p className="font-semibold text-[#001729] mb-1">OS (Operating System)</p>
            <input
              type="text"
              name="os"
              value={formData.os}
              onChange={handleChange}
              placeholder="Masukkan Operating System"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          {/* IP */}
          <div>
            <p className="font-semibold text-[#001729] mb-1">IP Address</p>
            <input
              type="text"
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              placeholder="Masukkan IP Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          {/* RELASI */}
          <div>
            <p className="font-semibold text-[#001729] mb-1">Relasi Antar Aset</p>
            <textarea
              name="relasi"
              value={formData.relasi}
              onChange={handleChange}
              placeholder="Masukkan relasi aset"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            ></textarea>
          </div>

          {/* BUTTON KIRIM (right aligned) */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#FF7900] text-white px-6 py-2 rounded-lg hover:bg-[#e76700] text-sm font-semibold"
            >
              Kirim
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
