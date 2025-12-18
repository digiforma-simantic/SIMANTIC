import React, { useEffect, useState } from "react";
import Headeradmin from "../../components/Admin/Headeradmin";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import { Link } from "react-router-dom";
import { configurationItemsAPI } from "../../services/configurationItemsApi";
import { useAuth } from "../../contexts/AuthContext";

export default function AsetAdmin() {
  const [ciList, setCiList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= GET USER ================= */
  const user = JSON.parse(localStorage.getItem("user"));
  const auth = useAuth(); // Custom hook to get auth info

  console.log("Auth User:", auth.user);

  /* ================= FETCH CI ================= */
  useEffect(() => {
    async function fetchCI() {
      try {
        const res = await configurationItemsAPI.getByUserId(auth.id);
        const allCi = res.data || res;

        // FILTER CI BERDASARKAN OWNER
        const myCi = allCi;

        setCiList(myCi);
      } catch (err) {
        console.error("Gagal mengambil CI", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchCI();
    }
  }, [user?.id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">
        <Sidebaradmin />
        <div className="flex-1 ml-0 md:ml-64">
          <Headeradmin />
          <div className="p-6">Memuat aset...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F7FCFF] min-h-screen font-geologica">
      {/* SIDEBAR */}
      <Sidebaradmin />

      {/* MAIN */}
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="p-6">
          <div className="bg-[#F2FAFF] border border-[#E2EDF5] rounded-xl shadow-sm p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Aset Saya
            </h2>

            {ciList.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Anda belum memiliki aset.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ciList.map((ci) => (
                  <div
                    key={ci.id}
                    className="flex items-center justify-between bg-white rounded-lg border border-[#E6EEF7] py-4 px-5"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {ci.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ci.asset_id}
                      </p>
                    </div>

                    <Link
                      to={`/Admin/DetailAsetSaya/${ci.asset_id}`}
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