import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Headerdetailaset from "../../components/Headerdetailaset";
import { configItemsAPI } from "../../services/api";

export default function DetailAset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssetDetail() {
      try {
        const response = await configItemsAPI.getById(id);
        setAsset(response.data || response);
      } catch (error) {
        console.error('Error fetching asset detail:', error);
        alert('Gagal memuat detail aset');
      } finally {
        setLoading(false);
      }
    }
    fetchAssetDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7FCFF] items-center justify-center">
        <p className="text-gray-500">Memuat detail aset...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex min-h-screen bg-[#F7FCFF] items-center justify-center">
        <p className="text-red-500">Aset tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">

      {/* Header yang diambil dari components */}
      <Headerdetailaset />

      {/* Konten utama */}
      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">

        {/* Card Identitas Aset */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 flex flex-col justify-center border border-gray-200 h-38">
          <h2 className="text-lg font-semibold text-[#001729] mb-1">
            {asset.name || asset.ci_code}
          </h2>
          <h4 className="text-lg font-semibold text-[#001729] mb-1">
            {asset.ci_code || asset.id}
          </h4>
        </div>

        {/* Card Informasi Kiri */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">Penanggung Jawab</p>
            <p className="text-gray-500 text-sm">{asset.owner || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Status Aset</p>
            <p className="text-gray-500 text-sm">
              {asset.status === 'active' ? 'Aktif' : asset.status === 'inactive' ? 'Tidak Aktif' : asset.status || '-'}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Kategori Aset</p>
            <p className="text-gray-500 text-sm">
              {asset.type === 'hardware' ? 'Hardware' : 
               asset.type === 'software' ? 'Software' : 
               asset.type === 'network' ? 'Network' : 
               asset.type === 'server' ? 'Server' : 
               asset.type === 'aplikasi' ? 'Aplikasi' : asset.type || '-'}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Lokasi Aset</p>
            <p className="text-gray-500 text-sm">{asset.location || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Risiko</p>
            <p className="text-gray-500 text-sm">
              {asset.criticality === 'critical' ? 'Critical' :
               asset.criticality === 'high' ? 'High' :
               asset.criticality === 'medium' ? 'Medium' :
               asset.criticality === 'low' ? 'Low' : asset.criticality || '-'}
            </p>
          </div>
        </div>

        {/* Card Informasi Kanan */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">CI Code</p>
            <p className="text-gray-500 text-sm">{asset.ci_code || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Versi</p>
            <p className="text-gray-500 text-sm">{asset.version || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">OS (Operation System)</p>
            <p className="text-gray-500 text-sm">{asset.os_name || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">IP Address</p>
            <p className="text-gray-500 text-sm">{asset.ip_address || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Relasi Antar Aset</p>
            <p className="text-gray-500 text-sm">
              {asset.relation_note || '-'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
