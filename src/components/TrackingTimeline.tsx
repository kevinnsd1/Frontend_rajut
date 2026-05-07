"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Package, RefreshCw } from "lucide-react";
import { apiService } from "@/services/api";

// ─── Types (Duplicated from page for portability) ─────────────────────────────

interface TrackingEvent {
  status?: string;
  title?: string;
  description?: string;
  time?: string;
  date?: string;
}

interface TrackingResponse {
  history?: TrackingEvent[];
  status?: string;
  success?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLiveStatus(raw?: string, history?: TrackingEvent[]): string {
  const latestText = (
    history?.[0]?.description ||
    history?.[0]?.status ||
    history?.[0]?.title ||
    ""
  ).toLowerCase();

  if (
    latestText.includes("returned") ||
    latestText.includes("return") ||
    latestText.includes("retur")
  )
    return "RETURNED";
  if (latestText.includes("delivered") || latestText.includes("diterima"))
    return "DELIVERED";
  if (
    latestText.includes("will be delivered") ||
    latestText.includes("out for delivery")
  )
    return "DIKIRIM";
  if (
    latestText.includes("arrived") ||
    latestText.includes("departed") ||
    latestText.includes("process") ||
    latestText.includes("transit") ||
    latestText.includes("dikirim ke") ||
    latestText.includes("tiba di") ||
    latestText.includes("diproses")
  )
    return "DIPROSES";

  if (history && history.length > 0 && (!raw || raw.toLowerCase() === "pending")) {
    return "DIPROSES";
  }

  if (!raw) return "PENDING";
  const lower = raw.toLowerCase();
  if (lower.includes("delivered") || lower.includes("diterima"))
    return "DELIVERED";
  if (lower.includes("return") || lower.includes("retur")) return "RETURNED";
  if (lower.includes("on delivery")) return "DIKIRIM";
  if (
    lower.includes("on process") ||
    lower.includes("transit") ||
    lower.includes("process")
  )
    return "DIPROSES";
  return "PENDING";
}

function translateDescription(text?: string): string {
  if (!text) return "";
  const patterns: [RegExp, string][] = [
    [/Package has been arrived at (.+)/i, "Paket telah tiba di $1."],
    [/Package has been returned to (.+)/i, "Paket telah dikembalikan ke $1."],
    [/Package will be departed to (.+)/i, "Paket akan dikirim ke $1."],
    [
      /Package will be delivered to your address by (.+)/i,
      "Paket akan diantarkan ke alamat Anda oleh $1.",
    ],
    [
      /Package has been processed at (.+?) by (.+)/i,
      "Paket telah diproses di $1 oleh $2.",
    ],
    [
      /Shipment process is being delayed for the reason:\s*(.+)/i,
      "Pengiriman ditunda dengan alasan: $1.",
    ],
    [
      /Package is on return shipment by (.+)/i,
      "Paket sedang dalam proses pengembalian oleh $1.",
    ],
    [/Package has been picked up by (.+)/i, "Paket telah diambil oleh $1."],
    [
      /Package is out for delivery/i,
      "Paket sedang dalam perjalanan pengiriman ke alamat Anda.",
    ],
    [/Package has been delivered/i, "Paket telah berhasil diterima."],
    [
      /Package has been received at origin/i,
      "Paket telah diterima di lokasi asal.",
    ],
    [/Package has been created/i, "Data paket telah dibuat."],
  ];
  for (const [pattern, replacement] of patterns) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  return text;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TrackingTimeline({ 
  resi, 
  courier,
  initialHistory 
}: { 
  resi: string, 
  courier?: string,
  initialHistory?: TrackingEvent[] 
}) {
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading, isFetching, refetch } = useQuery<TrackingResponse>({
    queryKey: ["tracking", resi],
    queryFn: () => apiService.trackDirect(resi, undefined, courier),
    initialData: initialHistory && initialHistory.length > 0 ? { history: initialHistory, status: parseLiveStatus("", initialHistory), success: true } : undefined,
    staleTime: 1000 * 60,
    refetchOnMount: true,
  });

  const isEmpty = !data?.history || data.history.length === 0;

  useEffect(() => {
    if (!isLoading && !isFetching && isEmpty && retryCount < 3 && (!initialHistory || initialHistory.length === 0)) {
      const t = setTimeout(() => {
        setRetryCount((c) => c + 1);
        refetch();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isLoading, isFetching, isEmpty, retryCount, initialHistory, refetch]);

  const handleManualRefresh = () => {
    setRetryCount(0);
    refetch();
  };

  if (isFetching && isEmpty) {
    return (
      <div className="py-12 flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-primary/30" />
        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
          {retryCount > 0 ? `Mencoba ulang... (${retryCount}/3)` : "Melacak Paket..."}
        </p>
      </div>
    );
  }

  if (isEmpty && !isFetching) {
    return (
      <div className="py-10 text-center flex flex-col items-center gap-3">
        <Package className="h-8 w-8 text-slate-200 mx-auto" />
        <p className="text-xs text-muted-foreground italic">
          {retryCount >= 3
            ? "Data tracking tidak tersedia saat ini."
            : "Mencari data perjalanan..."}
        </p>
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Tracking
        </button>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-7 before:absolute before:inset-y-2 before:left-[7px] before:w-0.5 before:bg-primary/10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="absolute top-0 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full">
        <button
          onClick={handleManualRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] px-2.5 py-1 rounded-full font-bold transition-all disabled:opacity-50 border border-primary/10"
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} /> 
          {isFetching ? "Memuat..." : "Refresh"}
        </button>
      </div>
      {(data?.history ?? []).map((event, i) => (
        <div key={i} className="relative">
          <span
            className={`absolute -left-[24px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white border-2 ${i === 0 ? "bg-primary border-primary shadow-lg shadow-primary/20" : "bg-white border-primary/20"}`}
          />
          <p
            className={`text-xs ${i === 0 ? "font-black text-foreground" : "font-medium text-muted-foreground/80"} leading-relaxed`}
          >
            {translateDescription(
              event.status || event.title || event.description,
            )}
          </p>
          <p className="text-[10px] text-muted-foreground/50 font-semibold mt-1 tracking-tight">
            {event.time || event.date}
          </p>
        </div>
      ))}
    </div>
  );
}
