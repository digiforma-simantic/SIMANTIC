import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Tailwind Berhasil di SIMANTIC 🚀
      </h1>

      <p className="text-gray-600">
        React + Vite + Tailwind sudah aktif di folder frontend kamu!
      </p>

      <Link
        to="/"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Pergi ke Login
      </Link>
    </div>
  );
}
