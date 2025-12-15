import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import Headerauditor from "../../components/Auditor/Headerptcom";

const PatchCompliance = () => {
  const navigate = useNavigate();

  const patchComplianceData = [
    { 
      id: 1, 
      name: "Dinas Kehutanan", 
      period: "Q4 2025",
      status: "Compliance",
      badgeColor: "bg-blue-900"
    },
    { 
      id: 2, 
      name: "Diskominfo", 
      period: "Q4 2025",
      status: "Non-Compliance",
      badgeColor: "bg-gray-700"
    },
    { 
      id: 3, 
      name: "Dinas Kesehatan", 
      period: "Q4 2025",
      status: "Compliance",
      badgeColor: "bg-blue-900"
    },
    { 
      id: 4, 
      name: "Dinas Kesehatan", 
      period: "Q4 2025",
      status: "Compliance",
      badgeColor: "bg-blue-900"
    }
  ];

  return (
    <div className="flex-1 flex flex-col ml-0 md:ml-0 transition-all">

      {/* HEADER */}
      <Headerauditor />

      {/* CARD WRAPPER */}
      <div className="bg-[#F2FAFF] shadow-md rounded-2xl p-8 w-full max-w-7xl mx-auto mt-10">

        {/* SEARCH BAR */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Daftar RFC..."
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Patch Compliance</h2>

        {/* LIST */}
        <div className="space-y-4">
          {patchComplianceData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Badge */}
              <div className="mb-3">
                <span className={`${item.badgeColor} text-white text-xs font-medium px-3 py-1 rounded`}>
                  {item.status}
                </span>
              </div>

              {/* Content */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.period}</p>
                </div>

                <button
                  onClick={() => navigate(`/Auditor/DetailPatchCompliance/${item.id}`)}
                  className="text-[#005BBB] font-semibold text-sm hover:underline whitespace-nowrap ml-4"
                >
                  Cek Detail
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PatchCompliance;