import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import simantic from "../../assets/logosimantic.png";
import homeIcon from "../../assets/home-outline.png";
import asetIcon from "../../assets/permohonan.png";
import asetSayaIcon from "../../assets/home-outline.png";
import daftarAsetIcon from "../../assets/riwayat.png";
import helpIcon from "../../assets/message-question.png";
import logoutIcon from "../../assets/Logout_Icon_UIA.png";
import riwayatIcon from "../../assets/riwayat.png";

const Sidebar = ({ isOpen, onClose }) => {
  const [openAset, setOpenAset] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpenAset(location.pathname.startsWith("/admin/aset"));
  }, [location.pathname]);

  const SidebarItem = ({ icon, label, onClick, children, open, active }) => (
    <div className="w-full">
      <button
        onClick={onClick}
        className={`group flex items-center gap-3 pl-6 pr-3 py-2 rounded-lg w-full text-left transition-all duration-200 relative ${
          active ? "text-white font-semibold" : "text-white hover:font-semibold"
        }`}
      >
        {/* Active vertical bar */}
        <span
          className={`absolute left-0 top-0 h-full w-[5px] bg-white rounded-r-full transition-all duration-300 ${
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />

        {/* Icon */}
        <img src={icon} className="w-5 h-5 object-contain" alt="" />

        <span className="flex-1">{label}</span>

        {children && (
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Submenu with smooth animation */}
      {children && (
        <div
          className={`flex flex-col ml-10 overflow-hidden transition-all duration-300 ${
            open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 md:hidden transition ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-[#02294A] text-white flex flex-col pt-6 pb-8 transition transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 pl-6 mb-10">
          <img src={simantic} alt="SIMANTIC" className="h-9 object-contain" />
          <h1 className="text-xl font-bold tracking-wide">SIMANTIC</h1>
        </div>

        {/* Menu */}
        <nav className="space-y-3">

          {/* HOME */}
          <SidebarItem
            icon={homeIcon}
            label="Home"
            onClick={() => navigate("/Admin/DashboardAdmin")}
            active={location.pathname === "/Admin/DashboardAdmin"}
          />

          {/* ASET MENU */}
          <SidebarItem
            icon={asetIcon}
            label="Aset"
            onClick={() => setOpenAset(!openAset)}
            open={openAset}
            active={location.pathname.startsWith("/admin/aset")}
          >
            <button
              className={`text-sm py-2 text-left ${
                location.pathname === "/Admin/AsetSaya"
                  ? "font-semibold text-white"
                  : "text-gray-200 hover:text-white"
              }`}
              onClick={() => navigate("/Admin/AsetSaya")}
            >
              Aset Saya
            </button>

            <button
              className={`text-sm py-2 text-left ${
                location.pathname === "/Admin/DaftarAset"
                  ? "font-semibold text-white"
                  : "text-gray-200 hover:text-white"
              }`}
              onClick={() => navigate("/Admin/DaftarAset")}
            >
              Daftar Aset
            </button>
          </SidebarItem>

          {/* RIWAYAT */}
          <SidebarItem
            icon={riwayatIcon}
            label="Riwayat"
            onClick={() => navigate("/Admin/RiwayatApproval")}
            active={location.pathname === "/Admin/RiwayatApproval"}
          />

        </nav>

        {/* Footer */}
        <div className="flex-1" />
        <div className="h-[3px] bg-white mx-6 mb-4 rounded-full" />

        {/* Bantuan */}
        <SidebarItem
          icon={helpIcon}
          label="Bantuan"
          onClick={() => navigate("/Admin/Bantuan")}
          active={location.pathname === "/Admin/Bantuan"}
        />

        {/* Logout */}
        <SidebarItem icon={logoutIcon} label="Logout" onClick={handleLogout} />
      </aside>
    </>
  );
};

export default Sidebar;
