import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Jika belum login, redirect ke bispro
      if (!user) {
        window.location.href = "https://bispro.digitaltech.my.id";
      } else {
        // Jika sudah login, redirect ke dashboard sesuai role
        const role = user?.role?.toLowerCase();
        
        switch (role) {
          case "staff":
            navigate("/staff/dashboardstaff", { replace: true });
            break;
          case "admin":
            navigate("/Admin/dashboardadmin", { replace: true });
            break;
          case "kasi":
            navigate("/Kasi/dashboardkasi", { replace: true });
            break;
          case "kabid":
            navigate("/Kabid/dashboardkabid", { replace: true });
            break;
          case "kadis":
            navigate("/Kadis/dashboardkadis", { replace: true });
            break;
          case "auditor":
            navigate("/auditor/dashboardauditor", { replace: true });
            break;
          case "diskominfo":
            navigate("/diskominfo/dashboarddiskominfo", { replace: true });
            break;
          default:
            // Default ke staff dashboard jika role tidak dikenali
            navigate("/staff/dashboardstaff", { replace: true });
        }
      }
    }
  }, [user, loading, navigate]);

  // Tampilkan loading sementara memeriksa status login
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

  return null;
}

export default Landing;
