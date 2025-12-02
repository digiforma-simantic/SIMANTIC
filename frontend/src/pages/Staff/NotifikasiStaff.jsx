import React, { useEffect, useState } from "react";
import Headernotif from "../../components/Headernotif";

import refreshhitam from "../../assets/refreshhitam.png";
import gagalhitam from "../../assets/gagalhitam.png";
import setujubiru from "../../assets/setujubiru.png";
import refreshbiru from "../../assets/refreshbiru.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function statusToIcon(status) {
  if (!status) return <img src={refreshhitam} className="w-6 h-6" alt="status" />;
  const s = status.toLowerCase();
  if (s.includes("berhasil"))
    return <img src={setujubiru} className="w-6 h-6" alt="berhasil" />;
  if (s.includes("diterima"))
    return <img src={refreshbiru} className="w-6 h-6" alt="diterima" />;
  if (s.includes("gagal"))
    return <img src={gagalhitam} className="w-6 h-6" alt="gagal" />;
  return <img src={refreshhitam} className="w-6 h-6" alt="default" />;
}

export default function NotifikasiStaff() {
  const [today, setToday] = useState([]);
  const [yesterday, setYesterday] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/v1/notification/staff`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          console.error("Not JSON response", await res.text());
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (json.status && json.data) {
          setToday(json.data.today || []);
          setYesterday(json.data.yesterday || []);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  async function markAsRead(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/notifications/${id}/read`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setToday((prev) => prev.filter((n) => n.id !== id));
        setYesterday((prev) => prev.filter((n) => n.id !== id));
      } else {
        console.error("Mark as read failed", res.status);
      }
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      <Headernotif />

      <main className="max-w-[1400px] mx-auto mt-6 bg-[#F2FAFF] shadow-md rounded-2xl border border-[#E2EDF5] p-8 pb-14 space-y-10">
        <section className="mb-8">
          <h2 className="font-bold text-gray-900 mb-4">Hari ini</h2>

          <ul className="divide-y divide-gray-200">
            {loading ? (
              <li className="py-5">Loading...</li>
            ) : today.length === 0 ? (
              <li className="py-5 text-sm text-gray-500">
                Belum ada notifikasi hari ini.
              </li>
            ) : (
              today.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-start py-5"
                >
                  <div className="flex gap-3 flex-1">
                    {statusToIcon(item.status)}
                    <div>
                      <p
                        className={`font-semibold ${
                          item.textClass || "text-blue-700"
                        }`}
                      >
                        {item.status}
                      </p>
                      <p className="text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span
                      className={`text-sm ${
                        item.timeClass || "text-gray-700"
                      }`}
                    >
                      {item.time_label || item.created_at}
                    </span>
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="text-xs text-blue-600"
                    >
                      Tandai sudah dibaca
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-4">Kemarin</h2>

          <ul className="divide-y divide-gray-200">
            {loading ? (
              <li className="py-5">Loading...</li>
            ) : yesterday.length === 0 ? (
              <li className="py-5 text-sm text-gray-500">
                Tidak ada notifikasi kemarin.
              </li>
            ) : (
              yesterday.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-start py-5"
                >
                  <div className="flex gap-3 flex-1">
                    {statusToIcon(item.status)}
                    <div>
                      <p className="font-semibold text-gray-700">
                        {item.status}
                      </p>
                      <p className="text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span
                      className={`text-sm ${
                        item.timeClass || "text-gray-700"
                      }`}
                    >
                      {item.time_label || item.created_at}
                    </span>
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="text-xs text-blue-600"
                    >
                      Tandai sudah dibaca
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
