import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoSimantic from "../assets/logo-simantic-2.png";

// Base URL API backend Laravel
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const body = {
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/dev/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Coba parse JSON sekali saja
      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.warn("Response is not valid JSON:", parseErr);
      }

      if (!res.ok) {
        console.error("Login failed:", res.status, data);
        alert((data && data.message) || "Login failed");
        return;
      }

      // Simpan token & user info
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("user_email", data.user.email || "");
      }
      localStorage.setItem("isLoggedIn", "true");

      // Redirect setelah login
navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login error", err);
      alert("Failed to login");
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FCFF] flex items-center justify-center p-4 font-['Geologica']">
      <div className="w-full max-w-4xl bg-[#F2FAFF] rounded-lg shadow-sm py-14">
        {/* Header */}
        <div className="w-full px-6 sm:px-8 pb-4">
          <h1 className="text-center text-xl sm:text-2xl font-extrabold text-[#00223E]">
            Masuk Ke Akun Anda
          </h1>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Logo */}
          <div className="flex flex-1 items-center justify-center lg:border-r border-gray-300 p-8 sm:p-10">
            <div className="flex items-center gap-4">
              <img
                src={logoSimantic}
                alt="SIMANTIC"
                className="h-16 w-auto object-contain"
              />
              <span className="text-2xl font-extrabold text-[#00223E] uppercase">
                SIMANTIC
              </span>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex flex-col flex-1 p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              {/* Email */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition duration-150 focus:border-2 focus:border-black"
                required
              />

              {/* Password with eye toggle */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sandi"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition duration-150 focus:border-2 focus:border-black"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
                >
                  {showPassword ? (
                    // Eye open
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.036 12.322a1 1 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.964 7.178.07.207.07.431 0 .638C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    // Eye slash
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3.98 8.223A10.477 10.477 0 001.934 12c1.36 4.088 5.295 7 10.066 7 1.72 0 3.34-.37 4.78-1.035M6.228 6.228A10.45 10.45 0 0112 5c4.77 0 8.704 2.912 10.065 7-.432 1.299-1.117 2.47-2.01 3.455M6.228 6.228L3 3m3.228 3.228l3.65 3.65m0 0a3 3 0 104.243 4.243m-4.243-4.243l4.243 4.243M14.121 14.121L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-[#00223E] hover:underline"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#00223E] text-white py-3 rounded-lg font-bold hover:bg-[#00162A] transition"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// (Opsional) ikon Google kalau nanti mau dipakai login Google
function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.84h5.37c-.24 1.26-1.45 3.69-5.37 3.69-3.24 0-5.88-2.67-5.88-5.97S8.76 5.79 12 5.79c1.84 0 3.08.78 3.79 1.44l2.58-2.49C16.7 3.2 14.55 2.4 12 2.4 6.99 2.4 2.94 6.45 2.94 11.46S6.99 20.52 12 20.52c6.93 0 9.06-4.84 9.06-7.35 0-.49-.05-.86-.11-1.23H12Z"
      />
      <path
        fill="#34A853"
        d="M3.11 7.15l3.16 2.32C7.13 7.3 9.38 5.79 12 5.79c1.84 0 3.08.78 3.79 1.44l2.58-2.49C16.7 3.2 14.55 2.4 12 2.4 8.35 2.4 5.25 4.44 3.11 7.15Z"
      />
      <path
        fill="#FBBC05"
        d="M12 20.52c3.57 0 6.56-1.76 8.03-4.47l-3.25-2.66c-.88 1.67-2.56 2.79-4.78 2.79-3.92 0-7.17-2.43-7.69-5.57l-3.2 2.47c1.36 4.19 5.19 7.44 10.89 7.44Z"
      />
      <path
        fill="#4285F4"
        d="M21.06 13.17c.08-.49.12-.99.12-1.5 0-.51-.04-1.01-.12-1.5H12v3h9.06Z"
      />
    </svg>
  );
}
