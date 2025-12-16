import React, { useState, useEffect } from "react";
import { rfcAPI } from "../../services/api";
import { Link } from "react-router-dom";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import Headeradmin from "../../components/Admin/Headeradmin";
import tandaminus from "../../assets/tandaminusadmin.png";
import tandaseru from "../../assets/tandaseruadmin.png";

const DashboardAdmin = () => {
  // Ambil user dari localStorage hasil login SSO
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [rfcs, setRfcs] = useState([]);
  const [loadingRfcs, setLoadingRfcs] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);
  const [pantauStatus, setPantauStatus] = useState([]);
  const [loadingPantau, setLoadingPantau] = useState(true);
  // Fetch all RFC Approval for Pantau Status
  useEffect(() => {
    let isMounted = true;
    async function fetchPantauStatus() {
      try {
        const res = await rfcAPI.getPending();
        const resRfcs = await rfcAPI.getNull();  
        const list = res.data?.data;
        const rfcsData = resRfcs.data?.data;
        if (!isMounted) return;
        setPantauStatus(list);
        setRfcs(rfcsData);
      } catch (error) {
        console.error("Error fetching pantau status:", error);
        if (isMounted) setPantauStatus([]);
      } finally {
        if (isMounted) setLoadingPantau(false);
        if (isMounted) setLoadingRfcs(false);
      }
    }
    fetchPantauStatus();
    return () => { isMounted = false; };
  }, []);


  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FCFF]">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  console.log("Pantau Status Data:", pantauStatus);

  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">

      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">

        <Headeradmin />

        <div className="px-10 py-8">

          <div className="mb-8">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-3xl font-semibold text-gray-900">{user?.name || "-"}</h1>
            <p className="text-sm text-gray-500 mt-1">{user?.roleName || user?.role} - {user?.dinas || "N/A"}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#F2FAFF] rounded-2xl shadow-sm border border-[#E2EDF5] p-6">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[#001B33]">Daftar RFC</h2>

                <Link
                  className="text-xs font-semibold text-[#005BBB] hover:underline"
                  to="/Admin/DaftarApproval"
                >
                  Lihat Semua
                </Link>
              </div>

              {loadingRfcs ? (
                <p className="text-center text-gray-500 py-4">Memuat data approval...</p>
              ) : rfcs.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Tidak ada approval pending</p>
              ) : (
                <div className="space-y-4">
                  {rfcs.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-[#F9FCFF] border border-[#E6EEF7] rounded-xl p-4">

                      <div className="flex items-start gap-3">
                        <img src={item.priority === 'high' ? tandaseru : tandaminus} className="w-5" />
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-[10px] text-gray-500">{item.date}</p>
                        </div>
                      </div>

                      <Link to={`/Admin/DetailPermohonan/${item.id}`} className="text-xs text-[#005BBB] hover:underline">
                        Cek Detail
                      </Link>

                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[#001B33]">Pantau Status</h2>
                <Link
                  className="text-xs font-semibold text-[#005BBB] hover:underline"
                  to="/Admin/PantauStatus"
                >
                  Lihat Semua
                </Link>
              </div>

              {loadingPantau ? (
                <p className="text-center text-gray-500 py-4">Memuat data status...</p>
              ) : pantauStatus.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Tidak ada data status</p>
              ) : (
                <div className="space-y-4">
                  {pantauStatus.slice(0, 3).map((item) => {
                    // Status color logic
                    let color = "bg-gray-400";
                    if (item?.rfc?.status === "approved") color = "bg-green-500";
                    else if (item?.rfc?.status === "pending") color = "bg-blue-500";
                    else if (item?.rfc?.status === "rejected") color = "bg-red-500";
                    else if (!item?.rfc?.status) color = "bg-gray-400";
                    return (
                      <div key={item.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${color}`}></div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{item?.title ?? '-'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500">#000{item?.id ?? '-'}</p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-gray-500">{item?.created_at ? item.created_at : '-'}</p>
                            </div>
                          </div>
                        </div>
                        <Link 
                          to={`/Admin/StatusPengajuan/${item?.id}`} 
                          className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
                        >
                          Cek Status
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
