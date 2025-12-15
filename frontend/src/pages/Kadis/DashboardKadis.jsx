import React from "react";
import { Link } from "react-router-dom";
import Sidebaradmin from "../../components/Kadis/Sidebarkadis";
import Headeradmin from "../../components/Kadis/Headerkadis";

const DashboardKadis = () => {
  // Data untuk Daftar RFC
  const daftarApprovals = [
    { id: 1, status: 'approved'},
    { id: 2, status: 'pending'},
    { id: 3, status: 'pending'},
  ];
  
  // Ambil user dari localStorage hasil login SSO
  const [user, setUser] = React.useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  React.useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);


  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">
      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="px-10 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">Selamat datang,</p>
            <h1 className="text-3xl font-semibold text-gray-900">{user ? user.name   : "Loading..."}</h1>
          </div>

          {/* Status Approval Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#001B33] mb-6">Status Approval</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Ditunggu</p>
                <p className="text-4xl font-bold text-gray-900">11</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Disetujui</p>
                <p className="text-4xl font-bold text-gray-900">3</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Ditolak</p>
                <p className="text-4xl font-bold text-gray-900">2</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Diterima</p>
                <p className="text-4xl font-bold text-gray-900">6</p>
              </div>
            </div>
          </div>

          {/* Daftar RFC */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#001B33]">Daftar RFC</h2>
                <Link
                  to="/Kasi/DaftarApprovalKasi"
                  className="text-sm text-[#02294A] font-semibold hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>            

              <div className="space-y-4">
                {daftarApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">Install Aplikasi Kerja</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">#0001</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">17 Agustus 2025</p>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to={`/Kadis/DetailApprovalKadis/${item.id}`} 
                      className="text-xs font-medium text-[#005BBB] hover:underline whitespace-nowrap"
                    >
                      Cek Detail
                    </Link>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKadis;