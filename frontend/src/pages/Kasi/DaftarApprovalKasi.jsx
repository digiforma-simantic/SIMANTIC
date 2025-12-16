import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ICONS
import searchIcon from "../../assets/search-normal.png";
import docIcon from "../../assets/tandaminusadmin.png"; 

import Headerdafapp from "../../components/Kasi/Headerdafapp";

const DaftarApprovalKasi = () => {
  const navigate = useNavigate();

  /* =======================
       RFC DATA
    ======================== */
    const [rfcApprovals, setRfcApprovals] = useState([]);
  
    const fetchDaftarApprovals = async () => {
      try {
        const res = await rfcApprovalAPI.getByLevel("kepala_seksi");
        setRfcApprovals(res.data || []);
      } catch (error) {
        console.error("Gagal mengambil RFC approvals", error);
      }
    };
  
    useEffect(() => {
      fetchDaftarApprovals();
    }, []);

  return (
    <div className="flex-1 flex flex-col ml-0 md:ml-0 transition-all">

    {/* HEADER */}
    <Headerdafapp />

      {/* CARD WRAPPER */}
      <div className="bg-[#F2FAFF] shadow-md rounded-2xl p-8 w-full max-w-7xl mx-auto mt-10">

        {/* SEARCH BAR */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-3 bg-[#F7FCFF] px-5 py-3 rounded-xl border border-gray-200">
            <img src={searchIcon} alt="search" className="w-5 opacity-60" />
            <input
              type="text"
              placeholder="Cari Daftar RFC..."
              className="bg-transparent outline-none w-full text-gray-700"
            />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Daftar RFC</h2>

        {/* LIST */}
        <div className="space-y-4">
          {rfcApprovals.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-[#F6FBFF] border border-gray-200 shadow-sm rounded-xl p-5"
            >
              <div className="flex items-center gap-4">
                <img src={docIcon} alt="doc" className="w-6" />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.date}
                  </p>
                </div>
              </div>

                <button
                onClick={() => navigate(`/Kasi/DetailApprovalKasi/${item.id}`)}
                className="text-[#02294A] font-semibold hover:underline"
                >
                Cek Detail
                </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DaftarApprovalKasi;
