import React from "react";
import { Link } from "react-router-dom";
import Headeruser from "../../components/Admin/Headeruser";

export default function ProfileNavigation() {
  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      
      {/* Header dari components */}
      <Headeruser />

      {/* Container */}
      <main className="flex mt-8 max-w-[1400px] mx-auto space-x-6">

        {/* Sidebar */}
        <aside className="bg-[#F2FAFF] p-6 rounded-lg shadow-md w-64 h-42">
          <h2 className="font-bold text-[#001729] mb-4">Navigasi Profil</h2>
          <nav className="flex flex-col space-y-2 text-[#001729] text-sm">
            <Link to="/UserStaff" className="hover:text-blue-700">
              Data user
            </Link>

            <Link to="/GantiPasswordStaff" className="font-semibold underline hover:text-blue-700">
              Ganti password
            </Link>
          </nav>
        </aside>

        {/* Card Content */}
        <section className="bg-[#F2FAFF] border border-[#E6E8EA] rounded-xl shadow-sm flex-1 px-10 py-10">
          <h2 className="text-center font-bold text-[#001729] text-xl mb-10">
            Ubah Password
          </h2>

          <form className="space-y-6 max-w-[700px] mx-auto">
            
            {/* Password Lama */}
            <div>
              <label className="block mb-2 font-medium text-[#001729]">
                Password Lama
              </label>
              <input
                type="password"
                placeholder="Masukkan password lama"
                className="w-full border border-[#E6E8EA] rounded-lg px-4 py-3 text-[#001729] placeholder-gray-400 focus:ring-2 focus:ring-[#001729]"
              />
            </div>

            {/* Password Baru */}
            <div>
              <label className="block mb-2 font-medium text-[#001729]">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Masukkan password baru"
                className="w-full border border-[#E6E8EA] rounded-lg px-4 py-3 text-[#001729] placeholder-gray-400 focus:ring-2 focus:ring-[#001729]"
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block mb-2 font-medium text-[#001729]">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                placeholder="Konfirmasi password"
                className="w-full border border-[#E6E8EA] rounded-lg px-4 py-3 text-[#001729] placeholder-gray-400 focus:ring-2 focus:ring-[#001729]"
              />
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <button className="bg-[#001729] text-white rounded-lg px-8 py-3 hover:bg-[#00223f] transition">
                Simpan
              </button>
            </div>

          </form>
        </section>
      </main>
    </div>
  );
}
