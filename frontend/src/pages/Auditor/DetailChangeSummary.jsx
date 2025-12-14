import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import Headerauditor from "../../components/Auditor/Headerdetailcs";

const DetailChangeSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F7FCFF]">

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1">

        {/* HEADER */}
        <Headerauditor />

        {/* PAGE CONTENT */}
        <div className="flex-1 p-10 max-w-7xl mx-auto w-full">

          {/* MAIN CARD */}
          <div className="bg-[#F2FAFF] rounded-2xl border border-[#E3ECF5] shadow-sm p-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT CARD - User Info & Status */}
              <div className="space-y-4">
                
                {/* User Card */}
                <div className="bg-white border-2 border-green-500 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Slamet Budianto</h2>
                  <p className="text-sm text-gray-500 mb-4">Dinas Kesehatan</p>
                </div>

                {/* Status Button */}
                <div className="bg-white border-2 border-green-500 rounded-xl p-4">
                  <p className="text-green-600 font-semibold text-center">Disetujui</p>
                </div>

              </div>

              {/* RIGHT SECTION - Details (2 columns) */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Column 1 */}
                <div className="bg-white border border-[#E3ECF5] rounded-xl p-6 space-y-5">
                  
                  <DetailItem 
                    label="Judul Perubahan" 
                    value="Migrasi Aplikasi Antrian RSUD" 
                  />

                  <DetailItem 
                    label="Kategori Aset" 
                    value="Software" 
                  />

                  <DetailItem 
                    label="Deskripsi Perubahan" 
                    value="Pemindahan aplikasi antrian ke server baru agar lebih stabil dan cepat." 
                  />

                  {/* Urgensi Perubahan dihapus */}

                </div>

                {/* Column 2 */}
                <div className="bg-white border border-[#E3ECF5] rounded-xl p-6 space-y-5">
                  
                  <DetailItem 
                    label="Jenis Perubahan" 
                    value="Minor" 
                  />

                  {/* Rencana Implementasi dihapus */}

                  <DetailItem 
                    label="Aset Terdampak" 
                    value="Aplikasi Antrian & Database Antrian RSUD" 
                  />

                  {/* Rencana Rollback dihapus */}

                  <DetailItem 
                    label="PIC" 
                    value="Sudarsono" 
                  />

                  <DetailItem 
                    label="Waktu Eksekusi" 
                    value="12 Agustus 2025 — 22:00 WIB" 
                  />

                  {/* Post Implementation Review */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Post Implementation Review
                    </p>
                    <div className="flex items-center gap-2 cursor-pointer hover:underline w-fit">
                      <FileText className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700">Dokumen PIR.Pdf</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

// REUSABLE DETAIL ITEM
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
    <p className="text-sm text-gray-600 leading-relaxed">{value}</p>
  </div>
);

export default DetailChangeSummary;