import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const assets = [
  { id: 1, name: "Laptop M-25-001" },
  { id: 2, name: "Laptop M-25-002" },
  { id: 3, name: "Laptop M-25-003" },
  { id: 4, name: "Laptop M-25-004" },
  { id: 5, name: "Laptop M-25-005" },
  { id: 6, name: "Laptop M-25-006" },
  { id: 7, name: "Laptop M-25-007" },
  { id: 8, name: "Laptop M-25-008" },
];

const AssetCard = ({ id, name}) => (
  <div className="bg-[#F7FBFF] rounded-xl border border-[#E6EEF7] p-4 flex justify-between items-center">
    <div>
      <h3 className="font-semibold text-[#0E2C4F]">{name}</h3>
    </div>

    <Link
      to={`/DetailAsetStaff/${id}`}
      className="text-[#005BBB] font-medium text-sm hover:underline"
    >
      Cek Detail
    </Link>
  </div>
);

export default function AsetStaff() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4FAFF] font-geologica">

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col md:ml-64">

        {/* BUTTON MOBILE */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-[#02294A] text-2xl font-bold"
          >
            ☰
          </button>
        </div>

        <Header />

        <section className="px-6 lg:px-10 py-6">
          <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-8">

            {/* Judul Tengah */}
            <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">
              Cek Aset
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((item) => (
                <AssetCard key={item.id} id={item.id} name={item.name} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
