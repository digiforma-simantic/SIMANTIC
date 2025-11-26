import { Link } from "react-router-dom";
import Headeruser from "../../components/Headeruser";

export default function ProfileNavigation() {
  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">

      {/* Header dari components */}
      <Headeruser />

      {/* Main content */}
      <main className="flex mt-8 max-w-[1400px] mx-auto space-x-6">
        
        {/* Sidebar */}
        <aside className="bg-[#F2FAFF] p-6 rounded-lg shadow-md w-64 h-42">
          <h2 className="font-bold text-[#001729] mb-4">Navigasi Profil</h2>
          <nav className="flex flex-col space-y-2 text-[#001729] text-sm">
            <Link to="/UserStaff" className="font-semibold underline hover:text-blue-700">
              Data user
            </Link>

            <Link to="/GantiPasswordStaff" className="hover:text-blue-700">
              Ganti password
            </Link>
          </nav>
        </aside>

        {/* Profile Form */}
        <section className="bg-[#F2FAFF] p-8 rounded-lg shadow-md flex-1">
          <h2 className="text-center font-bold text-[#001729] text-lg mb-6">
            Selamat datang, Slamet Budianto!
          </h2>

          <form className="space-y-6">

            {/* Nama lengkap */}
            <div>
              <label className="block mb-1 font-semibold text-[#001729]">
                Nama lengkap
              </label>
              <input
                type="text"
                defaultValue="Slamet Budianto"
                readOnly
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-[#001729] focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Jenis Kelamin & NIP */}
            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block mb-1 font-semibold text-[#001729]">
                  Jenis kelamin
                </label>
                <input
                  type="text"
                  defaultValue="Laki - Laki"
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-[#001729] focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-[#001729]">
                  NIP
                </label>
                <input
                  type="text"
                  defaultValue="110920471983"
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-[#001729] focus:ring-2 focus:ring-blue-400"
                />
              </div>

            </div>

            {/* Jabatan & Unit Kerja */}
            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block mb-1 font-semibold text-[#001729]">
                  Jabatan
                </label>
                <input
                  type="text"
                  defaultValue="Staff"
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-[#001729] focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-[#001729]">
                  Unit Kerja
                </label>
                <input
                  type="text"
                  defaultValue="Bidang Pencegahan Penyakit"
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-[#001729] focus:ring-2 focus:ring-blue-400"
                />
              </div>

            </div>

            {/* Asal Dinas & Email */}
            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block mb-1 font-semibold text-[#001729]">
                  Asal Dinas
                </label>
                <input
                  type="text"
                  defaultValue="Dinas Kesehatan Prov. Jawa Timur"
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-[#001729] focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-[#001729]">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="slametbudi@gmail.com"
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-[#001729] focus:ring-2 focus:ring-blue-400"
                />
              </div>

            </div>

            {/* Button */}
            

          </form>
        </section>
      </main>
    </div>
  );
}
