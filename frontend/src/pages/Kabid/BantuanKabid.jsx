import React from "react";
import { Link } from "react-router-dom"; // <-- Tambahkan ini
import Headerbantuankabid from "../../components/Kabid/HeaderBantuanKabid";

// ICON IMPORTS
import panahkanan from "../../assets/panahkanan.png";

// ==== DATA NOTIFIKASI ====

// Kamu bisa tambah object agar dynamic
const questions = [
  { text: "Bagaimana cara melakukan penindakan pengajuan?", path: "/BantuanKabid1" },
  { text: "Bagaimana cara melihat riwayat yang telah saya tindak?", path: "/BantuanKabid2" },
  { text: "Bagaimana cara melihat riwayat status perubahan sebelumnya?", path: "/BantuanKabid3" },
  { text: "Bagaimana cara memperbarui informasi profil saya?", path: "/BantuanKabid4" },
];

export default function Bantuan() {
  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      
      {/* Header Bantuan */}
      <Headerbantuankabid title="Bantuan" />

      {/* Content */}
      <main className="mt-8 max-w-[1400px] mx-auto">
        <section className="bg-[#F2FAFF] p-6 rounded-xl shadow-md border border-[#E2EDF5]">
          <h2 className="font-bold text-gray-900 mb-4 text-base">Pertanyaan Populer</h2>

          <ul className="space-y-3">
            {questions.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className="w-full flex justify-between items-center rounded-lg bg-[#F7FCFF] px-5 py-3 text-left text-gray-900 font-medium hover:bg-blue-100 transition border border-[#E6E8EA]"
                >
                  <span>{item.text}</span>
                  <img src={panahkanan} alt="next" className="w-5 h-5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
