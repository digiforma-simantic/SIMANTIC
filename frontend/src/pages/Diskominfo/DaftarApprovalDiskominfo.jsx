import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Headerdafapp from "../../components/Diskominfo/Headerdafapp";

const DaftarApprovalDiskominfo = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Semua");

  const approvals = [
    { id: 1, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", priority: "Low", badgeColor: "bg-[#1e3a5f]" },
    { id: 2, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", priority: "Low", badgeColor: "bg-[#1e3a5f]" },
    { id: 3, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", priority: "High", badgeColor: "bg-[#1e3a5f]" },
    { id: 4, title: "Install Aplikasi Kerja", rfcNumber: "#RFC-001", date: "17 Agustus 2025", priority: "Medium", badgeColor: "bg-[#1e3a5f]" }
  ];

  const filters = ["Semua", "Low", "Medium", "High"];

  const filteredApprovals = activeFilter === "Semua" 
    ? approvals 
    : approvals.filter(item => item.priority === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Headerdafapp />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari Daftar RFC..."
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Daftar RFC SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar RFC</h2>

          {/* FILTER BUTTONS */}
          <div className="flex gap-3 mb-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {filteredApprovals.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className={`${item.badgeColor} text-white text-xs font-semibold px-3 py-1.5 rounded-md`}>
                      {item.priority}
                    </span>
                    
                    <div className="flex-1">
                      <p className="font-semibold text-base text-gray-900 mb-1">{item.title}</p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <p className="text-sm">{item.rfcNumber}</p>
                        <span className="text-sm">•</span>
                        <p className="text-sm">{item.date}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/Diskominfo/DetailApprovalDiskominfo/${item.id}`)}
                    className="text-sm font-medium text-gray-900 hover:underline whitespace-nowrap ml-4"
                  >
                    Cek Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarApprovalDiskominfo;