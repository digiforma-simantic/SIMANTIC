import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SsoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError('Token tidak ditemukan');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Simpan token ke localStorage
    localStorage.setItem('token', token);

    // Get user data dengan token
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/v1/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.id) {
          const user = data.data || data;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');

          setStatus('success');

          // Redirect berdasarkan role
          setTimeout(() => {
            const role = user.role || user.roleObj?.slug || 'staff';
            
            switch(role) {
              case 'admin_kota':
                navigate('/Admin/dashboardadmin');
                break;
              case 'kepala_dinas':
              case 'kadis':
                navigate('/Kadis/dashboardkadis');
                break;
              case 'kepala_seksi':
              case 'kasi':
                navigate('/Kasi/dashboardkasi');
                break;
              case 'kabid':
                navigate('/Kabid/dashboardkabid');
                break;
              case 'auditor':
                navigate('/auditor/dashboardauditor');
                break;
              case 'admin_dinas':
              case 'diskominfo':
                navigate('/diskominfo/dashboarddiskominfo');
                break;
              default:
                navigate('/staff/dashboardstaff');
            }
          }, 1500);
        } else {
          throw new Error('Gagal mendapatkan data user');
        }
      })
      .catch(err => {
        console.error('SSO callback error:', err);
        setStatus('error');
        setError(err.message || 'Gagal memproses login SSO');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 3000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Memproses Login SSO</h2>
            <p className="text-gray-600">Mohon tunggu sebentar...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Berhasil!</h2>
            <p className="text-gray-600">Mengalihkan ke dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Gagal</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">Mengalihkan ke halaman login...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SsoCallback;
