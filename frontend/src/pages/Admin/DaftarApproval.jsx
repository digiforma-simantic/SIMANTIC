import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rfcAPI } from "../../services/api";
import { ssoUserApi } from "../../services/ssoUser";

// ICONS
import searchIcon from "../../assets/search-normal.png";
import docIcon from "../../assets/tandaminusadmin.png";

import Headerdafapp from "../../components/Admin/Headerdafapp";

const DaftarApprovalAdmin = () => {
  const navigate = useNavigate();

  const [approvals, setApprovals] = useState([]);
  const [ssoUsers, setSsoUsers] = useState({}); // { [ssoId]: userData }
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ambil Daftar RFC
  useEffect(() => {
    let isMounted = true;

    async function fetchApprovals() {
      try {
        const res = await rfcAPI.getNull();

        // backend kamu: { success: true, data: [...] }
        const list = res?.data?.data;
        console.log("Fetched approvals:", list);

        if (!isMounted) return;
        setApprovals(list);

        // ambil sso_id unik dari list
        const ssoIds = [
          ...new Set(
            list
              .map((x) => x?.sso_id)
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
        console.error("Error fetching approvals:", error);
        if (isMounted) setApprovals([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchApprovals();

    return () => {
      isMounted = false;
    };
  }, []);

  // helper: ambil nama user dari payload SSO (fleksibel)
  const getSsoName = (ssoPayload) => {
    if (!ssoPayload) return null;

    // coba beberapa kemungkinan struktur response SSO
    // 1) { name: "..." }
    if (ssoPayload.name) return ssoPayload.name;

    // 2) { data: { name: "..." } }
    if (ssoPayload.data?.name) return ssoPayload.data.name;

    // 3) { data: { user: { name: "..." } } }
    if (ssoPayload.data?.user?.name) return ssoPayload.data.user.name;

    // 4) { user: { name: "..." } }
    if (ssoPayload.user?.name) return ssoPayload.user.name;

    return null;
  };

  const formatTanggalID = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredApprovals = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (approvals ?? []).filter((item) => {
      const titleMatch = (item?.title ?? "").toLowerCase().includes(term);
      const status = item?.status;
      // Pastikan hanya yang benar-benar null/undefined/empty string, bukan 'pending'
      const isNullStatus = status === null || status === undefined;
      return titleMatch && isNullStatus;
    });
  }, [approvals, searchTerm]);

  console.log("Filtered Approvals:", filteredApprovals);
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-700"
            />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Daftar RFC ({filteredApprovals.length})
        </h2>

        {/* LIST */}
        {loading ? (
          <p className="text-center text-gray-500 py-8">Memuat data...</p>
        ) : filteredApprovals.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Tidak ada approval pending
          </p>
        ) : (
          <div className="space-y-4">
            {filteredApprovals.map((item) => {
              const ssoId = item?.sso_id;
              const ssoPayload = ssoUsers[String(ssoId)];
              console.log("ssoUsers:", ssoUsers); 
              console.log("SSO Payload for ID", ssoId, ":", ssoPayload);
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
                        {item?.title ?? "-"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {formatTanggalID(item?.created_at)}
                      </p>

                      <p className="text-xs text-gray-400">
                        {requesterName
                          ? `${requesterName}`
                          :  "-"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/Admin/DetailPermohonan/${item?.id}`)
                    }
                    className="text-[#02294A] font-semibold hover:underline"
                  >
                    Cek Detail
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

export default DaftarApprovalAdmin;