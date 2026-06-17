"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { punchAction } from "@/lib/actions/attendance";
import { Button } from "./ui";
import { Icon } from "./icons";

type Props = {
  clockedIn: boolean;
  clockedOut: boolean;
};

export function PunchCard({ clockedIn, clockedOut }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [camActive, setCamActive] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const kind: "IN" | "OUT" = clockedIn ? "OUT" : "IN";
  const done = clockedOut;

  // Dapatkan lokasi GPS automatik
  useEffect(() => {
    if (done) return;
    requestLocation();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocError("Peranti tidak menyokong GPS.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocError(
          err.code === 1
            ? "Akses lokasi ditolak. Sila benarkan dalam tetapan pelayar."
            : "Gagal mendapatkan lokasi."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function startCamera() {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamActive(true);
    } catch {
      setCamError("Kamera tidak tersedia. Gunakan muat naik gambar.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamActive(false);
  }

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.7));
    stopCamera();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Kecilkan saiz imej
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 640 / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function submit() {
    if (!coords) {
      setResult({ ok: false, message: "Lokasi GPS belum diperoleh." });
      return;
    }
    if (!photo) {
      setResult({ ok: false, message: "Sila ambil gambar bukti." });
      return;
    }
    setBusy(true);
    setResult(null);
    const res = await punchAction({
      kind,
      lat: coords.lat,
      lng: coords.lng,
      address: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
      photo,
    });
    setResult(res);
    setBusy(false);
    if (res.ok) {
      setTimeout(() => router.refresh(), 1200);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
          <Icon.check className="w-8 h-8" />
        </div>
        <div className="font-semibold text-slate-800">Kehadiran Lengkap Hari Ini</div>
        <div className="text-sm text-slate-500">
          Anda sudah daftar masuk dan keluar. Jumpa esok!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-xl px-4 py-3 text-sm font-medium ${
          kind === "IN"
            ? "bg-indigo-50 text-indigo-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {kind === "IN" ? "Daftar Masuk (Clock In)" : "Daftar Keluar (Clock Out)"}
      </div>

      {/* Lokasi */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
        <Icon.pin className="w-5 h-5 text-indigo-600 mt-0.5" />
        <div className="flex-1 text-sm">
          <div className="font-medium text-slate-700">Lokasi GPS</div>
          {locating && <div className="text-slate-400">Mengesan lokasi...</div>}
          {coords && (
            <div className="text-emerald-600">
              Dikesan: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </div>
          )}
          {locError && (
            <div className="text-rose-600">
              {locError}{" "}
              <button onClick={requestLocation} className="underline">
                Cuba lagi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kamera / Gambar */}
      <div className="p-3 rounded-xl bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <Icon.camera className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-slate-700">Gambar Bukti</span>
        </div>

        {photo ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="bukti" className="w-full max-w-xs rounded-xl mx-auto" />
            <button
              onClick={() => setPhoto(null)}
              className="text-sm text-indigo-600 underline"
            >
              Ambil semula
            </button>
          </div>
        ) : camActive ? (
          <div className="space-y-2">
            <video ref={videoRef} className="w-full max-w-xs rounded-xl mx-auto bg-black" playsInline muted />
            <div className="flex gap-2">
              <Button onClick={capture}>Ambil Gambar</Button>
              <Button variant="secondary" onClick={stopCamera}>Batal</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="secondary" onClick={startCamera}>
                <Icon.camera className="w-4 h-4" /> Buka Kamera
              </Button>
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">
                Muat Naik Gambar
                <input type="file" accept="image/*" capture="user" onChange={onFile} className="hidden" />
              </label>
            </div>
            {camError && <div className="text-xs text-amber-600">{camError}</div>}
          </div>
        )}
      </div>

      {result && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            result.ok
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {result.message}
        </div>
      )}

      <Button
        onClick={submit}
        disabled={busy || !coords || !photo}
        className="w-full"
        variant={kind === "IN" ? "primary" : "danger"}
      >
        {busy
          ? "Menghantar..."
          : kind === "IN"
          ? "Sahkan Daftar Masuk"
          : "Sahkan Daftar Keluar"}
      </Button>
    </div>
  );
}
