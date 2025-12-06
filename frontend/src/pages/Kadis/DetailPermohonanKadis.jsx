import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Headeradmin from "../../components/Kadis/Headerdetper";

// ICON / IMAGE SESUAI IMPORTMU
import dokumen from "../../assets/dokumen.png";

const DetailPengajuan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F7FCFF]">

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1">

        {/* HEADER */}
        <Headeradmin />

        {/* PAGE CONTENT */}
        <div className="flex-1 p-10 max-w-7xl mx-auto">

          {/* BACK BUTTON */}
          <div
            className="flex items-center gap-3 mb-6 cursor-pointer w-fit"
            onClick={() => navigate(-1)}
          ></div>

          {/* MAIN CARD */}
          <div className="bg-[#F2FAFF] rounded-2xl border border-[#E3ECF5] shadow-sm p-8">

            <div className="flex flex-col md:flex-row gap-8">

              {/* LEFT USER CARD */}
              <div className="w-full md:w-1/4 bg-[#F8FBFF] border border-orange-400 rounded-xl p-5 h-fit">

                {/* NAMA */}
                <p className="font-bold text-lg text-[#001B33]">Slamet Budianto</p>
                <p className="text-sm text-gray-500 mb-4">#0001</p>

                {/* STATUS */}
                <div className="mt-2">
                  <p className="bg-orange-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                    Terkirim
                  </p>
                </div>
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

                {/* FILE BUKTI */}
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
          </div>

        </div>
      </div>
    </div>
  );
};

// REUSABLE DETAIL ROW
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-[#001B33]">{label}</p>
    <p className="text-sm text-gray-600">{value}</p>
  </div>
);

export default DetailPengajuan;
