"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Truck,
  Loader2,
  AlertCircle,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Package,
  ScanLine,
  X,
  RefreshCw,
  Zap,
  ClipboardList,
  FileDown,
  Download,
  Calendar,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Printer,
  FileUp
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/services/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TrackingTimeline } from "@/components/TrackingTimeline";

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    DELIVERED: "text-emerald-600 bg-emerald-50 border-emerald-100",
    DIPROSES: "text-blue-600 bg-blue-50 border-blue-100",
    DIKIRIM: "text-violet-600 bg-violet-50 border-violet-100",
    RETURNED: "text-orange-600 bg-orange-50 border-orange-100",
    PENDING: "text-slate-500 bg-slate-50 border-slate-200",
  };
  const label: Record<string, string> = {
    DELIVERED: "Terkirim",
    DIPROSES: "Diproses",
    DIKIRIM: "Dikirim",
    RETURNED: "Diretur",
    PENDING: "Pending",
  };
  const key = status?.toUpperCase() || "PENDING";
  return (
    <span
      className={`inline-flex items-center justify-center text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border shadow-sm ${map[key] || map.PENDING}`}
    >
      {label[key] || status || "Pending"}
    </span>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Shipment {
  id?: string | number;
  item_code?: string;
  resi_number?: string;
  courier?: string;
  last_status?: string;
  is_delivered?: boolean | number;
  created_at?: string;
  last_updated?: string;   // tanggal update terakhir dari worker
  history?: TrackingEvent[];
}

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

interface RegisterForm {
  resi: string;
  courier: string;
}

const COURIERS = [
  { value: "jne", label: "JNE Express" },
  { value: "jnt", label: "J&T Express" },
  { value: "sicepat", label: "SiCepat" },
  { value: "spx", label: "Shopee Express (SPX)" },
  { value: "anteraja", label: "Anteraja" },
  { value: "ninja", label: "Ninja Xpress" },
  { value: "pos", label: "POS Indonesia" },
  { value: "tiki", label: "TIKI" },
  { value: "wahana", label: "Wahana" },
];

const DEFAULT_FORM: RegisterForm = { resi: "", courier: "jne" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectCourier(resi: string): string | undefined {
  if (!resi) return undefined;
  const upper = resi.toUpperCase().trim();
  if (upper.startsWith("SPX")) return "spx";
  if (upper.startsWith("JX") || upper.startsWith("JP") || upper.startsWith("JD") || upper.startsWith("J&T")) return "jnt";
  if (upper.startsWith("JNE") || (upper.length === 15 && /^\d+$/.test(upper))) return "jne";
  if (upper.startsWith("00") && upper.length >= 11 && upper.length <= 12) return "sicepat";
  if (upper.startsWith("1000") || upper.startsWith("ANTRJ")) return "anteraja";
  if (upper.startsWith("NLID") || upper.startsWith("NINJA")) return "ninja";
  if (upper.endsWith("ID") || (upper.length === 11 && /^\d+$/.test(upper))) return "pos";
  return undefined;
}

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
  if (
    latestText.includes("delivered") ||
    latestText.includes("diterima") ||
    latestText.includes("sampai") ||
    latestText.includes("selesai") ||
    latestText.includes("success")
  )
    return "DELIVERED";
  if (
    latestText.includes("will be delivered") ||
    latestText.includes("out for delivery") ||
    latestText.includes("diantarkan kurir") ||
    latestText.includes("sedang diantar") ||
    latestText.includes("sedang dikirim") ||
    latestText.includes("on delivery") ||
    latestText.includes("with courier")
  )
    return "DIKIRIM";
  if (
    latestText.includes("arrived") ||
    latestText.includes("departed") ||
    latestText.includes("process") ||
    latestText.includes("transit") ||
    latestText.includes("dikirim ke") ||
    latestText.includes("tiba di") ||
    latestText.includes("diproses") ||
    latestText.includes("manifest") ||
    latestText.includes("received at")
  )
    return "DIPROSES";

  if (history && history.length > 0 && (!raw || raw.toLowerCase() === "pending")) {
    return "DIPROSES";
  }

  if (!raw) return "PENDING";
  const lower = raw.toLowerCase();
  if (
    lower.includes("delivered") ||
    lower.includes("diterima") ||
    lower.includes("success")
  )
    return "DELIVERED";
  if (lower.includes("return") || lower.includes("retur")) return "RETURNED";
  if (
    lower.includes("on delivery") ||
    lower.includes("diantar") ||
    lower.includes("dikirim")
  )
    return "DIKIRIM";
  if (
    lower.includes("on process") ||
    lower.includes("transit") ||
    lower.includes("process") ||
    lower.includes("diproses")
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

// ─── Export Helpers ───────────────────────────────────────────────────────────

function groupShipmentsByDate(items: Shipment[]) {
  const groups = items.reduce((acc, s) => {
    const d = s.created_at ? new Date(s.created_at) : new Date();
    // Gunakan format YYYY-MM-DD sebagai key murni
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(s);
    return acc;
  }, {} as Record<string, Shipment[]>);

  return Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => {
      const dateStr = new Date(key).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      return [dateStr, items] as [string, Shipment[]];
    });
}

function handleExport(data: Shipment[], format: 'xlsx' | 'csv', fileName: string) {
  const exportData = data.map(s => ({
    "Tanggal Input": s.created_at ? new Date(s.created_at).toLocaleString("id-ID") : "-",
    "Nomor Resi": s.resi_number,
    "Kurir": s.courier?.toUpperCase(),
    "Status Terakhir": s.last_status || "PENDING",
    "Update Terakhir": s.last_updated ? new Date(s.last_updated).toLocaleString("id-ID") : "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Picking List");
  
  // Adjust column widths
  const wscols = [
    { wch: 25 }, // Tanggal Input
    { wch: 20 }, // Nomor Resi
    { wch: 15 }, // Kurir
    { wch: 20 }, // Status Terakhir
    { wch: 25 }, // Update Terakhir
  ];
  worksheet['!cols'] = wscols;

  if (format === 'xlsx') {
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } else {
    XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// TrackingTimeline moved to src/components/TrackingTimeline.tsx

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PengirimanPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailItem, setDetailItem] = useState<Shipment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterForm>(DEFAULT_FORM);
  const [isScanning, setIsScanning] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isBulkMode, setIsBulkMode] = useState(true);
  const [isPickingListOpen, setIsPickingListOpen] = useState(false);
  const [importedData, setImportedData] = useState<Shipment[]>([]);
  const [pickingDateFilter, setPickingDateFilter] = useState<string>("all");
  const resiInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── React Query: daftar pengiriman ────────────────────────────────────────
  const {
    data: shipments = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<Shipment[]>({
    queryKey: ["shipments"],
    queryFn: () => apiService.getShipmentList(),
    refetchInterval: 1000 * 60 * 10, // auto-refresh setiap 10 menit
    refetchIntervalInBackground: false, // hanya refresh jika tab aktif
  });

  // ── Auto-save retur untuk paket RETURNED yang sudah ada di cache ──────────
  useEffect(() => {
    if (!shipments.length) return;
    shipments.forEach(async (item) => {
      const resi = item.resi_number;
      if (!resi) return;
      const cached = queryClient.getQueryData<TrackingResponse>([
        "tracking",
        resi,
      ]);
      if (!cached) return;
      const liveStatus = parseLiveStatus(cached.status, cached.history);
      if (liveStatus === "RETURNED") {
        const latestDesc =
          cached.history?.[0]?.description ||
          cached.history?.[0]?.status ||
          "Paket dikembalikan";
        try {
          await apiService.saveReturn({
            sku_code: resi,
            product_name: resi,
            reason: `Paket Diretur: ${translateDescription(latestDesc)}`,
            status: "PENDING",
          });
          queryClient.invalidateQueries({ queryKey: ["returns"] });
        } catch (_) {
          /* duplikat diabaikan */
        }
      }
    });
  }, [shipments]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scanner Effect ────────────────────────────────────────────────────────
  useEffect(() => {
    let html5QrCode: any = null;
    let timer: NodeJS.Timeout;

    if (
      !isScanning ||
      typeof window === "undefined" ||
      !(window as any).Html5Qrcode
    )
      return;

    const initScanner = () => {
      const readerElement = document.getElementById("reader");
      if (readerElement) {
        try {
          html5QrCode = new (window as any).Html5Qrcode("reader");
          html5QrCode.start(
            { facingMode: "environment" },
            { 
              fps: 10, 
              qrbox: { width: 250, height: 100 },
              formatsToSupport: [
                (window as any).Html5QrcodeSupportedFormats.CODE_128,
                (window as any).Html5QrcodeSupportedFormats.QR_CODE,
                (window as any).Html5QrcodeSupportedFormats.EAN_13
              ],
              useBarCodeDetectorIfSupported: true
            },
            (decodedText: string) => {
              const detectedCourier = detectCourier(decodedText);
              setRegisterData((prev) => ({
                ...prev,
                resi: decodedText,
                ...(detectedCourier ? { courier: detectedCourier } : {}),
              }));
              
              if (html5QrCode) {
                html5QrCode.stop().then(() => {
                  html5QrCode.clear();
                  setIsScanning(false);
                }).catch((err: any) => {
                  console.error("Stop error:", err);
                  setIsScanning(false);
                });
              } else {
                setIsScanning(false);
              }
            },
            (error: any) => {
              // ignore scan errors
            }
          ).catch((err: any) => {
             console.error("Camera start error:", err);
             let msg = "Gagal mengakses kamera perangkat Anda.";
             if (err?.name === "NotReadableError" || err?.message?.includes("NotReadableError")) {
               msg = "Kamera sedang digunakan oleh aplikasi lain (Zoom, OBS, dll) atau terblokir secara hardware. Harap tutup aplikasi lain.";
             } else if (err?.name === "NotAllowedError" || err?.message?.includes("NotAllowedError")) {
               msg = "Akses kamera ditolak oleh browser. Silakan izinkan kamera melalui ikon gembok di URL bar.";
             }
             setCameraError(msg);
          });
        } catch (err) {
          console.error("Scanner init error:", err);
        }
      } else {
        // Retry later
        timer = setTimeout(initScanner, 100);
      }
    };

    initScanner();

    return () => {
      clearTimeout(timer);
      if (html5QrCode) {
        try {
          html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
        } catch (e) {}
      }
    };
  }, [isScanning]);

  useEffect(() => {
    if (!isRegisterOpen && isScanning) {
      setIsScanning(false);
    }
  }, [isRegisterOpen, isScanning]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function openDetail(item: Shipment) {
    setDetailItem(item);
    setIsDetailOpen(true);

    const resi = item.resi_number;
    if (!resi) return;

    // Selalu hapus cache lama → tampil loading state → fetch data segar
    queryClient.removeQueries({ queryKey: ["tracking", resi] });

    try {
      const trackingData = await apiService.trackDirect(resi, undefined);
      queryClient.setQueryData(["tracking", resi], trackingData);

      // Deteksi retur otomatis dari data segar
      const liveStatus = parseLiveStatus(trackingData.status, trackingData.history);
      if (liveStatus === "RETURNED") {
        const latestDesc =
          trackingData.history?.[0]?.description ||
          trackingData.history?.[0]?.status ||
          "Paket dikembalikan";
        try {
          await apiService.saveReturn({
            sku_code: resi,
            product_name: resi,
            reason: `Paket Diretur: ${translateDescription(latestDesc)}`,
            status: "PENDING",
          });
          queryClient.invalidateQueries({ queryKey: ["returns"] });
        } catch (_) {
          /* abaikan duplikat */
        }
      }

      // Refresh tabel agar status ikut terupdate tanpa perlu refresh manual
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    } catch (err) {
      console.warn("[Detail] track gagal:", err);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterLoading(true);

    // Simpan data sementara untuk dipakai di modal detail
    const resiToTrack = registerData.resi;
    const courierUsed = registerData.courier;

    try {
      // 1. Simpan ke database (Sangat cepat sekarang karena background task)
      await apiService.registerResi(registerData);

      // 2. Berikan feedback visual/haptic sederhana (opsional, bisa ditambah sound nanti)
      
      if (isBulkMode) {
        // MODE SATSET: Jangan tutup modal, langsung siap scan berikutnya
        setRegisterData(DEFAULT_FORM);
        setRegisterLoading(false);
        // Focus balik ke input setelah state update
        setTimeout(() => resiInputRef.current?.focus(), 50);
        
        // Tracking & Invalidate tetap jalan di background (non-blocking)
        queryClient.invalidateQueries({ queryKey: ["shipments"] });
        
        // Jalankan tracking live tanpa di-await (agar UI tidak macet)
        apiService.trackDirect(resiToTrack).then(trackingData => {
            queryClient.setQueryData(["tracking", resiToTrack], trackingData);
            queryClient.invalidateQueries({ queryKey: ["shipments"] });
        }).catch(e => console.warn("Background track failed:", e));
        
        return; // SELESAI UNTUK MODE BULK
      }

      // MODE STANDAR: Tutup modal & buka detail
      setIsRegisterOpen(false);
      setRegisterData(DEFAULT_FORM);

      // 3. LANGSUNG BUKA MODAL DETAIL (Sekaligus pasang data placeholder)
      const placeholderItem: Shipment = {
        item_code: resiToTrack,
        resi_number: resiToTrack,
        courier: courierUsed,
        last_status: "PENDING",
        is_delivered: false,
      };
      setDetailItem(placeholderItem);
      setIsDetailOpen(true);

      // 4. Refresh list di background agar tabel terupdate
      queryClient.invalidateQueries({ queryKey: ["shipments"] });

      // 5. Jalankan tracking live (di background modal yang sudah terbuka)
      try {
        const trackingData = await apiService.trackDirect(
          resiToTrack,
          undefined,
        );

        // Update cache — ini akan otomatis mengupdate modal detail yang sedang terbuka
        queryClient.setQueryData(["tracking", resiToTrack], trackingData);

        // Refresh list lagi untuk update badge di tabel
        queryClient.invalidateQueries({ queryKey: ["shipments"] });

        // 6. Simpan ke Retur jika terdeteksi
        const liveStatus = parseLiveStatus(
          trackingData.status,
          trackingData.history,
        );
        if (liveStatus === "RETURNED") {
          const latestDesc =
            trackingData.history?.[0]?.description || "Paket Diretur";
          try {
            await apiService.saveReturn({
              sku_code: resiToTrack,
              product_name: resiToTrack,
              reason: `Paket Diretur: ${translateDescription(latestDesc)}`,
              status: "PENDING",
            });
            queryClient.invalidateQueries({ queryKey: ["returns"] });
          } catch (_) {}
        }
      } catch (trackErr) {
        console.warn("[Register] Gagal update data live:", trackErr);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mendaftarkan resi");
    } finally {
      setRegisterLoading(false);
    }
  }

  function openDeleteConfirm(e: React.MouseEvent, item_code: string) {
    e.stopPropagation();
    setItemToDelete(item_code);
    setIsDeleteOpen(true);
  }

  async function handleDelete() {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      await apiService.deleteShipment(itemToDelete);
      setIsDeleteOpen(false);
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus data");
    } finally {
      setDeleteLoading(false);
      setItemToDelete(null);
    }
  }

  const filtered = shipments.filter(
    (s) =>
      (s.resi_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.courier || "").toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const detailResi = detailItem?.resi_number;

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const mapped: Shipment[] = data.map((row, idx) => {
          // Cari kolom resi secara cerdas
          const resiKey = Object.keys(row).find(k => 
            k.toLowerCase().includes("resi") || 
            k.toLowerCase().includes("order") || 
            k.toLowerCase().includes("tracking")
          );
          
          const courierKey = Object.keys(row).find(k => 
            k.toLowerCase().includes("kurir") || 
            k.toLowerCase().includes("ekspedisi") ||
            k.toLowerCase().includes("courier")
          );

          const itemKey = Object.keys(row).find(k => 
            k.toLowerCase().includes("item") || 
            k.toLowerCase().includes("sku") ||
            k.toLowerCase().includes("produk")
          );

          const dateKey = Object.keys(row).find(k => 
            k.toLowerCase().includes("tanggal") || 
            k.toLowerCase().includes("date") ||
            k.toLowerCase().includes("waktu")
          );

          let rowDate = new Date().toISOString();
          if (dateKey && row[dateKey]) {
            const rawVal = row[dateKey];
            let parsed: Date;
            
            if (rawVal instanceof Date) {
              parsed = rawVal;
            } else {
              parsed = new Date(rawVal);
            }

            if (!isNaN(parsed.getTime())) {
              // Normalisasi ke jam 00:00:00 hari tersebut agar grouping pas
              rowDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).toISOString();
            }
          }

          return {
            id: `import-${idx}-${Date.now()}`,
            resi_number: String(row[resiKey || ""] || row["Resi"] || "NO-RESI"),
            courier: String(row[courierKey || ""] || "J&T"),
            item_code: String(row[itemKey || ""] || "-"),
            created_at: rowDate,
            last_status: "PENDING",
          };
        });

        setImportedData(mapped);
        setPickingDateFilter("all"); // Reset filter saat baru import
        setIsPickingListOpen(true);
      } catch (err) {
        alert("Gagal membaca file Excel. Pastikan formatnya benar.");
      }
    };
    reader.readAsBinaryString(file);
    // Reset input agar bisa upload file yang sama lagi
    e.target.value = "";
  };

  // Status live dari cache React Query
  const cachedTracking = detailResi
    ? queryClient.getQueryData<TrackingResponse>(["tracking", detailResi])
    : undefined;
  const liveStatus = cachedTracking
    ? parseLiveStatus(cachedTracking.status, cachedTracking.history)
    : parseLiveStatus(detailItem?.last_status);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Script
        src="https://unpkg.com/html5-qrcode"
        strategy="afterInteractive"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Logistik & Pengiriman
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola dan pantau pengiriman produk QueenyLook.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto [&>button]:flex-1 md:[&>button]:flex-none">
          <Button
            onClick={() => {
              setIsRegisterOpen(true);
              setIsScanning(false);
            }}
            className="bg-white text-primary border border-primary/20 hover:bg-primary/5 rounded-xl shadow-sm font-bold"
          >
            <Plus className="mr-2 h-4 w-4" /> Input Manual
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 rounded-xl shadow-sm font-bold"
          >
            <FileUp className="mr-2 h-4 w-4 text-emerald-600" /> Import Excel
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleImportExcel}
          />
          <Button
            onClick={() => {
              setImportedData([]); // Reset import saat buka dari dashboard
              setIsPickingListOpen(true);
            }}
            className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm font-bold"
          >
            <ClipboardList className="mr-2 h-4 w-4 text-primary" /> Picking List
          </Button>
          <Button
            onClick={() => {
              setIsRegisterOpen(true);
              setIsScanning(true);
              setCameraError(null);
            }}
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 font-bold"
          >
            <ScanLine className="mr-2 h-4 w-4" /> Scan Kamera
          </Button>
        </div>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogContent className="rounded-3xl border-none shadow-2xl max-h-[90vh] overflow-y-auto w-[95vw] md:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Daftarkan Resi Baru
              </DialogTitle>
            </DialogHeader>
            <div className="py-2">
              {isScanning && (
                <div className="rounded-2xl border-2 border-primary/10 overflow-hidden bg-slate-50 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center text-center p-4 mb-6">
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-3">
                    Arahkan Kamera ke Barcode Resi
                  </p>
                  
                  {cameraError ? (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-3 w-full animate-in fade-in">
                       <AlertTriangle className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                       <p className="text-xs font-bold text-rose-600 leading-relaxed">{cameraError}</p>
                    </div>
                  ) : (
                    <div
                      id="reader"
                      className="w-full [&>div]:border-none [&_video]:rounded-xl [&_img]:mx-auto [&_button]:mx-auto [&_span]:text-center min-h-[150px]"
                    ></div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsScanning(false)}
                    className="mt-4 text-xs font-bold text-muted-foreground hover:text-rose-500"
                  >
                    Tutup Kamera
                  </Button>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isBulkMode ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <Zap className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-tight leading-none mb-0.5">Mode Satset</p>
                      <p className="text-[9px] text-muted-foreground font-medium">Scan beruntun tanpa henti</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setIsBulkMode(!isBulkMode)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${isBulkMode ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <span
                      className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${isBulkMode ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Nomor Resi
                  </Label>
                  <Input
                    required
                    autoFocus
                    ref={resiInputRef}
                    placeholder={isBulkMode ? "Siap scan paket..." : "Contoh: JNE123456789"}
                    className={`rounded-xl border-primary/10 h-12 text-lg font-bold transition-all ${isBulkMode ? 'border-primary shadow-sm bg-primary/[0.02]' : ''}`}
                    value={registerData.resi}
                    onChange={(e) => {
                      const val = e.target.value;
                      const detected = detectCourier(val);
                      setRegisterData({
                        ...registerData,
                        resi: val,
                        ...(detected ? { courier: detected } : {}),
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Kurir
                  </Label>
                  <Select
                    value={registerData.courier}
                    onValueChange={(val) =>
                      setRegisterData({ ...registerData, courier: val })
                    }
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl border-primary/10 bg-white px-4 font-semibold shadow-sm">
                      <SelectValue placeholder="Pilih Kurir" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-primary/5 shadow-xl bg-white">
                      {COURIERS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="mt-2">
                  <Button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full bg-primary text-primary-foreground font-bold rounded-xl h-12 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                  >
                    {registerLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Daftarkan Pengiriman"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        {/* Picking List Modal - PDF STYLE */}
        <Dialog open={isPickingListOpen} onOpenChange={setIsPickingListOpen}>
          <DialogContent className="rounded-none border-none shadow-none max-h-screen overflow-y-auto w-screen max-w-none p-0 bg-slate-100/80 backdrop-blur-sm print:bg-white print:p-0 print:m-0 print:max-h-none">
            {/* Toolbar - Sticky and non-printing */}
            <div className="sticky top-0 z-[60] bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setIsPickingListOpen(false)}
                  variant="ghost" 
                  size="sm"
                  className="rounded-lg hover:bg-slate-100 text-slate-500 font-bold"
                >
                  <X className="h-4 w-4 mr-2" /> Tutup
                </Button>
                <div className="h-6 w-[1px] bg-slate-200" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">Document Preview</h2>
                  </div>
                  
                  {/* Date Filter */}
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 ml-2 uppercase">Filter:</span>
                    <Select value={pickingDateFilter} onValueChange={setPickingDateFilter}>
                      <SelectTrigger className="h-8 border-none bg-transparent shadow-none text-[11px] font-bold min-w-[140px] focus:ring-0">
                        <SelectValue placeholder="Pilih Tanggal" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                        <SelectItem value="all" className="text-[11px] font-bold">Semua Tanggal</SelectItem>
                        {groupShipmentsByDate(importedData.length > 0 ? importedData : shipments).map(([date]) => (
                          <SelectItem key={date} value={date} className="text-[11px] font-bold">{date}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="bg-white border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5 mr-2 text-primary" /> Cetak ke PDF
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleExport(shipments, 'xlsx', 'Picking_List_All')}
                  className="bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 mr-2" /> Export Excel
                </Button>
              </div>
            </div>

            {/* Document Container */}
            <div id="picking-list-container" className="p-4 md:p-10 flex flex-col items-center gap-10 print:p-0 print:gap-0 bg-slate-100/50 min-h-screen print:bg-white print:block print:w-full">
              {importedData.length === 0 && shipments.length === 0 ? (
                <div className="bg-white w-full max-w-[210mm] p-20 rounded-3xl shadow-xl border border-slate-100 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Package className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Data</h3>
                  <p className="text-slate-400 text-sm max-w-[240px]">Silakan daftarkan pengiriman atau import file Excel untuk melihat picking list.</p>
                </div>
              ) : (
                groupShipmentsByDate(importedData.length > 0 ? importedData : shipments)
                  .filter(([date]) => pickingDateFilter === "all" || date === pickingDateFilter)
                  .map(([date, items]) => (
                  <div 
                    key={date} 
                    className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-[15mm] md:p-[20mm] relative flex flex-col print:shadow-none print:m-0 print:p-[10mm] print:break-after-page animate-in fade-in slide-in-from-bottom-8 duration-500"
                  >
                    {/* Header Section */}
                    <div className="mb-12">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-1">Picking List</h1>
                          <p className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Warehouse Management</p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[11px] font-black text-slate-800">{date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-[10px] text-slate-500 font-medium">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                          <span>Admin PIC:</span>
                          <span className="font-bold text-slate-900">QueenyLook Official</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                          <span>Order quantity:</span>
                          <span className="font-bold text-slate-900">{items.length}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                          <span>Print time:</span>
                          <span className="font-bold text-slate-900">{new Date().toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                          <span>Product quantity:</span>
                          <span className="font-bold text-slate-900">{items.length}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                          <span>Location:</span>
                          <span className="font-bold text-slate-900">Main Warehouse</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                          <span>Total Items:</span>
                          <span className="font-bold text-slate-900 leading-none px-1.5 py-0.5 bg-primary/10 text-primary rounded">{items.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Table Section */}
                    <div className="flex-1">
                      <table className="w-full">
                        <thead>
                          <tr className="border-t-2 border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-50/50">
                            <th className="py-4 px-3 text-left w-10">No</th>
                            <th className="py-4 px-3 text-left w-24">Image</th>
                            <th className="py-4 px-3 text-left">Product Detail</th>
                            <th className="py-4 px-3 text-left w-32">SKU / Code</th>
                            <th className="py-4 px-3 text-center w-16">Qty</th>
                            <th className="py-4 px-3 text-right">Order / Resi</th>
                          </tr>
                        </thead>
                        <tbody className="text-[11px]">
                          {items.map((item, idx) => (
                            <tr key={item.id || item.resi_number} className="border-b border-slate-100 group hover:bg-slate-50/30 transition-colors">
                              <td className="py-5 px-3 align-top font-bold text-slate-300 group-hover:text-primary transition-colors">{idx + 1}</td>
                              <td className="py-5 px-3 align-top">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden group-hover:border-primary/20 transition-all">
                                  <Package className="h-7 w-7 text-slate-200 group-hover:text-primary/20 transition-all" />
                                </div>
                              </td>
                              <td className="py-5 px-3 align-top">
                                <p className="font-black text-slate-900 uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                                  {item.item_code || "KODE_PRODUK_RAJUT"}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Premium Collection QueenyLook</p>
                              </td>
                              <td className="py-5 px-3 align-top">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                  {item.item_code || "PRD-2024"}
                                </span>
                              </td>
                              <td className="py-5 px-3 align-top text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm shadow-lg shadow-slate-200">
                                  1
                                </span>
                              </td>
                              <td className="py-5 px-3 align-top text-right">
                                <p className="font-black text-slate-900 tracking-tight text-xs leading-none mb-1">
                                  {item.resi_number}
                                </p>
                                <span className="text-[9px] font-black uppercase text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                  {item.courier}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-16 pt-8 border-t-2 border-slate-900/5 flex justify-between items-end">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="text-white font-black text-lg italic">Q</span>
                          </div>
                          <div>
                            <p className="text-xs font-black tracking-tighter text-slate-900 leading-none">QUEENYLOOK</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quality Guaranteed</p>
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-300 font-medium">Picking list ini dihasilkan secara otomatis oleh sistem logistik QueenyLook pada {new Date().toLocaleString('id-ID')}.</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-10 py-4 border-2 border-slate-900 rounded-3xl">
                          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Checked By</p>
                          <div className="h-10" /> {/* Space for signature */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Styles for Printing */}
            <style jsx global>{`
              @media print {
                /* Sembunyikan elemen dashboard di belakang modal */
                body > *:not([data-radix-portal]) {
                  display: none !important;
                }
                
                /* Reset styling dialog agar memenuhi halaman print */
                [data-radix-portal] {
                  display: block !important;
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                }

                [role="dialog"] {
                  position: relative !important;
                  display: block !important;
                  width: 100% !important;
                  height: auto !important;
                  overflow: visible !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  background: white !important;
                  box-shadow: none !important;
                }
                
                /* Sembunyikan overlay modal (overlay hitam) */
                div[data-state="open"] > div[style*="background-color"] {
                  display: none !important;
                }

                #picking-list-container {
                  display: block !important;
                  visibility: visible !important;
                  width: 100% !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  background: white !important;
                }

                .print-hidden {
                  display: none !important;
                }

                .print\\:break-after-page {
                  break-after: page !important;
                  page-break-after: always !important;
                  margin-bottom: 0 !important;
                }

                @page {
                  size: A4;
                  margin: 10mm;
                }

                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
              }
            `}</style>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
        <div className="px-8 py-5 border-b border-primary/5 bg-primary/[0.02] flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-widest text-primary/60">
            Daftar Pengiriman
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
              <input
                className="pl-9 pr-4 py-2 bg-white border border-primary/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-32 sm:w-52"
                placeholder="Cari resi atau kurir..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="outline"
              size="icon"
              className="h-[34px] w-[34px] rounded-full border-primary/10 text-primary hover:bg-primary/5 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin opacity-50' : ''}`} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
              Memuat Data...
            </p>
          </div>
        ) : error ? (
          <div className="py-24 flex flex-col items-center justify-center text-destructive text-center px-8">
            <AlertCircle className="h-10 w-10 opacity-40 mb-4" />
            <p className="font-bold">Gagal memuat data pengiriman</p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-6 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5"
            >
              Coba Lagi
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Table */}
            <div className="overflow-x-auto">
              <div className="max-h-[420px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                    <TableRow className="hover:bg-transparent border-primary/5">
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-8 py-5">
                    Nomor Resi
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">
                    Kurir
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-8 py-5">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground font-medium italic"
                    >
                      {search
                        ? "Tidak ada hasil pencarian."
                        : "Belum ada data pengiriman."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((item) => {
                    const resi = item.resi_number;
                    const cached = resi
                      ? queryClient.getQueryData<TrackingResponse>([
                          "tracking",
                          resi,
                        ])
                      : undefined;
                    // Gunakan history dari DB juga agar status tetap benar setelah refresh
                    const displayStatus = cached
                      ? parseLiveStatus(cached.status, cached.history)
                      : parseLiveStatus(item.last_status, item.history);
                    const key = item.resi_number || item.id;
                    return (
                      <TableRow
                        key={String(key)}
                        className="border-primary/5 hover:bg-primary/[0.02] transition-all"
                      >
                        <TableCell className="py-5 px-8">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              RESI
                            </span>
                            <span className="font-mono text-sm font-bold text-foreground">
                              {resi || "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-5">
                          <div className="flex items-center gap-2">
                            <Truck className="h-3.5 w-3.5 text-primary/40" />
                            <span className="text-sm font-semibold uppercase text-slate-600">
                              {item.courier || "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-4 py-5">
                          <StatusBadge status={displayStatus} />
                        </TableCell>
                        {/* Tanggal daftar & update */}
                        <TableCell className="px-4 py-5">
                          <div className="flex flex-col gap-1">
                            {item.created_at && (
                              <div className="text-[10px] text-muted-foreground/60 font-medium">
                                <span className="font-bold text-primary/50">Daftar:</span>{" "}
                                {new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                              </div>
                            )}
                            {item.last_updated && (
                              <div className="text-[10px] text-muted-foreground/60 font-medium">
                                <span className="font-bold text-primary/50">Update:</span>{" "}
                                {new Date(item.last_updated).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                              </div>
                            )}
                            {!item.created_at && !item.last_updated && (
                              <span className="text-[10px] text-muted-foreground/40 italic">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetail(item)}
                              className="rounded-xl border-primary/10 text-primary hover:bg-primary/5 font-bold text-xs h-8 px-3"
                            >
                              <MapPin className="h-3 w-3 mr-1" /> Detail
                            </Button>
                            <button
                              onClick={(e) =>
                                openDeleteConfirm(
                                  e,
                                  String(item.resi_number || item.id),
                                )
                              }
                              className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
                </TableBody>
              </Table>
            </div>
            </div>
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/[0.01]">
              {/* Page size selector */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Tampilkan</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
                >
                  <SelectTrigger className="h-8 w-20 rounded-xl border-primary/10 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {[5, 10, 20].map((s) => (
                      <SelectItem key={s} value={String(s)} className="text-xs font-bold">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="font-medium">item — Total <strong>{filtered.length}</strong></span>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent className="flex items-center gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={`rounded-xl cursor-pointer font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      if (totalPages > 5 && p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                        if (p === 2 || p === totalPages - 1) {
                          return <PaginationItem key={p}><PaginationEllipsis className="text-primary/40" /></PaginationItem>;
                        }
                        return null;
                      }
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            onClick={() => setPage(p)}
                            isActive={p === page}
                            className={`rounded-xl cursor-pointer text-xs font-bold transition-all ${p === page ? "bg-primary text-white hover:bg-primary/90 hover:text-white shadow-md shadow-primary/20" : "hover:bg-primary/5 hover:text-primary text-muted-foreground"}`}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className={`rounded-xl cursor-pointer font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all ${page === totalPages ? "pointer-events-none opacity-40" : ""}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl max-w-lg p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 px-8 py-6 border-b border-primary/10">
            <p className="text-[10px] font-bold tracking-[0.2em] text-primary/50 uppercase mb-1">
              Detail Pelacakan
            </p>
            <p className="font-mono text-lg font-black text-foreground tracking-tighter">
              {detailItem?.resi_number || "—"}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-primary/50" />
                <span className="text-xs font-bold uppercase text-slate-600">
                  {detailItem?.courier || "—"}
                </span>
              </div>
              <StatusBadge status={liveStatus} />
            </div>
          </div>
          <div className="px-8 py-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase mb-5 flex items-center gap-2">
              Riwayat Perjalanan <div className="h-px flex-1 bg-muted/30" />
            </h4>
            {detailResi && <TrackingTimeline resi={detailResi} initialHistory={detailItem?.history} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[400px]">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Hapus Pengiriman?
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              <span className="font-bold text-slate-900">{itemToDelete}</span>{" "}
              akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl h-12 font-bold"
                onClick={() => setIsDeleteOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl h-12 font-bold shadow-lg shadow-rose-200"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Ya, Hapus"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[320px]">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Berhasil!</h2>
            <p className="text-sm text-slate-500">
              Data telah dihapus dari sistem.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
