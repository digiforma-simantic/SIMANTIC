import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function DevLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickLogins = [
    { email: 'admin.kota@example.com', role: 'Admin Kota', path: '/Admin/dashboardadmin' },
    { email: 'kepala.dinas@example.com', role: 'Kepala Dinas', path: '/Kadis/dashboardkadis' },
    { email: 'kepala.seksi@example.com', role: 'Kepala Seksi', path: '/Kasi/dashboardkasi' },
    { email: 'admin.dinas@example.com', role: 'Admin Dinas', path: '/diskominfo/dashboarddiskominfo' },
    { email: 'staff@example.com', role: 'Staff', path: '/staff/dashboardstaff' },
    { email: 'auditor@example.com', role: 'Auditor', path: '/auditor/dashboardauditor' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validasi frontend
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }
    
    setLoading(true);
    setError('');

    console.log('🔐 Attempting login with:', { email, hasPassword: !!password });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/dev/login`, {
        email,
        password,
      });
      
      console.log('✅ Login response:', response.data);

      if (response.data.token) {
        // Save token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');

        // Fetch user data
        const userResponse = await axios.get(`${API_BASE_URL}/api/v1/me`, {
          headers: { Authorization: `Bearer ${response.data.token}` }
        });

        const userData = userResponse.data;
        
        // Debug: cek data dari API
        console.log('User data from API:', userData);
        console.log('Role object (camelCase):', userData.roleObj);
        console.log('Role object (snake_case):', userData.role_obj);
        console.log('Role slug:', userData.roleObj?.slug || userData.role_obj?.slug);
        
        const normalizedUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          nip: userData.nip,
          role: userData.roleObj?.slug || userData.role_obj?.slug || userData.role || 'staff',
          roleName: userData.roleObj?.name || userData.role_obj?.name || userData.role_name,
          dinas: userData.dinas?.name || userData.dinas_name,
          dinasId: userData.dinas?.id || userData.dinas_id,
        };

        console.log('Normalized user:', normalizedUser);
        console.log('Role slug for redirect:', normalizedUser.role);

        login(response.data.token, normalizedUser);

        // Redirect based on role
        const roleSlug = normalizedUser.role;
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
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login gagal. Cek email/password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail) => {
    setEmail(quickEmail);
    setPassword('password');
    
    // Auto submit
    setTimeout(async () => {
      const fakeEvent = { preventDefault: () => {} };
      await handleLogin(fakeEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 font-geologica">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Dev Login</h1>
          <p className="text-sm text-gray-600">Development Mode Only</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Quick Login</span>
          </div>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-2">
          {quickLogins.map((user) => (
            <button
              key={user.email}
              onClick={() => handleQuickLogin(user.email)}
              disabled={loading}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{user.role}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="text-blue-600 text-sm">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Development Only:</strong> Halaman ini hanya untuk testing. 
            Production menggunakan SSO login.
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Default password semua user: <code className="bg-yellow-100 px-1 rounded">password</code>
          </p>
        </div>
      </div>
    </div>
  );
}
