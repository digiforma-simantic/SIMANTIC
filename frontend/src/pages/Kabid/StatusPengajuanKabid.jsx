import React from "react";

const StatusPengajuanKabid = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 max-w-md text-center">
        <h1 className="text-xl font-semibold text-gray-900">Pantau Status telah dipusatkan di Admin</h1>
        <p className="text-sm text-gray-600 mt-3">
          Kepala Bidang tidak lagi memiliki akses langsung ke halaman pantau status. Koordinasikan dengan Admin
          Dinas Pendidikan untuk melihat perkembangan terbaru.
        </p>
      </div>
    </div>
  );
};

export default StatusPengajuanKabid;
