import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import Headerauditor from "../../components/Auditor/Headerdetailpc";

const DetailPatchCompliance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F7FCFF]">

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1">

        {/* HEADER */}
        <Headerauditor />

        {/* PAGE CONTENT */}
        <div className="flex-1 p-10 max-w-7xl mx-auto w-full">

          {/* MAIN CARD */}
          <div className="bg-[#F2FAFF] rounded-2xl border border-[#E3ECF5] shadow-sm p-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* LEFT CARD - Periode Audit */}
              <div className="bg-white border-2 border-green-500 rounded-xl p-6">
                
                {/* Header */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Periode Audit</p>
                  <p className="text-xl font-semibold text-gray-900">Q4 2025</p>
                </div>

                {/* Nama Instansi */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dinas Kehutanan</h2>

                {/* Status Badge */}
                <div className="mt-4">
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg py-3 px-4 text-center">
                    <p className="text-green-600 font-semibold">Compliance</p>
                  </div>
                </div>
              </div>

              {/* RIGHT CARD - Catatan & Dokumen */}
              <div className="bg-white border border-[#E3ECF5] rounded-xl p-6 space-y-6">

                {/* Catatan Auditor */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Catatan Auditor</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Proses change sudah sesuai SOP, tidak ada temuan mayor.
                  </p>
                </div>

                {/* Lampiran Dokumen Auditor */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Lampiran Dokumen Auditor</h3>
                  
                  {/* File Item */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <p className="text-sm font-medium text-gray-900">DinasKehutanan-Q4-2025.pdf</p>
                      <p className="text-xs text-gray-500 mt-1">3.45 MB</p>
                    </div>
                    
                    <button className="flex items-center gap-2 text-sm text-[#005BBB] font-semibold hover:underline">
                      <Eye className="w-4 h-4" />
                      Lihat
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailPatchCompliance;