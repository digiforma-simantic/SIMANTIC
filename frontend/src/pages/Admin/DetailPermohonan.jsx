import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Headeradmin from "../../components/Admin/Headerdetper";

// ICON / IMAGE SESUAI IMPORTMU
import dokumen from "../../assets/dokumen.png";

const DetailPermohonan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
                <p className="font-bold text-lg text-[#001B33]">Slamet Budianto</p>
                <p className="text-sm text-gray-500">Staff Dinas Kesehatan</p>
              </div>

              {/* DETAILS CARD */}
              <div className="w-full md:w-3/4 bg-[#F8FBFF] border border-[#E3ECF5] rounded-xl p-6 space-y-5">

                <DetailItem label="Judul RFC" value="Staff Dinas Kesehatan" />
                <DetailItem label="Aset Terdampak" value="Komputer" />

                <DetailItem
                  label="Deskripsi Permintaan"
                  value="Diperlukan pembaruan pada modul pelaporan kinerja agar sesuai dengan format terbaru dari BKN."
                />

                <DetailItem label="Prioritas" value="Low" />

                {/* FILE ITEM */}
                <div>
                  <p className="font-semibold text-sm text-[#001B33]">
                    File Bukti
                  </p>
                  <div className="flex items-center gap-2 cursor-pointer w-fit hover:underline mt-1">
                    <img src={dokumen} alt="dokumen" className="w-5 h-5" />
                    <span className="text-sm text-[#005BBB] font-medium">
                      Dokumen.Pdf.File
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <button className="bg-[#FF7900] text-white px-8 py-2 rounded-lg hover:bg-[#e56b00] text-sm font-semibold">
                Kirim
              </button>
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

export default DetailPermohonan;
