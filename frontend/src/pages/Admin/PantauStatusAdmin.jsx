import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rfcApprovalAPI } from "../../services/api";
import { ssoUserApi } from "../../services/ssoUser";

// ICONS
import searchIcon from "../../assets/search-normal.png";
import docIcon from "../../assets/tandaminusadmin.png";

import HeaderPantauStatus from "../../components/Admin/HeaderPantauStatus";

const PantauStatusAdmin = () => {
  const navigate = useNavigate();

  const [rfcs, setRfcs] = useState([]);
  const [ssoUsers, setSsoUsers] = useState({}); // { [ssoId]: userData }
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil semua RFC yang sudah dikirim admin ke approval
  useEffect(() => {
    let isMounted = true;

    async function fetchRfcs() {
      try {
        // Ambil semua data dari tabel rfc approval
        const res = await rfcApprovalAPI.getAll();
        const list = res.data;
        if (!isMounted) return;
        setRfcs(list);

        // Ambil sso_id unik dari list
        const ssoIds = [
          ...new Set(
            list
              .map((x) => x?.rfc?.sso_id)
              .filter((id) => id !== null && id !== undefined && id !== "")
          ),
        ];

        // fetch nama dari SSO (paralel) + cache
        const results = await Promise.all(
          ssoIds.map(async (id) => {
            try {
              const r = await ssoUserApi.getById(id); // axios response
              return [String(id), r.data]; // r.data = payload dari SSO
            } catch (e) {
              console.error("Gagal ambil user SSO id:", id, e);
              return [String(id), null];
            }
          })
        );

        if (!isMounted) return;
        setSsoUsers((prev) => ({ ...prev, ...Object.fromEntries(results) }));
      } catch (error) {
        console.error("Error fetching RFCs:", error);
        if (isMounted) setRfcs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRfcs();

    return () => {
      isMounted = false;
    };
  }, []);

  // helper: ambil nama user dari payload SSO (fleksibel)
  const getSsoName = (ssoPayload) => {
    if (!ssoPayload) return null;
    if (ssoPayload.name) return ssoPayload.name;
    if (ssoPayload.data?.name) return ssoPayload.data.name;
    if (ssoPayload.data?.user?.name) return ssoPayload.data.user.name;
    if (ssoPayload.user?.name) return ssoPayload.user.name;
    return null;
  };

  const filteredRfcs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (rfcs ?? []).filter((item) =>
      (item?.rfc?.title ?? "").toLowerCase().includes(term)
    );
  }, [rfcs, searchTerm]);

  return (
    <div className="flex-1 flex flex-col ml-0 md:ml-0 transition-all">
      {/* HEADER */}
      <HeaderPantauStatus />

      {/* CARD WRAPPER */}
      <div className="bg-[#F2FAFF] shadow-md rounded-2xl p-8 w-full max-w-7xl mx-auto mt-10">
        {/* SEARCH BAR */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-3 bg-[#F7FCFF] px-5 py-3 rounded-xl border border-gray-200">
            <img src={searchIcon} alt="search" className="w-5 opacity-60" />
            <input
              type="text"
              placeholder="Cari Pantau Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-700"
            />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Pantau Status ({filteredRfcs.length})
        </h2>

        {/* LIST */}
        {loading ? (
          <p className="text-center text-gray-500 py-8">Memuat data...</p>
        ) : filteredRfcs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Tidak ada data RFC yang dipantau
          </p>
        ) : (
          <div className="space-y-4">
            {filteredRfcs.map((item) => {
              const ssoId = item?.rfc?.sso_id;
              const ssoPayload = ssoUsers[String(ssoId)];
              const requesterName = getSsoName(ssoPayload);

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-[#F6FBFF] border border-gray-200 shadow-sm rounded-xl p-5"
                >
                  <div className="flex items-center gap-4">
                    <img src={docIcon} alt="doc" className="w-6" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item?.rfc?.title ?? "-"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item?.rfc?.created_at ?? item?.created_at ?? "-"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {requesterName ? `${requesterName}` :  "-"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/Admin/StatusPengajuan/${item?.rfc_id}`)
                    }
                    className="text-[#02294A] font-semibold hover:underline"
                  >
                    Cek Status
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PantauStatusAdmin;
