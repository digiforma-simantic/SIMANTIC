import React, { useEffect, useState } from "react";
import Headeradmin from "../../components/Admin/Headeradmin";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import { Link } from "react-router-dom";
import { assetsAPI } from "../../services/assetsApi";
import { configurationItemsAPI } from "../../services/configurationItemsApi";

export default function AsetAdmin() {
  const [loading, setLoading] = useState(true);
  const [assetsWithCI, setAssetsWithCI] = useState([]);
  const [assetsWithoutCI, setAssetsWithoutCI] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchAssetsAndCI = async () => {
      try {
        setLoading(true);

        /* =======================
           1️⃣ FETCH ASSETS
        ======================== */
        const assetRes = await assetsAPI.getAll();
        const assets = assetRes.data ?? [];

        /* =======================
           2️⃣ FETCH CONFIG ITEMS
        ======================== */
        const ciRes = await configurationItemsAPI.getAll();
        const ciList = ciRes.data ?? [];

        /* =======================
           3️⃣ BUILD CI LOOKUP MAP
        ======================== */
        const ciMap = new Map();
        ciList.forEach((ci) => {
          if (ci.asset_id) {
            ciMap.set(ci.asset_id, ci);
          }
        });

        /* =======================
           4️⃣ SPLIT ASSETS
        ======================== */
        const withCI = [];
        const withoutCI = [];

        assets.forEach((asset) => {
          const assetKey = asset.kode_bmd;

          if (ciMap.has(assetKey)) {
            withCI.push({
              ...asset,
              ci: ciMap.get(assetKey),
            });
          } else {
            withoutCI.push(asset);
          }
        });

        if (mounted) {
          setAssetsWithCI(withCI);
          setAssetsWithoutCI(withoutCI);
        }
      } catch (err) {
        console.error("Failed fetching asset & CI:", err);
        if (mounted) {
          setAssetsWithCI([]);
          setAssetsWithoutCI([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAssetsAndCI();
    return () => (mounted = false);
  }, []);


  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">
      <Sidebaradmin />

      <div className="flex-1 ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="p-6 space-y-10">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Memuat data aset & konfigurasi...
            </div>
          ) : (
            <>
              {/* =======================
                  ASET SUDAH MEMILIKI CI
              ======================== */}
              <section className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Aset Terdaftar sebagai Configuration Item ({assetsWithCI.length})
                </h2>

                {assetsWithCI.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">
                    Belum ada aset yang memiliki Configuration Item
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {assetsWithCI.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#E6EEF7] rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            CI Code: {item.ci.ci_code}
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
              </section>

              {/* =======================
                  ASET BELUM ADA CI
              ======================== */}
              <section className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Aset Butuh Lengkap Data CI ({assetsWithoutCI.length})
                </h2>

                {assetsWithoutCI.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">
                    Semua aset sudah memiliki CI
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {assetsWithoutCI.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#E6EEF7] rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            CI belum dibuat
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
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
