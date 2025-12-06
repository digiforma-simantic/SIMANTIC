import React from "react";
import Headernotifkasi from "../../components/Kabid/Headernotifikasikabid";

// ICON IMPORTS
import setujuhitam from "../../assets/setujuhitam.png";
import refreshhitam from "../../assets/refreshhitam.png";
import gagalhitam from "../../assets/gagalhitam.png";

import setujubiru from "../../assets/setujubiru.png";
import refreshbiru from "../../assets/refreshbiru.png";
import gagalbiru from "../../assets/gagalbiru.png";

// ==== DATA NOTIFIKASI ====

const notificationsToday = [
  {
    id: 1,
    icon: <img src={setujubiru} className="w-6 h-6" />,
    title: "Berhasil Diimplementasikan",
    description:
      "Perubahan instal aplikasi zoom pada laptop 01 telah selesai diimplementasikan",
    time: "Now",
    timeClass: "text-blue-700 font-semibold",
  },
  {
    id: 2,
    icon: <img src={refreshbiru} className="w-6 h-6" />,
    title: "Diterima oleh Diskominfo",
    description:
      'Permintaan “Instal Aplikasi Zoom pada Laptop-01” sudah diteruskan ke Diskominfo',
    time: "3j",
    timeClass: "text-blue-700 font-semibold",
  },
  {
    id: 3,
    icon: <img src={refreshbiru} className="w-6 h-6" />,
    title: "Diterima oleh Kepala Bidang",
    description:
      'Permintaan “Instal Aplikasi Zoom pada Laptop-01” disetujui Kepala Bidang',
    time: "5j",
    timeClass: "text-blue-700 font-semibold",
  },
  {
    id: 4,
    icon: <img src={refreshhitam} className="w-6 h-6" />,
    title: "Diterima oleh Kepala Saksi",
    description:
      'Permintaan “Instal Aplikasi Zoom pada Laptop-01” disetujui Kepala Saksi',
    time: "9j",
    timeClass: "text-gray-700",
    textClass: "text-gray-700",
  },
];

const notificationsYesterday = [
  {
    id: 5,
    icon: <img src={gagalhitam} className="w-6 h-6" />,
    title: "Pengajuan Gagal",
    description: 'Permintaan “Instal Game di PC-05” ditolak oleh Diskominfo',
    time: "2h",
    timeClass: "text-gray-700",
  },
];

// ==== PAGE COMPONENT ====

export default function NotifikasiKabid() {
  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      
      {/* HEADER NOTIF KHUSUS */}
      <Headernotifkasi />

      {/* BODY CONTENT */}
      <main className="max-w-[1400px] mx-auto mt-6 bg-[#F2FAFF] shadow-md rounded-2xl border border-[#E2EDF5] p-8 pb-14 space-y-10">

        {/* Hari Ini */}
        <section className="mb-8">
          <h2 className="font-bold text-gray-900 mb-4">Hari ini</h2>

          <ul className="divide-y divide-gray-200">
            {notificationsToday.map((item) => (
              <li key={item.id} className="flex justify-between py-5">
                <div className="flex gap-3 flex-1">
                  {item.icon}
                  <div>
                    <p
                      className={`font-semibold ${
                        item.textClass || "text-blue-700"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>

                <span className={`text-sm ml-4 ${item.timeClass}`}>
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Kemarin */}
        <section>
          <h2 className="font-bold text-gray-900 mb-4">Kemarin</h2>

          <ul className="divide-y divide-gray-200">
            {notificationsYesterday.map((item) => (
              <li key={item.id} className="flex justify-between py-5">
                <div className="flex gap-3 flex-1">
                  {item.icon}
                  <div>
                    <p className="font-semibold text-gray-700">{item.title}</p>
                    <p className="text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>

                <span className={`text-sm ml-4 ${item.timeClass}`}>
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </section>

      </main>
    </div>
  );
}
