
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Headerdetailaset from "../../components/Admin/Headerdetas";
import { assetsAPI } from "../../services/assetsApi";

export default function DetailAset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAsset() {
      try {
        const data = await assetsAPI.getById(id);
        setAsset(data);
      } catch {
        setAsset(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAsset();
  }, [id]);


  // Data dummy jika asset null
  const dummyAsset = {
    nama: "Laptop M-25-001",
    aset_uuid: "123e4567-e89b-12d3-a456-426614174000",
    lokasi: "Ruang IT, Lantai 2",
    penanggung_jawab: "Budi Santoso",
    sub_kategori: "Laptop",
    level_resiko: "Sedang",
    created_at: "2025-12-14T08:00:00Z",
    ci_code: "CI-2025-001",
    versi: "2025.1",
    os: "Windows 11 Pro",
    ip_address: "192.168.1.25",
    relasi_aset: "Printer M-25-002, Switch-IT-01"
  };

  const showAsset = asset || dummyAsset;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat detail aset...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      <Headerdetailaset />
      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">
        {/* Card Identitas Aset */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 flex flex-col justify-center border border-gray-200 h-38">
          <h2 className="text-lg font-semibold text-[#001729] mb-1">
            {showAsset.nama}
          </h2>
          <h4 className="text-lg font-semibold text-[#001729] mb-1">{showAsset.aset_uuid}</h4>
        </div>

        {/* Card Informasi Kiri */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">Lokasi Aset</p>
            <p className="text-gray-500 text-sm">{showAsset.lokasi || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Penanggung Jawab</p>
            <p className="text-gray-500 text-sm">{showAsset.penanggung_jawab || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Sub Kategori</p>
            <p className="text-gray-500 text-sm">{showAsset.sub_kategori || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Level Risiko</p>
            <p className="text-gray-500 text-sm">{showAsset.level_resiko || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Tanggal Input</p>
            <p className="text-gray-500 text-sm">{showAsset.created_at ? new Date(showAsset.created_at).toLocaleString('id-ID') : '-'}</p>
          </div>
        </div>

        {/* Card Informasi Kanan (Dummy data jika asset null) */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">CI Code</p>
            <p className="text-gray-500 text-sm">{showAsset.ci_code || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Versi</p>
            <p className="text-gray-500 text-sm">{showAsset.versi || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">OS (Operation System)</p>
            <p className="text-gray-500 text-sm">{showAsset.os || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">IP Address</p>
            <p className="text-gray-500 text-sm">{showAsset.ip_address || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Relasi Antar Aset</p>
            <p className="text-gray-500 text-sm">{showAsset.relasi_aset || '-'}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
