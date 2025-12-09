import React from "react";
import { Check, Send } from "lucide-react";
import Headeradmin from "../../components/Admin/Headeradmin";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";

const StatusPengajuanAdmin = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-geologica text-[#001B33]">
      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="max-w-5xl mx-auto px-6 py-10 w-full">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-14">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-900">ID Pengajuan</p>
                <div className="w-32 text-center py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium">
                  0001
                </div>
              </div>

              <div className="lg:col-span-2 border border-gray-200 rounded-xl bg-white p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pembaruan Aplikasi E-Kinerja 2.1</h2>
                <p className="text-gray-600 text-sm mt-1">Sukses!</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl bg-white px-10 py-12">
              <div className="flex items-start justify-between">
                {[
                  {
                    title: "Permintaan Diajukan",
                    subtitle: "Pengguna mengajukan permintaan",
                    icon: <Send className="w-6 h-6 text-gray-800" />,
                    accent: "border-gray-800",
                  },
                  {
                    title: "Validasi Kepala Seksi",
                    subtitle: "Permintaan telah divalidasi",
                    icon: <Check className="w-6 h-6 text-gray-800" strokeWidth={2.5} />,
                    accent: "border-gray-800",
                  },
                  {
                    title: "Validasi Kepala Bidang",
                    subtitle: "Permintaan telah divalidasi",
                    icon: <Check className="w-6 h-6 text-gray-800" strokeWidth={2.5} />,
                    accent: "border-gray-800",
                  },
                  {
                    title: "Validasi Diskominfo",
                    subtitle: "Permintaan telah divalidasi",
                    icon: <Check className="w-6 h-6 text-gray-800" strokeWidth={2.5} />,
                    accent: "border-gray-800",
                  },
                  {
                    title: "Selesai",
                    subtitle: "Berhasil diimplementasikan",
                    icon: <Check className="w-7 h-7 text-green-500" strokeWidth={3} />,
                    accent: "border-green-500",
                    highlight: "text-green-500",
                  },
                ].map((step, index, arr) => (
                  <React.Fragment key={step.title}>
                    <div className="flex flex-col items-center text-center" style={{ maxWidth: "140px" }}>
                      <div className={`w-16 h-16 rounded-full border-2 ${step.accent} bg-white flex items-center justify-center`}>
                        {step.icon}
                      </div>
                      <p className={`mt-3 font-semibold text-sm ${step.highlight || "text-gray-900"}`}>{step.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="flex-1 h-0.5 bg-green-500 mt-8 mx-2"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPengajuanAdmin;
