
import React from "react";

const StatusPengajuanKasi = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 max-w-md text-center">
        <h1 className="text-xl font-semibold text-gray-900">Pantau Status hanya tersedia di Admin</h1>
        <p className="text-sm text-gray-600 mt-3">
          Silakan hubungi Admin Dinas Pendidikan untuk memeriksa perkembangan pengajuan atau minta mereka
          membagikan tautan status terbaru.
        </p>
      </div>
    </div>
  );
};

export default StatusPengajuanKasi;
