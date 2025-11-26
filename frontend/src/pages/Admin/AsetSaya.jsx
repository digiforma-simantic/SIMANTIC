import React from "react";
import Headeradmin from "../../components/Admin/Headeradmin";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import { Link } from "react-router-dom";

export default function AsetAdmin() {
  const items = Array(8).fill({
    name: "Laptop M-25-001",
  });

  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">

      {/* SIDEBAR */}
      <Sidebaradmin />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-0 md:ml-64 transition-all">

        {/* HEADER */}
        <Headeradmin />

        {/* BODY */}
        <div className="p-6">
          <div className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">

            {/* TITLE */}
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Aset Saya
            </h2>

            {/* GRID LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg border border-[#E6EEF7] py-4 px-5"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                  </div>

                  <Link
                    to={`/Admin/DetailAsetSaya/${index + 1}`}
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
