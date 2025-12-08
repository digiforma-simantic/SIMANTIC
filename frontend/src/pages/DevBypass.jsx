import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DevBypass() {
  const navigate = useNavigate();

  useEffect(() => {
    // Bypass login - langsung set fake token dan redirect
    const mockToken = 'dev-bypass-token-12345';
    const mockUser = {
      id: 6,
      name: 'Kepala Seksi Dev',
      email: 'kepala.seksi@example.com',
      role: 'kepala_seksi',
      roleName: 'Kepala Seksi',
    };

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect ke dashboard
    navigate('/Kasi/dashboardkasi', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">🚀 Dev Bypass...</h1>
        <p className="text-gray-600 mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
