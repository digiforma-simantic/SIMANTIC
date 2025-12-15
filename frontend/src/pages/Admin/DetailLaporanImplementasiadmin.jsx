
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/Sidebaradmin";
import Header from "../../components/Admin/Headeradmin";
import { useParams, Link } from "react-router-dom";

export default function DetailLaporanImplementasiAdmin() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading] = useState(false);

  // Hardcode data detail laporan implementasi
  useEffect(() => {
    const data = [
      {
        id: "1",
        title: "Implementasi SSO SIMANTIC",
        rfc_service_id: "RFC-001",
        rfc_id: "1001",
        status: "berhasil",
        description: "Integrasi SSO berjalan lancar tanpa kendala.",
        attachments: [
          "https://example.com/attachment1.pdf",
          "https://example.com/attachment2.png"
        ],
        completed_at: "2025-12-10 14:30:00",
        lokasi_aset: "Ruang IT, Lantai 2",
        penanggung_jawab: "Budi Santoso",
        sub_kategori: "Laptop",
        level_risiko: "Sedang",
        tanggal_input: "14/12/2025, 15.00.00",
        ci_code: "CI-2025-001",
        versi: "2025.1",
        os: "Windows 11 Pro",
        ip_address: "192.168.1.25",
        relasi_antar_aset: "Printer M-25-002, Switch-IT-01"
      }
    ];
    const found = data.find((item) => item.id === id);
    setDetail(found || null);
  }, [id]);

  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        <Header />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Link to="/Admin/LaporanImplementasiadmin" className="text-[#005BBB] text-sm hover:underline">&larr; Kembali</Link>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 text-center">Detail Laporan Implementasi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* KIRI: Info utama implementasi */}
              <div className="bg-[#F4FAFD] rounded-2xl border border-[#E6EEF7] p-8">
                <div className="mb-8">
                  <div className="font-bold text-lg text-gray-800 mb-1">Judul</div>
                  <div className="text-gray-500 text-base">{detail?.title || '-'}</div>
                </div>
                <div className="mb-8">
                  <div className="font-bold text-lg text-gray-800 mb-1">RFC ID</div>
                  <div className="text-gray-500 text-base">{detail?.rfc_id || '-'}</div>
                </div>
                <div className="mb-8">
                  <div className="font-bold text-lg text-gray-800 mb-1">Status</div>
                  <div className={`text-base font-semibold ${
                    detail?.status === 'berhasil' ? 'text-green-600' :
                    detail?.status === 'gagal' ? 'text-red-600' : 'text-orange-600'}`}>{detail?.status || '-'}</div>
                </div>
                <div className="mb-8">
                  <div className="font-bold text-lg text-gray-800 mb-1">Deskripsi</div>
                  <div className="text-gray-500 text-base whitespace-pre-line">{detail?.description || '-'}</div>
                </div>
              </div>
              {/* KANAN: Attachment dan waktu implementasi */}
              <div className="bg-[#F4FAFD] rounded-2xl border border-[#E6EEF7] p-8">
                <div className="mb-8">
                  <div className="font-bold text-lg text-gray-800 mb-1">Attachment</div>
                  <div>
                    {detail?.attachments && Array.isArray(detail.attachments) && detail.attachments.length > 0 ? (
                      <ul className="list-disc ml-6 space-y-1">
                        {detail.attachments.map((url, idx) => (
                          <li key={idx}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#005BBB] underline">Lampiran {idx + 1}</a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">Tidak ada</span>
                    )}
                  </div>
                </div>
                <div className="mb-8">
                  <div className="font-bold text-lg text-gray-800 mb-1">Waktu Implementasi</div>
                  <div className="text-gray-500 text-base">{detail?.completed_at || '-'}</div>
                </div>
              </div>
            </div>
            {/* Jika ingin tambahkan section bawah, bisa di sini */}
          </div>
          {/* loading dan not found */}
          {loading ? (
            <p className="text-center text-gray-500 py-8">Memuat detail...</p>
          ) : !detail ? (
            <p className="text-center text-gray-500 py-8">Data tidak ditemukan</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
