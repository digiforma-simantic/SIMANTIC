import React, { useEffect, useMemo, useState } from "react";
import { Check, Send, Clock, XCircle } from "lucide-react";
import Headeradmin from "../../components/Admin/Headeradmin";
import Sidebaradmin from "../../components/Admin/Sidebaradmin";
import { useParams } from "react-router-dom";
import { rfcAPI } from "../../services/api";

// Urutan step sesuai proses
const STEP_KEYS = ["submitted", "kepala_seksi", "kepala_bidang", "kepala_dinas", "admin_dinas", "done"];

const normalize = (v) => (v ? String(v).toLowerCase().trim() : "");

function getActiveStep(rfc) {
  if (!rfc) return 0;

  const status = normalize(rfc.status);

  // sudah selesai
  if (["done", "completed", "approved", "success"].includes(status)) return 4;

  // ditolak
  if (["rejected", "denied"].includes(status)) {
    // tandai sampai level terakhir (atau minimal 1)
    const last = rfc?.approvals?.slice?.(-1)?.[0];
    const idx = STEP_KEYS.indexOf(normalize(last?.level));
    return idx >= 0 ? idx : 1;
  }

  // pending / in progress:
  const approvals = Array.isArray(rfc.approvals) ? rfc.approvals : [];

  // kalau ada keputusan "approved", cari yang paling maju
  const approvedLevels = approvals
    .filter((a) => ["approved", "accept"].includes(normalize(a?.decision)))
    .map((a) => normalize(a.level))
    .filter(Boolean);

  if (approvedLevels.length) {
    const maxIdx = Math.max(...approvedLevels.map((lv) => STEP_KEYS.indexOf(lv)).filter((x) => x >= 0));
    // +1 karena step selanjutnya yang sedang aktif
    return Math.min(maxIdx + 1, 4);
  }

  // kalau ada approval terakhir decision null -> sedang aktif di level itu
  const last = approvals.slice(-1)[0];
  const lastIdx = STEP_KEYS.indexOf(normalize(last?.level));
  if (lastIdx >= 0) return lastIdx;

  // default baru diajukan
  return 0;
}

const StatusPengajuanAdmin = () => {
  const { id } = useParams();

  // RFC object, bukan array
  const [rfc, setRfc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await rfcAPI.getById(id);

        // res.data -> { status: true, data: { ...rfc... } }
        const rfcData = res?.data?.rfc;

        if (!rfcData) {
          throw new Error("Data RFC tidak ditemukan (res.data.data kosong).");
        }

        if (mounted) setRfc(rfcData);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Gagal mengambil data RFC.";
        if (mounted) {
          setErrorMsg(msg);
          setRfc(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const activeStep = useMemo(() => getActiveStep(rfc), [rfc]);

  const steps = useMemo(
    () => [
      {
        key: "submitted",
        title: "Permintaan Diajukan",
        subtitle: "Pengguna mengajukan permintaan",
        icon: Send,
      },
      {
        key: "kepala_seksi",
        title: "Validasi Kepala Seksi",
        subtitle: "Permintaan sedang diproses",
        icon: Check,
      },
      {
        key: "kepala_bidang",
        title: "Validasi Kepala Bidang",
        subtitle: "Permintaan sedang diproses",
        icon: Check,
      },
      {
        key: "diskominfo",
        title: "Validasi Diskominfo",
        subtitle: "Permintaan sedang diproses",
        icon: Check,
      },
      {
        key: "done",
        title: "Selesai",
        subtitle: "Berhasil diimplementasikan",
        icon: Check,
      },
    ],
    []
  );

  const statusLabel = useMemo(() => {
    const st = normalize(rfc?.status);
    if (!st) return "-";
    if (st === "pending") return "Diproses";
    if (["done", "completed", "approved", "success"].includes(st)) return "Selesai";
    if (["rejected", "denied"].includes(st)) return "Ditolak";
    return st;
  }, [rfc]);

  const StatusIcon = useMemo(() => {
    const st = normalize(rfc?.status);
    if (["done", "completed", "approved", "success"].includes(st)) return Check;
    if (["rejected", "denied"].includes(st)) return XCircle;
    return Clock;
  }, [rfc]);

  const statusColor = useMemo(() => {
    const st = normalize(rfc?.status);
    if (["done", "completed", "approved", "success"].includes(st)) return "bg-green-500";
    if (["rejected", "denied"].includes(st)) return "bg-red-500";
    return "bg-yellow-500";
  }, [rfc]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-geologica text-[#001B33]">
      <Sidebaradmin />

      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all">
        <Headeradmin />

        <div className="max-w-5xl mx-auto px-6 py-10 w-full">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-10">
            {/* Loading / Error */}
            {loading && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 text-sm text-gray-700">
                Memuat data pengajuan...
              </div>
            )}

            {!loading && errorMsg && (
              <div className="bg-white border border-red-200 rounded-xl p-6 mb-6 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-14">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-900">ID Pengajuan</p>
                <div className="w-32 text-center py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium">
                  {rfc?.id ?? "-"}
                </div>
              </div>

              <div className="lg:col-span-2 border border-gray-200 rounded-xl bg-white p-10 flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${statusColor} rounded-full flex items-center justify-center mb-4`}>
                  <StatusIcon className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{rfc?.title ?? "-"}</h2>
                <p className="text-gray-600 text-sm mt-1">{statusLabel}</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="border border-gray-200 rounded-xl bg-white px-10 py-12">
              <div className="flex items-start justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  const isActive = index <= activeStep;
                  const isDone = index < activeStep;

                  const circleBorder = isActive ? "border-green-500" : "border-gray-300";
                  const iconColor = isActive ? "text-green-600" : "text-gray-400";
                  const lineColor = isDone ? "bg-green-500" : "bg-gray-300";
                  const titleColor = isActive ? "text-green-600" : "text-gray-900";

                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center text-center" style={{ maxWidth: 140 }}>
                        <div className={`w-16 h-16 rounded-full border-2 ${circleBorder} bg-white flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2.5} />
                        </div>
                        <p className={`mt-3 font-semibold text-sm ${titleColor}`}>{step.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                      </div>

                      {index < steps.length - 1 && <div className={`flex-1 h-0.5 ${lineColor} mt-8 mx-2`} />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Detail */}
              <div className="mt-10">
                <p className="font-semibold text-gray-900 mb-3 text-sm">Detail</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500">CI Code</p>
                    <p className="font-medium">{rfc?.ci_code ?? "-"}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500">Prioritas</p>
                    <p className="font-medium">{rfc?.priority ?? "-"}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2">
                    <p className="text-xs text-gray-500">Deskripsi</p>
                    <p className="font-medium">{rfc?.description ?? "-"}</p>
                  </div>
                </div>
              </div>

              {/* Lampiran */}
              {Array.isArray(rfc?.attachment_path) && rfc.attachment_path.length > 0 && (
                <div className="mt-8">
                  <p className="font-semibold text-gray-900 mb-2 text-sm">Lampiran</p>

                  <div className="space-y-2">
                    {rfc.attachment_path.map((att, i) => (
                      <a
                        key={`${att?.filename}-${i}`}
                        href={att?.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm hover:bg-gray-50"
                      >
                        {att?.filename ?? `Lampiran ${i + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* end box */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPengajuanAdmin;
