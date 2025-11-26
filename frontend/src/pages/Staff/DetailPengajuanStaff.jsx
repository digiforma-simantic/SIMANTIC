import { useParams } from "react-router-dom";
import Headeruser from "../../components/Headeruser";

// assets
import berhasil from "../../assets/berhasil.png";
import kirim from "../../assets/kirim.png";

export default function DetailPengajuanStaff() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#F7FCFF] font-geologica">
      {/* Header */}
      <Headeruser />

      {/* Wrapper */}
      <div className="max-w-[1450px] mx-auto px-6 py-10">

        {/* TOP SECTION */}
        <div className="bg-[#F2FAFF] border border-[#E0EBF4] rounded-xl shadow-sm p-10">

          {/* ID + Status */}
          <div className="grid grid-cols-3 gap-16 items-start">

            {/* ID BOX */}
            <div className="flex flex-col gap-2">
              <p className="text-[15px] font-semibold text-[#001B33]">ID Pengajuan</p>
              <div className="w-[140px] text-center py-3 rounded-lg border border-[#DBE7F0] bg-[#F7FCFF] text-[#001729] font-medium">
                000{id}
              </div>
            </div>

            {/* STATUS BOX */}
            <div className="col-span-2 border border-[#DBE7F0] rounded-xl p-10 flex flex-col items-center text-center">

              {/* success indicator circle */}
              <div className="w-[60px] h-[60px] bg-[#E7FBEF] rounded-full flex items-center justify-center">
                <img src={berhasil} alt="success" className="w-7" />
              </div>

              <h2 className="text-[18px] font-bold text-[#001729] mt-4">
                Pembaruan Aplikasi E-Kinerja 2.1
              </h2>
              <p className="text-gray-500 text-sm mt-1">Sukses!</p>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="mt-14 border border-[#DCE8F2] rounded-xl px-10 py-12">
            <div className="flex items-center justify-between w-full">

              <Step active icon={kirim} title="Permintaan Diajukan" desc="Pengguna mengajukan permintaan" />
              <Line active />

              <Step active icon={berhasil} title="Validasi Kepala Seksi" desc="Permintaan telah divalidasi" />
              <Line active />

              <Step active icon={berhasil} title="Validasi Kepala Bidang" desc="Permintaan telah divalidasi" />
              <Line active />

              <Step active icon={berhasil} title="Validasi Diskominfo" desc="Permintaan telah divalidasi" />
              <Line active />

              <Step highlight icon={berhasil} title="Selesai" desc="Berhasil diimplementasikan" />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


/* --- TIMELINE STEP --- */
function Step({ icon, title, desc, active, highlight }) {
  return (
    <div className="flex flex-col items-center text-center max-w-[150px]">
      {/* Circle */}
      <div
        className={`w-[62px] h-[62px] rounded-full flex items-center justify-center border-2
          ${highlight 
            ? "border-[#23C55E] bg-[#F7FCFF]" 
            : active 
              ? "border-[#003049] bg-white"
              : "border-[#A7B9C9]"
          }`}
      >
        <img src={icon} className="w-[22px]" alt="" />
      </div>

      {/* Text */}
      <p
        className={`mt-3 font-semibold text-[13px] 
          ${highlight ? "text-[#23C55E]" : "#001729"}`
        }
      >
        {title}
      </p>
      <p className="text-[11px] text-[#6B7785] mt-1 leading-tight">{desc}</p>
    </div>
  );
}


/* --- LINE CONNECTOR --- */
function Line({ active }) {
  return (
    <div className={`flex-1 h-0.5 ${active ? "bg-[#23C55E]" : "bg-[#A7B9C9]"}`}></div>
  );
}
