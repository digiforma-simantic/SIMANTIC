import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SsoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('SSO Token:', token); // Debug log

    if (!token) {
      setStatus('error');
      setError('Token tidak ditemukan');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Simpan token SSO ke localStorage, hapus semua token lain
    localStorage.clear();
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');

    // Panggil backend SIMANTIC untuk proses registrasi user lokal
    const backendUrl = 'http://127.0.0.1:8000/api/sso/callback?token=' + encodeURIComponent(token);
    fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      mode: 'cors',
    })
      .then(async (res) => {
        if (!res.ok) {
          setStatus('error');
          setError('Gagal melakukan registrasi user ke backend SIMANTIC. Cek koneksi atau CORS.');
          return;
        }
        const data = await res.json();
        if (!data || !data.user) {
          setStatus('error');
          setError('Data user tidak ditemukan di response backend.');
          return;
        }
        const rawUser = data.user;
        let normalizedUser = null;
        if (rawUser && rawUser.id) {
          normalizedUser = {
            id: rawUser.id,
            name: rawUser.name || '',
            email: rawUser.email || '',
            nip: rawUser.nip || '',
            role: rawUser.roleObj?.slug || rawUser.role_obj?.slug || rawUser.role || 'staff',
            roleName: rawUser.roleObj?.name || rawUser.role_obj?.name || rawUser.role_name || '',
            dinas: rawUser.dinas?.name || rawUser.dinas_name || rawUser.dinas || '',
            dinasId: rawUser.dinas?.id || rawUser.dinas_id || '',
            ssoId: rawUser.sso_id || rawUser.ssoId || '',
            jenisKelamin: rawUser.jenis_kelamin || rawUser.jenisKelamin || '',
            jabatan: rawUser.jabatan || rawUser.roleObj?.name || rawUser.role || '',
            unitKerja: rawUser.unit_kerja || rawUser.unitKerja || '',
          };
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        }

        setStatus('success');

        setTimeout(() => {
          const roleSlug = normalizedUser?.role || 'staff';
          console.log('SSO User Role:', roleSlug); // Debug log

          if (roleSlug === 'teknisi') {
            setStatus('error');
            setError('Role Teknisi tidak memiliki akses ke aplikasi Change & Configuration Management. Silakan gunakan aplikasi Service Desk.');
            localStorage.clear();
            setTimeout(() => {
              window.location.href = 'https://api.bispro.digitaltech.my.id';
            }, 5000);
            return;
          }

          switch(roleSlug) {
            case 'admin_kota':
              navigate('/diskominfo/dashboarddiskominfo');
              break;
            case 'admin_dinas':
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
            case 'staff':
            default:
              navigate('/staff/dashboardstaff');
          }
        }, 1500);
      })
      .catch(err => {
        setStatus('error');
        setError('Gagal melakukan request ke backend SIMANTIC. Cek koneksi atau CORS.');
        console.error('Fetch to backend SIMANTIC error:', err);
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
            <h2 className="text-2xl font-bold text-red-700 mb-2">⚠️ Akses Ditolak</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">{error}</p>
            <p className="text-gray-500 text-sm">Anda akan dialihkan dalam beberapa detik...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SsoCallback;
