import React from "react";
import Sidebar from "../../components/Admin/Sidebaradmin";
import Header from "../../components/Admin/Headeradmin";
import { Link } from "react-router-dom";

export default function RiwayatApproval() {
  const riwayatApproval = [
    {
      title: "Install Aplikasi Kerja",
      code: "#0001",
      date: "17 Agustus 2025",
    },
    {
      title: "Update Server Depan",
      code: "#0002",
      date: "18 Agustus 2025",
    },
    {
      title: "Perbaikan Database",
      code: "#0003",
      date: "20 Agustus 2025",
    },
    {
      title: "Permintaan Akses Jaringan",
      code: "#0004",
      date: "20 Agustus 2025",
    },
    {
      title: "Deploy Aplikasi HRIS",
      code: "#0005",
      date: "21 Agustus 2025",
    },
    {
      title: "Install Antivirus",
      code: "#0006",
      date: "21 Agustus 2025",
    },
    {
      title: "Reset Password User",
      code: "#0007",
      date: "22 Agustus 2025",
    },
    {
      title: "Troubleshoot Printer Lantai 2",
      code: "#0008",
      date: "22 Agustus 2025",
    },
  ];

  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 ml-0 md:ml-64 transition-all">

        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <div className="p-6">
          <div className="bg-white shadow-sm rounded-xl border border-[#E6EEF7] p-6">

            {/* TITLE */}
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Riwayat Approval
            </h2>

            {/* GRID LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {riwayatApproval.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#F9FCFF] 
                             border border-[#E6EEF7] rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    {/* STATUS ICON */}
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>

                    {/* TITLE + CODE */}
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.code} • {item.date}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/DetailPengajuan/${index + 1}`}
                    className="text-sm font-semibold text-[#005BBB] hover:underline"
                  >
                    Cek Detail
                  </Link>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
