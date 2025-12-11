import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DevLogin() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State untuk daftar user dev (quick login)
  const [devUsers, setDevUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  // Ambil daftar user dev dari backend (misal: hanya role tertentu)
  useEffect(() => {
    const fetchDevUsers = async () => {
      setLoadingUsers(true);
      try {
        // Ganti endpoint sesuai backend, misal: /api/auth/dev/users
        const response = await fetch('http://127.0.0.1:8000/api/auth/dev/users', {
          headers: { 'Accept': 'application/json' },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data.users)) {
          setDevUsers(data.users);
        } else {
          setDevUsers([]);
        }
      } catch {
        setDevUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchDevUsers();
  }, []);

  // Role to dashboard mapping
  const roleToDashboard = {
    'admin_kota': '/diskominfo/dashboarddiskominfo',
    'kepala_seksi': '/Kasi/dashboardkasi',
    'staff': '/staff/dashboardstaff',
    'admin_dinas': '/Admin/dashboardadmin',
    'kepala_dinas': '/Kadis/dashboardkadis',
    'auditor': '/auditor/dashboardauditor',
    'kepala_bidang': '/Kabid/dashboardkabid',
    'approver_kabid': '/Kabid/dashboardkabid',
  };

  const persistSession = (token, apiUser) => {
    const normalizedUser = {
      id: apiUser.id ?? null,
      name: apiUser.name ?? '',
      email: apiUser.email ?? '',
      nip: apiUser.nip ?? '',
      role: apiUser.roleObj?.slug ?? apiUser.role ?? 'staff',
      roleName: apiUser.roleObj?.name ?? apiUser.role ?? '',
      dinas: apiUser.dinas?.name ?? '',
      dinasId: apiUser.dinas?.id ?? apiUser.dinas_id ?? null,
      ssoId: apiUser.sso_id ?? apiUser.ssoId ?? '',
      jenisKelamin: apiUser.jenis_kelamin ?? apiUser.jenisKelamin ?? '',
      jabatan: apiUser.jabatan ?? apiUser.roleObj?.name ?? apiUser.role ?? '',
      unitKerja: apiUser.unit_kerja ?? apiUser.unitKerja ?? '',
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', normalizedUser.id ?? '');
    localStorage.setItem('userEmail', normalizedUser.email);
    localStorage.setItem('userName', normalizedUser.name);
    localStorage.setItem('userRole', normalizedUser.role);
    localStorage.setItem('userRoleName', normalizedUser.roleName);
    localStorage.setItem('userNip', normalizedUser.nip ?? '');
    localStorage.setItem('userJenisKelamin', normalizedUser.jenisKelamin ?? '');
    localStorage.setItem('userUnitKerja', normalizedUser.unitKerja ?? '');
    localStorage.setItem('userDinasId', normalizedUser.dinasId ?? '');
    localStorage.setItem('userDinasName', normalizedUser.dinas ?? '');
    localStorage.setItem('userSsoId', normalizedUser.ssoId ?? '');
    localStorage.setItem('userJabatan', normalizedUser.jabatan ?? '');

    authLogin(token, normalizedUser);
    return normalizedUser;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login via backend API (endpoint sesuai backend)
      const response = await fetch('http://127.0.0.1:8000/api/auth/dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const normalizedUser = persistSession(data.token, data.user);
        const dashboardPath = roleToDashboard[normalizedUser.role] || '/dashboard';
        navigate(dashboardPath);
        // Force reload agar context user terupdate dari localStorage
        window.location.reload();
      } else {
        setError(data.message || 'Email atau password salah');
        setLoading(false);
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan Laravel berjalan di http://127.0.0.1:8000');
      setLoading(false);
      console.error('Login error:', err);
    }
  };

  const handleQuickLogin = async (quickEmail) => {
    setEmail(quickEmail);
    setPassword('password');
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: quickEmail, password: 'password' }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const normalizedUser = persistSession(data.token, data.user);
        const dashboardPath = roleToDashboard[normalizedUser.role] || '/dashboard';
        navigate(dashboardPath);
      } else {
        setError(data.message || 'Quick login gagal. User mungkin belum ada di database.');
        setLoading(false);
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
      setLoading(false);
      console.error('Quick login error:', err);
    }
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
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

        {/* Quick Login Buttons (dinamis dari backend) */}
        <div className="space-y-2">
          {loadingUsers && (
            <div className="text-gray-500 text-sm">Memuat user dev...</div>
          )}
          {!loadingUsers && devUsers.length === 0 && (
            <div className="text-gray-400 text-sm">Tidak ada user dev ditemukan.</div>
          )}
          {!loadingUsers && devUsers.map((user) => (
            <button
              key={user.email}
              onClick={() => handleQuickLogin(user.email)}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg"
            >
              <p className="font-medium text-gray-900">{user.name || user.email}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              {user.role && (
                <span className="text-xs text-blue-500">{user.roleObj?.name || user.role}</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            Password semua user: <code className="bg-yellow-100 px-1 rounded font-bold">password</code>
          </p>
        </div>
      </div>
    </div>
  );
}
