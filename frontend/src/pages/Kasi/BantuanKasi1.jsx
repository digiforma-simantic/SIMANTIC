import React from "react";
import Headerbantuan from "../../components/Kasi/HeaderBantuanKasi";

export default function BantuanStaff() {
  return (
    <div className="min-h-screen bg-[#F4FAFF] font-geologica">

      {/* HEADER */}
      <Headerbantuan />

      {/* BODY */}
      <main className="w-full flex justify-center px-4 py-10">
        <div className="w-full max-w-[1150px] bg-[#F2FAFF] border border-[#E2EDF5] shadow-md rounded-2xl p-10">

          {/* TITLE */}
          <h2 className="text-xl font-semibold text-[#002444] mb-3">
            Bagaimana cara melakukan penindakan pengajuan?
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-10 ml-2">
            Anda dapat mengajukan perubahan dengan beberapa langkah seperti berikut :
          </p>

          {/* STEPS */}
            <div className="space-y-4 ml-10">
            {[
                "Pergi ke halaman Daftar Approval",
                "Klik Cek Detail",
                "Pastikan seluruh data sudah lengkap dan sesuai standar",
                "Setelah anda meninjau data pengajuan, lakukan salah satu tindakan",
                "Setelah tindakan dipilih, sistem akan otomatis memperbarui status pengajuan dan mengirimkan notifikasi kepada pihak terkait"
            ].map((text, idx) => (
                <div key={idx}>
                
                {/* STEP CONTENT */}
                <div className="flex items-start gap-6 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#F4FAFF] border border-[#E2EDF5] flex items-center justify-center text-[#002444] font-semibold">
                    {idx + 1}
                    </div>

                    <p className="flex-1 text-[#002444] leading-relaxed">
                    {text.includes("Daftar Approval") ? (
                        <>
                        Pergi ke halaman{" "}
                        <span className="font-semibold">Daftar Approval</span>
                        </>
                    ) : text.includes("Cek Detail") ? (
                        <>
                        Klik <span className="font-semibold">Cek Detail</span>
                        </>
                    ) : (
                        text
                    )}
                    </p>
                </div>

                {/* SEPARATOR */}
                <hr className="border-[#E2EDF5]" />
                </div>
            ))}
            </div>

        </div>
      </main>
    </div>
  );
}
