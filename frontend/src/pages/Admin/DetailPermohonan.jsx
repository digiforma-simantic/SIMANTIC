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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRFC() {
      try {
        const response = await rfcAPI.getById(id);
        setRfc(response.data);
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
                  {rfc.requester?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  {rfc.requester?.role_name || 'Staff'}
                  {rfc.requester?.dinas_name && ` - ${rfc.requester.dinas_name}`}
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
                  {rfc.attachment_path || rfc.attachments ? (
                    <div className="flex items-center gap-2 cursor-pointer w-fit hover:underline mt-1">
                      <img src={dokumen} alt="dokumen" className="w-5 h-5" />
                      <span className="text-sm text-[#005BBB] font-medium">
                        {rfc.attachment_path ? rfc.attachment_path.split('/').pop() : 'Dokumen.Pdf.File'}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">null</p>
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
                note="Forward ke Kasi sesuai dinas"
                submitting={submitting}
                setSubmitting={setSubmitting}
                id={id}
                navigate={navigate}
              />
              <SendButton
                label="Kirim Kabid"
                tujuan="Kepala Bidang"
                tujuanLevel="kepala_bidang"
                note="Forward ke Kabid sesuai dinas"
                submitting={submitting}
                setSubmitting={setSubmitting}
                id={id}
                navigate={navigate}
              />
              <SendButton
                label="Kirim Kadis"
                tujuan="Kepala Dinas"
                tujuanLevel="kepala_dinas"
                note="Forward ke Kadis sesuai dinas"
                submitting={submitting}
                setSubmitting={setSubmitting}
                id={id}
                navigate={navigate}
              />
              <SendButton
                label="Kirim Diskominfo"
                tujuan="Admin Kota"
                tujuanLevel="admin_kota"
                note="Forward ke Admin Kota"
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
function SendButton({ label, tujuan, tujuanLevel, note, submitting, setSubmitting, id, navigate }) {
  async function handleClick() {
    if (!window.confirm(`Yakin ingin mengirim permohonan ke ${tujuan}?`)) return;
    setSubmitting(true);
    try {
      await rfcAPI.forward(id, { note, tujuan: tujuanLevel });
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
