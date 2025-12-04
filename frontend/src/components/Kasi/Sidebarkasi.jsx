import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import simantic from "../../assets/logosimantic.png";
import homeIcon from "../../assets/home-outline.png";
import permohonanIcon from "../../assets/permohonan.png";
import helpIcon from "../../assets/message-question.png";
import logoutIcon from "../../assets/Logout_Icon_UIA.png";
import riwayatIcon from "../../assets/riwayat.png";

const Sidebarkasi = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const SidebarItem = ({ icon, label, onClick, active }) => (
    <div className="w-full">
      <button
        onClick={onClick}
        className={`group flex items-center gap-3 pl-6 pr-3 py-2 rounded-lg w-full text-left transition-all duration-200 relative ${
          active ? "text-white font-semibold" : "text-white hover:font-semibold"
        }`}
      >
        <span
          className={`absolute left-0 top-0 h-full w-[5px] bg-white rounded-r-full transition ${
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
        <img src={icon} className="w-5 h-5 object-contain" alt="" />
        <span className="flex-1">{label}</span>
      </button>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 md:hidden transition ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-[#02294A] text-white flex flex-col pt-6 pb-8 transition transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-3 pl-6 mb-10">
          <img src={simantic} alt="SIMANTIC" className="h-9 object-contain" />
          <h1 className="text-xl font-bold tracking-wide">SIMANTIC</h1>
        </div>

        <nav className="space-y-3">
          <SidebarItem
            icon={homeIcon}
            label="Dashboard"
            onClick={() => navigate("/kasi")}
            active={location.pathname === "/kasi"}
          />

          <SidebarItem
            icon={permohonanIcon}
            label="Daftar Approval"
            onClick={() => navigate("/kasi/daftar-approval")}
            active={location.pathname === "/kasi/daftar-approval"}
          />

          <SidebarItem
            icon={riwayatIcon}
            label="Riwayat Approval"
            onClick={() => navigate("/kasi/riwayat-approval")}
            active={location.pathname === "/kasi/riwayat-approval"}
          />

          <SidebarItem
            icon={helpIcon}
            label="Bantuan"
            onClick={() => navigate("/kasi/bantuan")}
            active={location.pathname === "/kasi/bantuan"}
          />
        </nav>

        <div className="flex-1" />

        <div className="h-[3px] bg-white mx-6 mb-4 rounded-full" />

        <SidebarItem 
          icon={logoutIcon} 
          label="Logout" 
          onClick={handleLogout} 
        />
      </aside>
    </>
  );
};

export default Sidebarkasi;
