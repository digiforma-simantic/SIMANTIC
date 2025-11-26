import React from "react";
import { Link } from "react-router-dom";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import Headeradmin from "../../components/Admin/Headeradmin";

import tandaminus from "../../assets/tandaminusadmin.png";
import tandaseru from "../../assets/tandaseruadmin.png";

const DashboardAdmin = () => {
  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">

      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">

        <Headeradmin />

        <div className="px-10 py-8">

          <div className="mb-8">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-3xl font-semibold text-gray-900">Joko Gemilang</h1>
          </div>

          <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-[#001B33]">Daftar Approval</h2>

              <Link
                className="text-xs font-semibold text-[#005BBB] hover:underline"
                to="/Admin/DaftarApproval"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4,5,6,7,8].map((item) => (
                <div key={item} className="flex items-center justify-between bg-[#F9FCFF] border border-[#E6EEF7] rounded-xl p-4">

                  <div className="flex items-start gap-3">
                    <img src={item % 2 === 0 ? tandaminus : tandaseru} className="w-5" />
                    <div>
                      <p className="font-medium text-sm">Install Aplikasi Kerja</p>
                      <p className="text-[10px] text-gray-500">17 Agustus 2025</p>
                    </div>
                  </div>

                  <Link to={`/Admin/DetailPermohonan/${item}`} className="text-xs text-[#005BBB] hover:underline">
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

export default DashboardAdmin;
