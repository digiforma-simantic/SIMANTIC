import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SsoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const path  = searchParams.get('path');
    const userEncoded = searchParams.get('user'); // base64

    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    // Bersihkan auth lama
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');

    // Simpan token
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');

    // Decode user
    if (userEncoded) {
      try {
        const userJson = atob(userEncoded);
        const user = JSON.parse(userJson);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.error('Gagal decode user dari SSO', err);
        localStorage.setItem('user', '{}');
      }
    }

    // Bersihkan URL
    window.history.replaceState({}, '', '/sso/callback');

    // Redirect ke dashboard
    navigate(path || '/staff/dashboardstaff', { replace: true });

  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">
          Memproses Login SSO
        </h2>
        <p className="text-gray-600">
          Mohon tunggu sebentar...
        </p>
      </div>
    </div>
  );
};

export default SsoCallback;