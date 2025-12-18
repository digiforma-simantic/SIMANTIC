import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Headerdetailaset from "../../components/Admin/Headerdetas";

import { assetsAPI } from "../../services/assetsApi";
import { configurationItemsAPI } from "../../services/configurationItemsApi";
import { usersAPI } from "../../services/usersApi";
import { useAuth } from "../../contexts/AuthContext";

export default function DetailAsetSaya() {
  const { id } = useParams(); // id = kode_bmd

  const [asset, setAsset] = useState(null);
  const [ci, setCi] = useState(null);
  const [owner, setOwner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    async function fetchAll() {
      try {
        /* 1️⃣ ASSET + RISIKO (API MITRA) */
        const assetData = await assetsAPI.getByKodeBmd(id);
        setAsset(assetData);

        /* 2️⃣ CI (BACKEND SENDIRI) */
        const ciRes = await configurationItemsAPI.getByKodeBmd(id);
        const ciData = ciRes.data;
        setCi(ciData);

        /* 3️⃣ OWNER (BACKEND SENDIRI) */
        if (ciData?.owner_id) {
          const users = await usersAPI.getAll();
          const foundOwner = users.find(
            (u) => u.id === ciData.owner_id
          );
          setOwner(foundOwner || null);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail aset");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id]);

  /* ================= STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat detail aset...
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "Data tidak ditemukan"}
      </div>
    );
  }

  /* ================= BADGE ================= */
  const RiskBadge = ({ level }) => {
    let color = "bg-gray-200 text-gray-800";
    if (level === "High") color = "bg-red-100 text-red-700";
    if (level === "Medium") color = "bg-yellow-100 text-yellow-700";
    if (level === "Low") color = "bg-green-100 text-green-700";

    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}
      >
        {level}
      </span>
    );
  };

  const Info = ({ label, value }) => (
    <div>
      <p className="font-semibold text-[#001729] mb-1">{label}</p>
      <p className="text-gray-500 text-sm">{value || "-"}</p>
    </div>
  );

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      <Headerdetailaset />

      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">

        {/* ===== CARD 1 : IDENTITAS ASET ===== */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-[#001729]">
            {asset.nama}
          </h2>
          <p className="text-sm text-gray-600">
            {asset.kode_bmd}
          </p>
        </div>

        {/* ===== CARD 2 : INFORMASI ASET + RISIKO ===== */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <Info label="Status Aset" value={asset.status} />
          <Info label="Kategori" value={asset.kategori?.nama} />
          <Info label="Sub Kategori" value={asset.subkategori?.nama} />
          <Info label="Lokasi" value={asset.lokasi?.nama} />
          <Info label="Alamat Lokasi" value={asset.lokasi?.alamat} />
          <Info label="Penanggung Jawab" value={asset.penanggungjawab?.nama} />
          <Info label="Digunakan" value={asset.is_usage} />

          <div>
            <p className="font-semibold text-[#001729] mb-2">Risiko</p>

            {asset.risks?.length > 0 ? (
              <div className="space-y-3">
                {asset.risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold">
                        {risk.judul}
                      </p>
                      <RiskBadge level={risk.kriteria} />
                    </div>
                    <p className="text-xs text-gray-500">
                      Status: {risk.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Tidak ada risiko terdaftar
              </p>
            )}
          </div>
        </div>

        {/* ===== CARD 3 : INFORMASI CI ===== */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <Info label="CI Code" value={ci?.ci_code} />
          <Info label="Versi" value={ci?.version} />
          <Info label="OS" value={ci?.os_name} />
          <Info label="IP Address" value={ci?.ip_address} />
          <Info label="Relasi Antar Aset" value={ci?.relation_note} />
          <Info
            label="Owner"
            value={
              owner
                ? `${owner.name} (${owner.email})`
                : "-"
            }
          />
        </div>

      </main>
    </div>
  );
}
