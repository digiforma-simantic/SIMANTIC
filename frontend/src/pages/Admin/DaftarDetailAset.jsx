import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Headerdetailaset from "../../components/Admin/Headerdetas";
import { assetsAPI } from "../../services/assetsApi";
import { configurationItemsAPI } from "../../services/configurationItemsApi";
import { usersAPI } from "../../services/usersApi";

export default function DetailAset() {
  const { id } = useParams();

  const [asset, setAsset] = useState(null);
  const [ci, setCi] = useState(null);
  const [users, setUsers] = useState([]);

  const [loadingAsset, setLoadingAsset] = useState(true);
  const [loadingCi, setLoadingCi] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [error, setError] = useState(null);

  /* ================= FETCH ASSET ================= */
  useEffect(() => {
    async function fetchAsset() {
      try {
        const data = await assetsAPI.getById(id);
        setAsset(data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data aset");
      } finally {
        setLoadingAsset(false);
      }
    }

    if (id) fetchAsset();
  }, [id]);

  /* ================= FETCH CI ================= */
  useEffect(() => {
    async function fetchCI() {
      if (!asset?.kode_bmd) {
        setLoadingCi(false);
        return;
      }

      try {
        const res = await configurationItemsAPI.getByKodeBmd(asset.kode_bmd);
        setCi(res.data || res);
      } catch (err) {
        console.warn("CI belum tersedia");
        setCi(null);
      } finally {
        setLoadingCi(false);
      }
    }

    fetchCI();
  }, [asset]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (err) {
        console.error("Gagal mengambil users", err);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchUsers();
  }, []);

  /* ================= LOADING ================= */
  if (loadingAsset || loadingCi || loadingUsers) {
    return (
      <div className="min-h-screen bg-[#F7FCFF] font-geologica">
        <Headerdetailaset />
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error || !asset) {
    return (
      <div className="min-h-screen bg-[#F7FCFF] font-geologica">
        <Headerdetailaset />
        <div className="flex justify-center items-center h-96 text-red-500">
          {error || "Data tidak ditemukan"}
        </div>
      </div>
    );
  }

  const safeCi = ci || {};

  /* ================= RESOLVE OWNER ================= */
  const owner =
    safeCi.owner_id
      ? users.find((u) => u.id === safeCi.owner_id)
      : null;

  /* ================= COMPONENT ================= */
  const RiskBadge = ({ level }) => {
    let color = "bg-gray-200 text-gray-800";
    if (level === "High") color = "bg-red-100 text-red-700";
    if (level === "Medium") color = "bg-yellow-100 text-yellow-700";
    if (level === "Low") color = "bg-green-100 text-green-700";

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
        {level}
      </span>
    );
  };

  const UsageBadge = ({ status }) => {
    if (!status) return "-";
    const active = status.toLowerCase() === "active";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {status}
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

        {/* ===== IDENTITAS ASET ===== */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-[#001729]">
            {asset.nama}
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Kode BMD: <span className="font-semibold">{asset.kode_bmd}</span>
          </p>

          <Link
            to={`/FormDetailAset/${id}`}
            className="text-sm text-blue-600 hover:underline mt-3 inline-block"
          >
            Edit Detail →
          </Link>
        </div>

        {/* ===== INFO ASET + RISIKO ===== */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <Info label="Penanggung Jawab" value={asset.penanggungjawab?.nama} />
          <Info label="Kategori" value={asset.subkategori?.nama} />
          <Info label="Lokasi" value={asset.lokasi?.nama} />
          <Info label="Masih Digunakan" value={<UsageBadge status={asset.is_usage} />} />

          <div>
            <p className="font-semibold text-[#001729] mb-2">Risiko</p>
            {asset.risks?.length > 0 ? (
              <div className="space-y-3">
                {asset.risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="border rounded-lg p-3 bg-white space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold">{risk.judul}</p>
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

        {/* ===== INFO CI ===== */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <Info label="CI Code" value={safeCi.ci_code} />
          <Info label="Versi" value={safeCi.version} />
          <Info label="OS" value={safeCi.os_name} />
          <Info label="IP Address" value={safeCi.ip_address} />
          <Info label="Relasi Aset" value={safeCi.relation_note} />
          <Info
            label="Owner CI"
            value={owner ? `${owner.name} (${owner.email})` : "-"}
          />
        </div>

      </main>
    </div>
  );
}