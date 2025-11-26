import React from "react";
import Headeradmin from "../../components/Admin/Headeradmin";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import { Link } from "react-router-dom";

export default function AsetAdmin() {
  // Simulasi data
  const completeAssets = Array(4).fill({
    name: "Laptop M-25-001",
    status: "complete",
  });

  const incompleteAssets = Array(4).fill({
    name: "Laptop M-25-001",
    status: "incomplete",
  });

  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">
      
      {/* SIDEBAR */}
      <Sidebaradmin />

      {/* MAIN */}
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        
        {/* HEADER */}
        <Headeradmin />

        {/* PAGE CONTENT */}
        <div className="p-6 space-y-8">

          {/* SECTION: Daftar Aset */}
          <div className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Daftar Aset</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completeAssets.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg border border-[#E6EEF7] py-4 px-5"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                  </div>

                  <Link
                    to={`/DaftarDetailAset/${index + 1}`}
                    className="text-sm font-semibold text-[#005BBB] hover:underline"
                  >
                    Cek Detail
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: Butuh Lengkap Data */}
          <div className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Butuh Lengkap Data</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incompleteAssets.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg border border-[#E6EEF7] py-4 px-5"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                  </div>

                  <Link
                    to={`/FormDetailAset/${index + 1}`}
                    className="text-sm font-semibold text-[#FF7A00] hover:underline"
                  >
                    Isi Detail
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
