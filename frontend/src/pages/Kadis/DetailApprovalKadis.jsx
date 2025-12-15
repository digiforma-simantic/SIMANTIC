import React, { useEffect, useState } from "react";
import Headerdetapp from "../../components/Kadis/Headerdetapp";
import { FileText } from "lucide-react";
import { rfcAPI } from "../../services/api";
import { ssoUserApi } from "../../services/ssoUser";

const DetailApprovalKadis = () => {
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

  // Helper untuk format tanggal ke 'YYYY-MM-DD HH:mm:ss'
  function formatDateTime(date) {
    const pad = (n) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + ' ' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes()) + ':' +
      pad(date.getSeconds());
  }

  const handleForward = async () => {
    try {
      const approvalId = rfc.approval_id || rfc.id;
      const updatedAt = formatDateTime(new Date());
      const response = await rfcAPI.update(approvalId, {
        decision: "pending",
        level: "admin_kota",
        reason: null,
        updated_at: updatedAt
      });
      if (!response.success) {
        alert('Gagal meneruskan RFC');
      } else {
        alert('RFC berhasil diteruskan ke Admin Kota!');
        fetchRfcs();
      }
    } catch (error) {
      alert('Terjadi kesalahan saat meneruskan RFC');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FCFF]">

      {/* HEADER */}
      <Headerdetapp />

      {/* CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

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

          {/* LEFT CARD - INFO & ACTION BUTTONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {ssoUser?.name || "-"}
              </h2>
              <p className="text-gray-500">#{rfc.id}</p>
            </div>

            {/* ACTION BUTTONS (2×2 GRID) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Butuh Info */}
              <button onClick={() => setModalButuhInfo(true)} className="w-full bg-[#1E63F8] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                Butuh Info
              </button>

              {/* Setujui */}
              <button
                className="w-full bg-[#03B344] hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                onClick={handleApprove}
              >
                Setujui
              </button>

              {/* Teruskan */}
              <button
                className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                onClick={handleForward}
              >
                Teruskan
              </button>

            </div>
          </div>

          {/* RIGHT CARD - DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            {/* Judul RFC */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{rfc?.title || "Judul RFC"}</h3>
              <p className="text-gray-500">{ssoUser?.dinas || "Staff Dinas Kesehatan"}</p>
            </div>

            {/* Aset Terdampak */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aset Terdampak</h3>
              <p className="text-gray-600">{rfc?.asset_affected || "Komputer"}</p>
            </div>

            {/* Deskripsi Permintaan */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Permintaan</h3>
              <p className="text-gray-600 leading-relaxed">
                {rfc?.description || "-"}
              </p>
            </div>

            {/* Prioritas */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prioritas</h3>
              <p className="text-gray-600">{rfc?.priority || "Low"}</p>
            </div>

            {/* File Bukti */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">File Bukti</h3>
              {rfc?.attachment_path?.map ? (
                rfc.attachment_path.map((file, index) => (
                  <a key={index} href={file} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer mb-2">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">File {index + 1}</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Dokumen Plr.File</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailApprovalKadis;