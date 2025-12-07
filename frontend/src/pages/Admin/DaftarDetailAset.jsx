import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Headerdetailaset from "../../components/Admin/Headerdetas";
import { configItemsAPI } from "../../services/api";

export default function DetailAset() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ci, setCi] = useState(null);

  useEffect(() => {
    async function fetchConfigItem() {
      try {
        const response = await configItemsAPI.getById(id);
        setCi(response.data || response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching CI:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    if (id) {
      fetchConfigItem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FCFF] font-geologica">
        <Headerdetailaset />
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || !ci) {
    return (
      <div className="min-h-screen bg-[#F7FCFF] font-geologica">
        <Headerdetailaset />
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500">Error: {error || "Data tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  const riskLabels = {
    1: "Very Low",
    2: "Low",
    3: "Medium",
    4: "High",
    5: "Critical"
  };

  const statusLabels = {
    active: "Aktif",
    inactive: "Tidak Aktif",
    maintenance: "Maintenance",
    retired: "Retired"
  };

  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">

      {/* Header yang diambil dari components */}
      <Headerdetailaset />

      {/* Konten utama */}
      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">

        {/* Card Identitas Aset */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 flex flex-col justify-center border border-gray-200 h-38">
          <h2 className="text-lg font-semibold text-[#001729] mb-1">
            {ci.name}
          </h2>
          <Link 
            to={`/FormDetailAset/${id}`}
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            Edit Detail →
          </Link>
        </div>

        {/* Card Informasi Kiri */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">Penanggung Jawab</p>
            <p className="text-gray-500 text-sm">{ci.penanggung_jawab || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Status Aset</p>
            <p className="text-gray-500 text-sm">{statusLabels[ci.status] || ci.status || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Kategori Aset</p>
            <p className="text-gray-500 text-sm">{ci.subkategori || ci.type || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Lokasi Aset</p>
            <p className="text-gray-500 text-sm">{ci.lokasi || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Risiko</p>
            <p className="text-gray-500 text-sm">{riskLabels[ci.risk_level] || "-"}</p>
          </div>
        </div>

        {/* Card Informasi Kanan */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">CI Code</p>
            <p className="text-gray-500 text-sm">{ci.ci_code || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Versi</p>
            <p className="text-gray-500 text-sm">{ci.version || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">OS (Operation System)</p>
            <p className="text-gray-500 text-sm">{ci.os_name || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">IP Address</p>
            <p className="text-gray-500 text-sm">{ci.ip_address || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Relasi Antar Aset</p>
            <p className="text-gray-500 text-sm">
              {ci.relation_note || "-"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
