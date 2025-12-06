import React from "react";
import Headerkadis from "../../components/Kadis/Headerkadis";
import Sidebarkadis from "../../components/Kadis/Sidebarkadis";
import { Link } from "react-router-dom";

export default function AsetSayaKadis() {
  const items = Array(10).fill({
    name: "Laptop M-25-001",
  });

  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">
      {/* SIDEBAR */}
      <Sidebarkadis />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        {/* HEADER */}
        <Headerkadis />

        {/* BODY */}
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            {/* TITLE */}
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Cek Aset
            </h2>

            {/* GRID LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-100 py-4 px-5 hover:shadow-sm transition-shadow"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.code}
                    </p>
                  </div>

                  <Link
                    to={`/Kadis/DetailAsetKadis/${index + 1}`}
                    className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
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