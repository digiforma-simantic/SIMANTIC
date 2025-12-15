import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Headerdetailaset from "../../components/Diskominfo/Headerdetapp";
import { rfcAPI } from "../../services/api";
import { ssoUserApi } from "../../services/ssoUser";


export default function DetailPengajuan() {
  const navigate = useNavigate();
  const [selectedTeknisi, setSelectedTeknisi] = useState("");
  const [rfc, setRfc] = useState([]);
  const [ssoUser, setSsoUser] = useState(null);
  const [modalButuhInfo, setModalButuhInfo] = useState(false);

  const id = window.location.pathname.split("/").pop();

  const fetchSsoUser = async (id) => {
    try {
      const response = await ssoUserApi.getById(id);
      setSsoUser(response.data.data)
    } catch (error) {
      console.error("Error fetching SSO user ID:", error);
    }
  };

  const fetchRfcs = async () => {
    try {
      const response = await rfcAPI.getById(id);
      setRfc(response.data);
      fetchSsoUser(response.data.sso_id);
    } catch (error) {
      console.error("Error fetching RFC details:", error);
    }
  };

  useEffect(() => {
    fetchRfcs();
  }, []);

  const submitButuhInfo = async () => {
    const response  = await rfcAPI.update(rfc.id, { reason: rfc.butuh_info });
    if (!response.success) {
      alert("Gagal mengirim butuh info: ", response);
    } else {
      alert("Berhasil mengirim butuh info");
      setModalButuhInfo(false);
      fetchRfcs();
    }
  };

  const handleApprove = async () => {
    try {
      const approvalId = rfc.approval_id || rfc.id;
      const approvedAt = new Date().toISOString();
      const response = await rfcAPI.update(approvalId, {
        decision: "approved",
        reason: null,
        approved_at: approvedAt
      });
      if (!response.success) {
        alert('Gagal menyetujui RFC');
      } else {
        alert('RFC berhasil disetujui!');
        fetchRfcs();
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menyetujui RFC');
    }
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

        {/* MODAL - Butuh Info */}
        {modalButuhInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#00213A] rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-3 text-white">Keterangan</h2>
              <textarea
                onChange={(e) => setRfc({ ...rfc, butuh_info: e.target.value })}
                className="w-full bg-white border-none rounded-md p-3 mb-5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows="6"
                placeholder="Tuliskan Keterangan"
                style={{ resize: 'none' }}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalButuhInfo(false)}
                  className="bg-[#C82333] hover:bg-[#a71d2a] text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  onClick={submitButuhInfo}
                  className="bg-[#28A745] hover:bg-[#218838] text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setModalButuhInfo(true)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Butuh Info
          </button>
          <button
            onClick={handleApprove}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Setujui
          </button>
        </div>
      </main>
    </div>
  );
}