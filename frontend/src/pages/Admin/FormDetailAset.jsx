
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Headerdetailaset from "../../components/Admin/Headerdetas";
import { assetsAPI } from "../../services/assetsApi";
import axios from "axios";

export default function FormDetailAset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ci_code: "",
    versi: "",
    os: "",
    ip: "",
    relasi: "",
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asset) return;
    setSubmitting(true);
    try {
      // Gabungkan data aset (snapshot) + data CI
      const payload = {
        external_asset_id: asset.aset_uuid || asset.id,
        asset_name: asset.nama,
        lokasi: asset.lokasi,
        penanggung_jawab: asset.penanggung_jawab,
        sub_kategori: asset.sub_kategori,
        level_resiko: asset.level_resiko,
        // Data CI internal
        ci_code: formData.ci_code,
        versi: formData.versi,
        os: formData.os,
        ip: formData.ip,
        relasi: formData.relasi,
      };
      // Kirim ke backend (endpoint CI, misal /api/configuration-items)
      await axios.post("/api/configuration-items", payload);
      alert("Data berhasil dikirim!");
    } catch {
      alert("Gagal mengirim data CI");
    } finally {
      setSubmitting(false);
    }
  };

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
        {/* --- ASSET TITLE CARD --- */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 flex flex-col justify-center border border-gray-200 h-38">
          <h2 className="text-lg font-semibold text-[#001729] mb-1">{asset.nama}</h2>
          <h4 className="text-lg font-semibold text-[#001729] mb-1">{asset.aset_uuid}</h4>
        </div>
        {/* --- LEFT INFO CARD --- */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold text-[#001729] mb-1">Penanggung Jawab</p>
            <p className="text-gray-500 text-sm">{asset.penanggung_jawab || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Status Aset</p>
            <p className="text-gray-500 text-sm">{asset.status || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Kategori Aset</p>
            <p className="text-gray-500 text-sm">{asset.sub_kategori || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Lokasi Aset</p>
            <p className="text-gray-500 text-sm">{asset.lokasi || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-[#001729] mb-1">Risiko</p>
            <p className="text-gray-500 text-sm">{asset.level_resiko || '-'}</p>
          </div>
        </div>
        {/* --- RIGHT FORM --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6"
        >
          <div>
            <p className="font-semibold text-[#001729] mb-1">CI Code</p>
            <input
              type="text"
              name="ci_code"
              value={formData.ci_code}
              onChange={handleChange}
              placeholder="Masukkan CI Code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
          </div>
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#FF7900] text-white px-6 py-2 rounded-lg hover:bg-[#e76700] text-sm font-semibold"
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
