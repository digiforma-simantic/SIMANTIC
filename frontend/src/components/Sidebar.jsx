import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ⬅️ tambahkan ini

import simantic from "../assets/logosimantic.png";
import homeIcon from "../assets/home-outline.png";
import permohonanIcon from "../assets/permohonan.png";
import helpIcon from "../assets/message-question.png";
import logoutIcon from "../assets/Logout_Icon_UIA.png";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // ⬅️ ambil logout dari context

  const SidebarItem = ({ icon, label, onClick, children, open, active }) => (
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

        {children && (
          <svg
            className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {open && <div className="ml-10 mt-1 flex flex-col space-y-1">{children}</div>}
    </div>
  );

  // Pakai logout dari AuthContext
  const handleLogout = () => {
    // kalau mau sidebar nutup dulu di mobile
    if (onClose) onClose();

    // ini akan clear localStorage + sessionStorage + cookie + redirect
    logout();
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
            onClick={() => navigate("/staff/dashboardstaff")}
            active={location.pathname === "/staff/dashboardstaff"}
          />

          <SidebarItem
            icon={permohonanIcon}
            label="Aset"
            onClick={() => navigate("/staff/asetstaff")}
            active={location.pathname.startsWith("/staff/asetstaff")}
          />
        </nav>

        <div className="flex-1" />

        <div className="h-[3px] bg-white mx-6 mb-4 rounded-full" />

        <SidebarItem
          icon={helpIcon}
          label="Bantuan"
          onClick={() => navigate("/staff/bantuanstaff")}
          active={location.pathname === "/staff/bantuanstaff"}
        />

        <SidebarItem
          icon={logoutIcon}
          label="Logout"
          onClick={handleLogout} // ⬅️ cukup ini
        />
      </aside>
    </>
  );
};

export default Sidebar;
