import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const DashboardStaff = () => {
  return (
    <div className="flex min-h-screen bg-[#F4FAFF] font-geologica">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">

        {/* HEADER */}
        <Header />

        {/* BODY CONTENT */}
        <div className="px-6 py-6">

          {/* Welcome */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-2xl font-semibold text-gray-900">
              Slamet Budianto
            </h1>
          </div>

          {/* STATUS PERUBAHAN */}
          <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Status Perubahan</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total", value: 11, color: "#001B33" },
                { label: "Gagal", value: 3, color: "#C0392B" },
                { label: "Proses", value: 2, color: "#E67E22" },
                { label: "Berhasil", value: 6, color: "#27AE60" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#F7FBFF] rounded-xl border border-[#E6EEF7] flex flex-col items-center justify-center py-4"
                >
                  <span className="text-xs text-gray-500 mb-1">{item.label}</span>
                  <span
                    className="text-3xl font-semibold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PANTAU STATUS */}
          <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Pantau Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between bg-[#F7FBFF] border border-[#E6EEF7] rounded-xl px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-2 w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Install Aplikasi Kerja
                      </div>
                      <div className="text-[10px] text-gray-500">
                        #000{item} &nbsp;&nbsp; 17 Agustus 2025
                      </div>
                    </div>
                  </div>

                  {/* Navigasi */}
                  <Link
                    to={`/DetailPengajuanStaff/${item}`}
                    className="text-xs font-semibold text-[#005BBB] hover:underline"
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
};

export default DashboardStaff;
