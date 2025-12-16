import React, { useEffect, useState } from "react";
import Headerdetapp from "../../components/Kabid/Headerdetapp";
import { FileText } from "lucide-react";
import { rfcAPI, rfcApprovalAPI } from "../../services/api";
import { ssoUserApi } from "../../services/ssoUser";

const DetailApprovalKabid = () => {
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
      const response  = await rfcAPI.set(id, { level: "kepala_dinas", user_id: ssoUser.id });
      
      if (response.message !== "success") {
        alert("Gagal meneruskan RFC: ", response);
      } else {
        window.location.href = "/Kabid/dashboardkabid";
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

          {/* LEFT CARD - INFO & ACTION BUTTONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            
            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {ssoUser?.name || "Nama Pengguna"}
              </h2>
              <p className="text-gray-500">{rfc?.id}</p>
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
              <p className="text-gray-500">{rfc?.created_at}</p>
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
              {rfc?.attachments?.map((file, index) => (
                <a key={index} href={file} target="_blank" rel="noopener noreferrer">
                  <div key={index} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer mb-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">File {index + 1}</span>
                  </div>
                </a>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailApprovalKabid;