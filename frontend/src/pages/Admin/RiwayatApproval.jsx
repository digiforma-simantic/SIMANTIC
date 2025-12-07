import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebaradmin";
import Header from "../../components/Admin/Headeradmin";
import { Link } from "react-router-dom";
import { rfcAPI } from "../../services/api";

export default function RiwayatApproval() {
  const [riwayatApproval, setRiwayatApproval] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await rfcAPI.getHistory();
        setRiwayatApproval(response.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

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
              Riwayat Approval ({riwayatApproval.length})
            </h2>

            {/* GRID LIST */}
            {loading ? (
              <p className="text-center text-gray-500 py-8">Memuat data...</p>
            ) : riwayatApproval.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada riwayat approval</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {riwayatApproval.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#F9FCFF] 
                               border border-[#E6EEF7] rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* STATUS ICON */}
                      <span className={`w-3 h-3 rounded-full ${
                        item.my_decision === 'approved' ? 'bg-green-500' : 
                        item.my_decision === 'rejected' ? 'bg-red-500' : 
                        'bg-orange-500'
                      }`}></span>

                      {/* TITLE + INFO */}
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.requester?.name} • {item.created_at}
                        </p>
                        <p className="text-xs font-medium text-gray-700 mt-1">
                          Keputusan: <span className={item.my_decision === 'approved' ? 'text-green-600' : 'text-red-600'}>
                            {item.my_decision === 'approved' ? 'Disetujui' : 'Ditolak'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/DetailPengajuan/${item.id}`}
                      className="text-sm font-semibold text-[#005BBB] hover:underline"
                    >
                      Cek Detail
                    </Link>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
