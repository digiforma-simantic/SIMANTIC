
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat detail aset...</div>;
  }
  if (!asset) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Aset tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      <Headerdetailaset />
      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">
        {/* Card Identitas Aset */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 flex flex-col justify-center border border-gray-200 h-38">
          <h2 className="text-lg font-semibold text-[#001729] mb-1">
            {asset.nama}
          </h2>
          <h4 className="text-lg font-semibold text-[#001729] mb-1">{asset.aset_uuid}</h4>
        </div>

        {/* Card Informasi Kiri */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">Lokasi Aset</p>
            <p className="text-gray-500 text-sm">{asset.lokasi || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Penanggung Jawab</p>
            <p className="text-gray-500 text-sm">{asset.penanggung_jawab || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Sub Kategori</p>
            <p className="text-gray-500 text-sm">{asset.sub_kategori || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Level Risiko</p>
            <p className="text-gray-500 text-sm">{asset.level_resiko || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Tanggal Input</p>
            <p className="text-gray-500 text-sm">{asset.created_at ? new Date(asset.created_at).toLocaleString('id-ID') : '-'}</p>
          </div>
        </div>

        {/* Card Informasi Kanan (Placeholder untuk data CI jika sudah dikonfigurasi) */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">CI Code</p>
            <p className="text-gray-500 text-sm">-</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Versi</p>
            <p className="text-gray-500 text-sm">-</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">OS (Operation System)</p>
            <p className="text-gray-500 text-sm">-</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">IP Address</p>
            <p className="text-gray-500 text-sm">-</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Relasi Antar Aset</p>
            <p className="text-gray-500 text-sm">-</p>
          </div>
        </div>
      </main>
    </div>
  );
}
