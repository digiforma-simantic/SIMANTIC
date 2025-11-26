import { useState } from "react";
import { Link } from "react-router-dom";
import logoSimantic from "../assets/logo-simantic-2.png";

export default function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FCFF] flex items-center justify-center p-4 font-[Geologica]">
      <div className="w-full max-w-4xl bg-[#F2FAFF] rounded-lg shadow-sm py-16">

        {/* Header */}
        <div className="w-full p-8">
          <h1 className="text-center text-xl font-extrabold text-[#00223E] -mt-6">
            Reset Kata Sandi
          </h1>
        </div>

        <div className="flex">

          {/* Left */}
          <div className="flex flex-1 items-center justify-center border-r border-gray-400 p-10">
            <div className="flex items-center gap-4">
              <img src={logoSimantic} alt="SIMANTIC" className="h-16 w-auto object-contain" />
              <span className="text-2xl font-extrabold text-[#00223E] uppercase">
                SIMANTIC
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col flex-1 p-10">
            <form className="flex flex-col space-y-6">

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                required
              />

              {/* Sandi Baru */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sandi Baru"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500 pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-500"
                >
                  {showPassword ? (
                    /* Eye open */
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
                    /* Eye slash */
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

              {/* Konfirmasi Sandi */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi Sandi Baru"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500 pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    /* Eye open */
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
                    /* Eye slash */
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

              {/* Tombol Kirim */}
              <button
                type="submit"
                className="w-full bg-[#00223E] hover:bg-[#00345E] text-white font-bold py-3 rounded-lg transition"
              >
                Kirim
              </button>

              <div className="text-center">
                <Link to="/" className="text-sm font-bold text-[#00223E] hover:underline">
                  Kembali ke Login
                </Link>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
