/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Custom hook to use auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil user dari localStorage jika sudah ada (SSO login)
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");
    if (!token && !isLoggedIn) {
      setLoading(false);
      return;
    }
    if (storedUser && isLoggedIn) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }
    // Jika tidak ada user di localStorage, bisa tambahkan fallback fetch ke API jika memang dibutuhkan
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    // Simpan token & flag login
    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", "true");

    // Opsional: simpan user ter-normalisasi juga kalau mau dipakai lagi
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    try {
      // 💣 Bersihkan semua localStorage & sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // (opsional) bersihkan cookie auth kalau ada
      document.cookie
        .split(";")
        .forEach((c) => {
          document.cookie =
            c.replace(/^ +/, "").replace(
              /=.*/,
              "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"
            );
        });
    } catch (e) {
      console.error("Failed to clear storage on logout:", e);
    }

    // Reset state user di React
    setUser(null);

    // Redirect ke domain utama setelah benar-benar bersih
    window.location.href = "https://bispro.digitaltech.my.id/";
    // atau kalau mau pakai relative: window.location.replace("https://bispro.digitaltech.my.id/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
