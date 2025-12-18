import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Headerdetailaset from "../../components/Admin/Headerdetas";
import { assetsAPI } from "../../services/assetsApi";
import { configurationItemsAPI } from "../../services/configurationItemsApi";
import { usersAPI } from "../../services/usersApi";

/* ================= HELPER ================= */
const generateCiCode = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CI-${year}-${random}`;
};

const RequiredLabel = ({ children }) => (
  <p className="font-semibold text-[#001729] mb-1">
    {children} <span className="text-red-500">*</span>
  </p>
);

export default function FormDetailAset() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [ci, setCi] = useState(null);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ci_code: "",
    versi: "",
    os: "",
    ip: "",
    relasi: "",
    owner_id: "",
  });

  /* ================= FETCH ASSET + CI ================= */
  useEffect(() => {
    async function fetchData() {
      try {
        const assetData = await assetsAPI.getById(id);
        setAsset(assetData);

        try {
          const res = await configurationItemsAPI.getByKodeBmd(assetData.kode_bmd);
          const ciData = res.data || res;
          setCi(ciData);

          setFormData({
            ci_code: ciData.ci_code || generateCiCode(),
            versi: ciData.version || "",
            os: ciData.os_name || "",
            ip: ciData.ip_address || "",
            relasi: ciData.relation_note || "",
            owner_id: ciData.owner_id || "",
          });
        } catch {
          setCi(null);
          setFormData((prev) => ({
            ...prev,
            ci_code: generateCiCode(),
          }));
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data aset");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (err) {
        console.error("Gagal ambil user", err);
      }
    }
    fetchUsers();
  }, []);

  /* ================= HANDLER ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      asset_id: asset.kode_bmd,
      name: asset.nama,

      ci_code: formData.ci_code,
      version: formData.versi || null,
      os_name: formData.os || null,
      ip_address: formData.ip || null,
      relation_note: formData.relasi,
      owner_id: formData.owner_id || null,

      subkategori: asset.subkategori?.nama,
      lokasi: asset.lokasi?.nama,
      penanggung_jawab: asset.penanggungjawab?.nama,
      is_usage: asset.is_usage,
    };

    try {
      if (ci) {
        await configurationItemsAPI.update(ci.id, payload);
        alert("CI berhasil diperbarui");
      } else {
        await configurationItemsAPI.create(payload);
        alert("CI berhasil dibuat");
      }

      navigate(`/Admin/DaftarAset
      `);
    } catch (err) {
      alert(err.message || "Gagal menyimpan CI");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= BADGE ================= */
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat data aset...
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      <Headerdetailaset />

      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-8">

        {/* ===== CARD 1 : IDENTITAS ASET ===== */}
        <div className="bg-[#F2FAFF] shadow rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-[#001729]">{asset.nama}</h2>
          <p className="text-sm text-gray-600">{asset.kode_bmd}</p>
        </div>

        {/* ===== CARD 2 : INFORMASI ASET & RISIKO (LENGKAP) ===== */}
        <div className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold">Penanggung Jawab</p>
            <p className="text-sm text-gray-500">
              {asset.penanggungjawab?.nama || "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Status Aset</p>
            <p className="text-sm text-gray-500">{asset.status || "-"}</p>
          </div>

          <div>
            <p className="font-semibold">Kategori</p>
            <p className="text-sm text-gray-500">
              {asset.kategori?.nama || "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Sub Kategori</p>
            <p className="text-sm text-gray-500">
              {asset.subkategori?.nama || "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Lokasi</p>
            <p className="text-sm text-gray-500">
              {asset.lokasi?.nama || "-"}
            </p>
            <p className="text-xs text-gray-400">
              {asset.lokasi?.alamat || ""}
            </p>
          </div>

          <div>
            <p className="font-semibold">Digunakan?</p>
            <UsageBadge status={asset.is_usage} />
          </div>

          <div>
            <p className="font-semibold mb-2">Risiko</p>
            {asset.risks?.length > 0 ? (
              <div className="space-y-3">
                {asset.risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="border border-gray-300 rounded-lg p-3 bg-white"
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
              <p className="text-sm text-gray-500">
                Tidak ada risiko terdaftar
              </p>
            )}
          </div>
        </div>

        {/* ===== CARD 3 : FORM CI ===== */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#F2FAFF] border border-gray-200 shadow rounded-xl p-6 space-y-6"
        >
          <div>
            <RequiredLabel>CI Code</RequiredLabel>
            <input
              name="ci_code"
              value={formData.ci_code}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <p className="font-semibold mb-1">Versi</p>
            <input
              name="versi"
              value={formData.versi}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <p className="font-semibold mb-1">OS</p>
            <input
              name="os"
              value={formData.os}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <p className="font-semibold mb-1">IP Address</p>
            <input
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <RequiredLabel>Relasi Antar Aset</RequiredLabel>
            <textarea
              name="relasi"
              value={formData.relasi}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <p className="font-semibold mb-1">Pemilik CI</p>
            <select
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            >
              <option value="">-- Pilih Pemilik --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#FF7900] text-white px-6 py-2 rounded-lg font-semibold"
            >
              {submitting ? "Menyimpan..." : ci ? "Update CI" : "Simpan CI"}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
