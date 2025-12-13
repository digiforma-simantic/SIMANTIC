import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rfcAPI } from "../../services/api";
import Headeradmin from "../../components/Admin/Headerdetper";

// ICON / IMAGE SESUAI IMPORTMU
import dokumen from "../../assets/dokumen.png";

const DetailPermohonan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfc, setRfc] = useState(null);
  const [userSso, setUserSso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRFC() {
      try {
        const response = await rfcAPI.getById(id);
        setRfc(response.data);

        console.log("Fetched RFC:", response.data); // Debug log
        try {
          const sso_token = localStorage.getItem("sso_token");
          if (!sso_token) return null;
          const response_sso = await fetch(`https://api.bispro.digitaltech.my.id/api/v2/auth/user/` + response.data.sso_id, {
            headers: {
              Authorization: `Bearer ${sso_token}`,
            },
          }); 
          if (!response_sso.ok) throw new Error("Failed to fetch SSO user");
          const data = await response_sso.json();
          setUserSso(data.data);
        } catch (error) {
          console.error("Error fetching SSO user ID:", error);
          alert("Gagal memuat data requester user");
        }
      } catch (error) {
        console.error("Error fetching RFC:", error);
        alert("Gagal memuat data RFC");
      } finally {
        setLoading(false);
      }
    }

    fetchRFC();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7FCFF] items-center justify-center">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (!rfc) {
    return (
      <div className="flex min-h-screen bg-[#F7FCFF] items-center justify-center">
        <p className="text-red-500">RFC tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7FCFF]">

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1">

        {/* HEADER (FULL WIDTH) */}
        <Headeradmin />

        {/* PAGE CONTENT */}
        <div className="flex-1 p-10 max-w-7xl mx-auto">

          {/* TITLE + BACK */}
          <div
            className="flex items-center gap-3 mb-6 cursor-pointer w-fit"
            onClick={() => navigate(-1)}
          >
          </div>

          {/* MAIN CARD */}
          <div className="bg-[#F2FAFF] rounded-2xl border border-[#E3ECF5] shadow-sm p-8">

            <div className="flex flex-col md:flex-row gap-8">

              {/* USER CARD */}
              <div className="w-full md:w-1/4 bg-[#F8FBFF] border border-[#E3ECF5] rounded-xl p-5 h-fit">
                <p className="font-bold text-lg text-[#001B33]">
                  {userSso?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  Role : {userSso?.role || 'Unknown'}
                </p>
              </div>

              {/* DETAILS CARD */}
              <div className="w-full md:w-3/4 bg-[#F8FBFF] border border-[#E3ECF5] rounded-xl p-6 space-y-5">

                <DetailItem 
                  label="Judul RFC" 
                  value={rfc.title || 'null'} 
                />
                
                <DetailItem 
                  label="Aset Terdampak" 
                  value={rfc.ci_code || 'null'} 
                />

                <DetailItem
                  label="Deskripsi Permintaan"
                  value={rfc.description || 'null'}
                />

                <DetailItem
                  label="Catatan Teknisi"
                  value={rfc.config_comment || 'null'}
                />

                <DetailItem 
                  label="Prioritas" 
                  value={rfc.priority ? rfc.priority.charAt(0).toUpperCase() + rfc.priority.slice(1) : 'null'} 
                />

                {/* FILE ITEM */}
                <div>
                  <p className="font-semibold text-sm text-[#001B33]">
                    File Bukti
                  </p>
                  {rfc.attachement_path && rfc.attachment_path.length > 0 ? (
                    rfc.attachment_path.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer mb-2"
                      >
                        <img src={dokumen} alt="file icon" className="w-5 h-5" /> 
                        <span className="text-sm">File {index + 1}</span>
                      </a>
                    ))  
                  ) : (
                    <p className="text-gray-600">Tidak ada file bukti.</p>
                  )} 
                </div>
              </div>
            </div>

            {/* BUTTONS - Admin submit RFC ke 4 tujuan */}
            <div className="flex flex-wrap gap-4 justify-end mt-6">
              <SendButton
                label="Kirim Kasi"
                tujuan="Kepala Seksi"
                tujuanLevel="kepala_seksi"
                user_id={userSso?.id}
                submitting={submitting}
                setSubmitting={setSubmitting}
                id={id}
                navigate={navigate}
              />
              <SendButton
                label="Kirim Kabid"
                tujuan="Kepala Bidang"
                tujuanLevel="kepala_bidang"
                user_id={userSso?.id}
                submitting={submitting}
                setSubmitting={setSubmitting}
                id={id}
                navigate={navigate}
              />
              <SendButton
                label="Kirim Kadis"
                tujuan="Kepala Dinas"
                tujuanLevel="kepala_dinas"
                user_id={userSso?.id}
                submitting={submitting}
                setSubmitting={setSubmitting}
                id={id}
                navigate={navigate}
              />
              <SendButton
                label="Kirim Diskominfo"
                tujuan="Admin Kota"
                tujuanLevel="admin_kota"
                user_id={userSso?.id}
                submitting={submitting}
                setSubmitting={setSubmitting}
                id={id}
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// REUSABLE DETAIL ROW COMPONENT
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-[#001B33]">{label}</p>
    <p className="text-sm text-gray-600">{value}</p>
  </div>
);


// BUTTON COMPONENT UNTUK KIRIM RFC SESUAI TUJUAN (harus di luar komponen utama)
function SendButton({ label, tujuan, tujuanLevel, submitting, setSubmitting, id, navigate, user_id }) {
  async function handleClick() {
    if (!window.confirm(`Yakin ingin mengirim permohonan ke ${tujuan}?`)) return;
    setSubmitting(true);
    try {
      await rfcAPI.set(id, { user_id: user_id, level: tujuanLevel });
      alert(`Permohonan berhasil dikirim ke ${tujuan}.`);
      navigate('/Admin/DaftarApproval');
    } catch (error) {
      alert(error.message || `Gagal mengirim permohonan ke ${tujuan}`);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <button
      onClick={handleClick}
      disabled={submitting}
      className="bg-[#FF7900] text-white px-8 py-2 rounded-lg hover:bg-[#e56b00] text-sm font-semibold disabled:opacity-50"
    >
      {submitting ? 'Mengirim...' : label}
    </button>
  );
}

export default DetailPermohonan;
