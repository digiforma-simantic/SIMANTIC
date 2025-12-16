import React, { useEffect, useState } from "react";
import Headerdetapp from "../../components/Kasi/Headerdetapp";
import { FileText } from "lucide-react";
import { rfcAPI } from "../../services/api";
import { ssoUserApi } from "../../services/ssoUser";

const DetailApprovalKasi = () => {
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
      setRfc(response.data?.rfc);
      fetchSsoUser(response.data?.rfc?.sso_id);
    } catch (error) {
      console.error("Error fetching RFC details:", error);
    }
  };

  useEffect(() => {
    fetchRfcs();
  }, []);

  const forwardRfc = async (id) => {
    console.log("Forwarding RFC ID:", id);
    const response  = await rfcAPI.set(id, { level: "kepala_bidang", user_id: ssoUser.id });
    
    if (response.message !== "success") {
      alert("Gagal meneruskan RFC: ", response);
    } else {
      window.location.href = "/Kasi/dashboardkasi";
      alert("Berhasil meneruskan RFC");
    }
  };

  const submitButuhInfo = async () => {
    console.log("Submitting butuh info:", rfc.butuh_info);
    const response  = await rfcAPI.update(rfc.id, { reason: rfc.butuh_info });

    if (!response.success) {
      alert("Gagal mengirim butuh info: ", response);
    } else {
      alert("Berhasil mengirim butuh info");
      setModalButuhInfo(false);
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
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-[#0B2847] rounded-xl shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-white text-lg font-semibold mb-2">Keterangan</h2>
                <textarea
                  className="w-full rounded-md p-3 mb-5 text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="Tuliskan Keterangan"
                  rows={5}
                  value={rfc.butuh_info || ""}
                  onChange={e => setRfc({ ...rfc, butuh_info: e.target.value })}
                  style={{ resize: "none" }}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModalButuhInfo(false)}
                    className="bg-[#D32F2F] hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={submitButuhInfo}
                    className="bg-[#03B75F] hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
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
                {ssoUser?.name}
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
              <button className="w-full bg-[#03B344] hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
                Setujui
              </button>

              {/* Teruskan */}
              <button onClick={() => forwardRfc(rfc.id)} className="w-full bg-[#FF7A00] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition">
                Teruskan
              </button>

            </div>
          </div>

          {/* RIGHT CARD - DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            {/* Judul RFC */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{rfc?.title}</h3>
              <p className="text-gray-500">{ssoUser?.dinas}</p>
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
                {rfc?.description}
              </p>
            </div>

            {/* Prioritas */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prioritas</h3>
              <p className="text-gray-600">{rfc?.priority}</p>
            </div>

            {/* File Bukti */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">File Bukti</h3>
              {rfc?.attachment_path?.map((file, index) => (
                <a key={index} href={file} target="_blank" rel="noopener noreferrer">
                  <div key={index} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer mb-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">File {index + 1}</span>
                  </div>
                </a>
              ))}
              {/* <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Dokumen Plr.File</span>
              </div> */}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailApprovalKasi;