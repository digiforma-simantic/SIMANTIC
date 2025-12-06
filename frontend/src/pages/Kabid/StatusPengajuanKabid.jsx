import React from 'react';
import { Check, Send } from 'lucide-react';
import Headerstapeng from "../../components/Kabid/Headerstapeng";

const StatusPengajuan = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER PAKAI KOMPONEN */}
      <Headerstapeng />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-10">
          
          {/* Top Section - ID & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-14">
            
            {/* ID Pengajuan */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-900">ID Pengajuan</p>
              <div className="w-32 text-center py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium">
                0001
              </div>
            </div>

            {/* Status Card */}
            <div className="lg:col-span-2 border border-gray-200 rounded-xl bg-white p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Pembaruan Aplikasi E-Kinerja 2.1
              </h2>
              <p className="text-gray-600 text-sm mt-1">Sukses!</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="border border-gray-200 rounded-xl bg-white px-10 py-12">
            <div className="flex items-start justify-between">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center" style={{maxWidth: '140px'}}>
                <div className="w-16 h-16 rounded-full border-2 border-gray-800 bg-white flex items-center justify-center">
                  <Send className="w-6 h-6 text-gray-800" />
                </div>
                <p className="mt-3 font-semibold text-sm text-gray-900">Permintaan Diajukan</p>
                <p className="text-xs text-gray-500 mt-1">Pengguna mengajukan permintaan</p>
              </div>

              {/* Line 1 */}
              <div className="flex-1 h-0.5 bg-green-500 mt-8 mx-2"></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center" style={{maxWidth: '140px'}}>
                <div className="w-16 h-16 rounded-full border-2 border-gray-800 bg-white flex items-center justify-center">
                  <Check className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
                </div>
                <p className="mt-3 font-semibold text-sm text-gray-900">Validasi Kepala Seksi</p>
                <p className="text-xs text-gray-500 mt-1">Permintaan telah divalidasi</p>
              </div>

              {/* Line 2 */}
              <div className="flex-1 h-0.5 bg-green-500 mt-8 mx-2"></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center" style={{maxWidth: '140px'}}>
                <div className="w-16 h-16 rounded-full border-2 border-gray-800 bg-white flex items-center justify-center">
                  <Check className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
                </div>
                <p className="mt-3 font-semibold text-sm text-gray-900">Validasi Kepala Bidang</p>
                <p className="text-xs text-gray-500 mt-1">Permintaan telah divalidasi</p>
              </div>

              {/* Line 3 */}
              <div className="flex-1 h-0.5 bg-green-500 mt-8 mx-2"></div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center" style={{maxWidth: '140px'}}>
                <div className="w-16 h-16 rounded-full border-2 border-gray-800 bg-white flex items-center justify-center">
                  <Check className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
                </div>
                <p className="mt-3 font-semibold text-sm text-gray-900">Validasi Diskominfo</p>
                <p className="text-xs text-gray-500 mt-1">Permintaan telah divalidasi</p>
              </div>

              {/* Line 4 */}
              <div className="flex-1 h-0.5 bg-green-500 mt-8 mx-2"></div>

              {/* Step 5 - Final */}
              <div className="flex flex-col items-center text-center" style={{maxWidth: '140px'}}>
                <div className="w-16 h-16 rounded-full border-2 border-green-500 bg-white flex items-center justify-center">
                  <Check className="w-7 h-7 text-green-500" strokeWidth={3} />
                </div>
                <p className="mt-3 font-semibold text-sm text-green-500">Selesai</p>
                <p className="text-xs text-gray-500 mt-1">Berhasil diimplementasikan</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatusPengajuan;
