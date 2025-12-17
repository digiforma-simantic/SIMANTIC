import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Landing() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Kalau belum login dan loading selesai → ke SSO
    if (!loading && !user) {
      window.location.href = "https://bispro.digitaltech.my.id";
    }

    // ❗ JANGAN redirect ke dashboard di sini
    // Dashboard sudah ditentukan oleh SSO Callback
  }, [user, loading]);

  // Loading screen saat cek auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memeriksa status login...</p>
        </div>
      </div>
    );
  }

  // Kalau sudah login, biarkan router jalan sendiri
  return null;
}

export default Landing;