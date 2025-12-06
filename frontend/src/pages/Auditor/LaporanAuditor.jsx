import React, { useState } from "react";
import Sidebarauditor from "../../components/Auditor/Sidebarauditor";
import Headerauditor from "../../components/Auditor/Headerauditor";

const LaporanAudit = () => {
  const [formData, setFormData] = useState({
    opd: "",
    periodeAudit: "",
    deskripsi: "",
    hasilAudit: "",
    uploadFile: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      uploadFile: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submit logic here
  };

  return (
    <div className="flex min-h-screen bg-[#F7FCFF] font-geologica text-[#001B33]">
      <Sidebarauditor />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headerauditor />

        <div className="px-10 py-8">
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Laporan Audit</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* OPD */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  OPD <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="opd"
                  value={formData.opd}
                  onChange={handleInputChange}
                  placeholder="Contoh : Dinas Kesehatan"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Periode Audit (Right) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Periode Audit <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Tuliskan deskripsi mengapa perubahan ini diperlukan"
                  rows="4"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

            </div>

            {/* Periode Audit (Left) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Periode Audit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="periodeAudit"
                  value={formData.periodeAudit}
                  onChange={handleInputChange}
                  placeholder="Contoh : Q3 2025"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Upload File */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Periode Audit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-400 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">
                        {formData.uploadFile ? formData.uploadFile.name : "No File Choosen"}
                      </span>
                    </span>
                    <span className="bg-gray-100 px-4 py-1 rounded text-sm text-gray-700">
                      Choose File
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Hasil Audit */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Hasil Audit <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hasilAudit: "Compliant" }))}
                  className={`py-4 rounded-xl font-semibold text-sm transition-all ${
                    formData.hasilAudit === "Compliant"
                      ? "bg-green-200 text-green-800 border-2 border-green-400"
                      : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                  }`}
                >
                  Compliant
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hasilAudit: "Non-Compliant" }))}
                  className={`py-4 rounded-xl font-semibold text-sm transition-all ${
                    formData.hasilAudit === "Non-Compliant"
                      ? "bg-red-200 text-red-800 border-2 border-red-400"
                      : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                  }`}
                >
                  Non-Compliant
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Submit
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LaporanAudit;