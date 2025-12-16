import React, { useState, useEffect } from "react";
import Headeradmin from "../../components/Admin/Headeradmin";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import { Link } from "react-router-dom";
import { assetsAPI } from "../../services/assetsApi";

export default function AsetAdmin() {
  const [loading, setLoading] = useState(true);
  const [allAssets, setAllAssets] = useState([]);

  /* =======================
     FETCH ALL ASSETS
  ======================== */
  useEffect(() => {
    let mounted = true;

    const fetchAllAssets = async () => {
      try {
        setLoading(true);
        const res = await assetsAPI.getAll();

        // asumsi response: { data: [...] }
        const assets = res?.data ?? [];

        if (mounted) setAllAssets(assets);
      } catch (err) {
        console.error("Error fetching assets:", err);
        if (mounted) setAllAssets([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAllAssets();
    return () => {
      mounted = false;
    };
  }, []);

  /* =======================
     FILTER LOGIC
  ======================== */
  const completeAssets = allAssets.filter(
    (asset) => asset?.ci_code && asset.ci_code.trim() !== ""
  );

  const incompleteAssets = allAssets.filter(
    (asset) => !asset?.ci_code || asset.ci_code.trim() === ""
  );

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
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Memuat data aset...</p>
            </div>
          ) : (
            <>
              {/* =======================
                  DAFTAR ASET LENGKAP
              ======================== */}
              <div className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Daftar Aset ({completeAssets.length})
                </h2>

                {completeAssets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Belum ada aset dengan data lengkap
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completeAssets.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white rounded-lg border border-[#E6EEF7] py-4 px-5"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.ci_code}
                          </p>
                        </div>

                        <Link
                          to={`/DaftarDetailAset/${item.id}`}
                          className="text-sm font-semibold text-[#005BBB] hover:underline"
                        >
                          Cek Detail
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* =======================
                  BUTUH LENGKAP DATA
              ======================== */}
              <div className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Butuh Lengkap Data ({incompleteAssets.length})
                </h2>

                {incompleteAssets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Semua aset sudah memiliki data lengkap
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {incompleteAssets.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white rounded-lg border border-[#E6EEF7] py-4 px-5"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            CI Code belum diisi
                          </p>
                        </div>

                        <Link
                          to={`/FormDetailAset/${item.id}`}
                          className="text-sm font-semibold text-[#005BBB] hover:underline"
                        >
                          Lengkapi Data
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}