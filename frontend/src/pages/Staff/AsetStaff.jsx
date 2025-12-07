import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { configItemsAPI } from "../../services/api";

const AssetCard = ({ id, name, ciCode }) => (
  <div className="bg-[#F7FBFF] rounded-xl border border-[#E6EEF7] p-4 flex justify-between items-center">
    <div>
      <h3 className="font-semibold text-[#0E2C4F]">{name}</h3>
      {ciCode && <p className="text-xs text-gray-500 mt-1">{ciCode}</p>}
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
  const { user, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await configItemsAPI.getAll();
        const data = response.data || [];
        // Filter berdasarkan dinas user (opsional)
        const filteredAssets = user?.dinasId 
          ? data.filter(item => item.owner_dinas_id === user.dinasId)
          : data;
        setAssets(filteredAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchAssets();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-[#F4FAFF] items-center justify-center">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

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

            {loading ? (
              <p className="text-center text-gray-500 py-8">Memuat data aset...</p>
            ) : assets.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Tidak ada aset tersedia</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.map((item) => (
                  <AssetCard 
                    key={item.id} 
                    id={item.id} 
                    name={item.name || `${item.type} - ${item.ci_code}`}
                    ciCode={item.ci_code}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
