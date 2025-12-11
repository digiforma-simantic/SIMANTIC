import React from "react";
import { Link } from "react-router-dom";

import searchIcon from "../../assets/search-normal.png";
import bellIcon from "../../assets/notification.png";
import userIcon from "../../assets/user.png";


import { useEffect, useState } from "react";

const Header = () => {
  const [userName, setUserName] = useState('-');
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user?.name || '-');
      } catch {
        setUserName('-');
      }
    } else {
      setUserName('-');
    }
    // Listen to localStorage changes (optional, for multi-tab)
    const syncUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserName(user?.name || '-');
        } catch {
          setUserName('-');
        }
      } else {
        setUserName('-');
      }
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <header className="w-full bg-[#F4FAFF] border-b border-[#E2EDF5] shadow-sm">
      <div
        className="px-6 py-4 flex items-center justify-between
        gap-6"
      >
        {/* SEARCH BAR */}
        <div className="flex-1">
          <div className="w-full bg-white rounded-xl border border-[#DCE6EE] px-4 py-3 flex items-center gap-3 shadow-sm">
            <img
              src={searchIcon}
              alt="Search"
              className="w-5 h-5 object-contain opacity-70"
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full text-sm outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* ICONS & USER */}
        <div className="flex items-center gap-4">

          <Link
            to="/Diskominfo/NotifikasiDiskominfo"
            className="w-11 h-11 bg-white border border-[#DCE6EE] rounded-lg flex items-center justify-center shadow-sm"
          >
            <img src={bellIcon} alt="Notification" className="w-5 h-5" />
          </Link>

          <Link
            to="/Diskominfo/DataUserDiskominfo"
            className="w-11 h-11 bg-white border border-[#DCE6EE] rounded-lg flex items-center justify-center shadow-sm"
          >
            <img src={userIcon} alt="User" className="w-5 h-5" />
          </Link>

          <span className="ml-1 text-sm font-semibold text-[#002444]">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
