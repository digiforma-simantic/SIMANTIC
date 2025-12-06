import React from "react";
import { Link, useNavigate } from "react-router-dom";

import notificationIcon from "../../assets/notification.png";
import calendarIcon from "../../assets/calendar.png";
import userIcon from "../../assets/user.png";
import panahkembali from "../../assets/panahkembali.png"

export default function Headerptcom() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#F4FAFF] w-full px-6 py-5 flex items-center justify-between border-b border-[#E2EDF5] shadow-sm">

      {/* LEFT — Back + Title */}
      <div className="flex items-center gap-4">
        {/* Panah tanpa box */}
        <button
          onClick={() => navigate(-1)}
          className="text-2xl text-[#002444] hover:text-gray-700"
        >
          <img src={panahkembali} alt="back" className="w-5 h-5"></img>
        </button>

        <h1 className="text-lg font-semibold text-[#002444]">
          Detail Change Summary
        </h1>
      </div>

      {/* RIGHT — Icons + Username */}
      <div className="flex items-center gap-4">

        {/* Notifikasi Icon */}
        <Link
        to="/Auditor/NotifikasiAuditor"
          className="w-11 h-11 bg-white border border-[#E2EDF5] rounded-lg flex items-center justify-center shadow-sm"
        >
          <img src={notificationIcon} alt="notif" className="w-5 h-5" />
        </Link>

        {/* Profil Icon */}
        <Link
          to="/Auditor/DataUserAuditor"
          className="w-11 h-11 bg-white border border-[#E2EDF5] rounded-lg flex items-center justify-center shadow-sm"
        >
          <img src={userIcon} alt="user" className="w-5 h-5" />
        </Link>

        {/* Username berdiri sendiri */}
        <span className="text-[#002444] font-medium">Sudarsono</span>
      </div>
    </header>
  );
}
