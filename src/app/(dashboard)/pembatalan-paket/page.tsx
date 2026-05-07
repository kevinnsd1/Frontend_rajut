"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Loader2,
  Ban,
  Plus,
  Search,
  Trash2,
  PackageX,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { apiService } from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CancelledItem {
  id?: number;
  item_code: string;
  resi_number?: string;
  courier?: string;
  reason?: string;
  cancelled_at?: string;
}

const COURIERS = [
  { value: "jne", label: "JNE Express" },
  { value: "jnt", label: "J&T Express" },
  { value: "sicepat", label: "SiCepat" },
  { value: "tiki", label: "TIKI" },
  { value: "pos", label: "POS Indonesia" },
  { value: "ninja", label: "Ninja Xpress" },
  { value: "other", label: "Lainnya" },
];

const REASONS = [
  "Pesanan dibatalkan oleh pembeli",
  "Stok habis / tidak tersedia",
  "Harga tidak sesuai",
  "Alamat tidak ditemukan",
  "Pembeli tidak ada di tempat",
  "Paket rusak sebelum pengiriman",
  "Duplikat pesanan",
  "Lainnya",
];

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CourierBadge({ courier }: { courier?: string }) {
  if (!courier) return <span className="text-muted-foreground/40 text-xs">—</span>;
  const label = COURIERS.find((c) => c.value === courier.toLowerCase())?.label || courier.toUpperCase();
  return (
    <span className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border bg-slate-50 border-slate-100 text-slate-500">
      {label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PembatalanPaketPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [form, setForm] = useState({
    item_code: "",
    resi_number: "",
    courier: "",
    reason: "",
    reason_custom: "",
  });
  const [useCustomReason, setUseCustomReason] = useState(false);

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    data: cancellations = [],
    isLoading,
    error,
    refetch,
  } = useQuery<CancelledItem[]>({
    queryKey: ["cancellations"],
    queryFn: () => apiService.getCancellations(),
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: false,
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (payload: Parameters<typeof apiService.saveCancellation>[0]) =>
      apiService.saveCancellation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancellations"] });
      setIsAddOpen(false);
      setForm({ item_code: "", resi_number: "", courier: "", reason: "", reason_custom: "" });
      setUseCustomReason(false);
      setSuccessMsg("Pembatalan berhasil dicatat!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (item_code: string) => apiService.deleteCancellation(item_code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancellations"] });
      setIsDeleteOpen(false);
      setItemToDelete(null);
      setSuccessMsg("Catatan pembatalan dihapus.");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  // ── Computed ──────────────────────────────────────────────────────────────
  const filtered = cancellations.filter(
    (c) =>
      (c.item_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.resi_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.reason || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalReason = useCustomReason ? form.reason_custom : form.reason;
    addMutation.mutate({
      item_code: form.item_code,
      resi_number: form.resi_number || undefined,
      courier: form.courier || undefined,
      reason: finalReason || undefined,
    });
  }

  function openDelete(e: React.MouseEvent, item_code: string) {
    e.stopPropagation();
    setItemToDelete(item_code);
    setIsDeleteOpen(true);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/30 animate-in slide-in-from-top-2 fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-bold">{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pembatalan Paket</h1>
          <p className="text-sm text-slate-500 mt-1">
            Catat dan pantau paket yang dibatalkan dari sistem pengiriman.
          </p>
        </div>
        <div className="flex items-center gap-5">
          {/* Stats */}
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-primary/40 uppercase">Total</p>
            <p className="text-2xl font-black text-slate-900">{cancellations.length}</p>
          </div>
          <div className="w-px h-8 bg-primary/10" />
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 font-bold"
          >
            <Plus className="mr-2 h-4 w-4" /> Catat Pembatalan
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
        <Ban className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-700">Apa itu Pembatalan Paket?</p>
          <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
            Pembatalan paket mencatat pesanan yang dibatalkan sebelum atau selama proses pengiriman.
            Resi yang dibatalkan akan otomatis dihapus dari daftar pengiriman aktif.
          </p>
        </div>
      </div>

      {/* Table */}
      <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="px-8 py-5 border-b border-primary/5 bg-primary/[0.02] flex items-center justify-between gap-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-primary/60 shrink-0">
            Daftar Pembatalan
          </h3>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
            <input
              className="pl-9 pr-4 py-2 bg-white border border-primary/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
              placeholder="Cari kode barang, resi, alasan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Memuat Data...</p>
          </div>
        ) : error ? (
          <div className="py-24 flex flex-col items-center justify-center text-destructive text-center px-8">
            <AlertCircle className="h-10 w-10 opacity-40 mb-4" />
            <p className="font-bold">Gagal memuat data pembatalan</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-6 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5">
              Coba Lagi
            </Button>
          </div>
        ) : cancellations.length === 0 ? (
          <div className="py-24 text-center">
            <PackageX className="h-14 w-14 text-slate-200 mx-auto mb-4" />
            <p className="font-bold text-slate-400 text-lg">Belum ada pembatalan</p>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Klik &quot;Catat Pembatalan&quot; untuk menambahkan paket yang dibatalkan.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-primary/5">
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-8 py-5">Kode Barang</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">Nomor Resi</TableHead>
                  <TableHead className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">Kurir</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">Alasan Pembatalan</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">Tanggal Batal</TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-8 py-5">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item, i) => (
                  <TableRow key={item.id || i} className="border-primary/5 hover:bg-primary/[0.02] transition-all group">
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                          <XCircle className="h-4 w-4 text-rose-400" />
                        </div>
                        <span className="font-mono text-sm font-bold text-primary">{item.item_code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <span className="font-mono text-xs text-muted-foreground bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        {item.resi_number || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center px-4 py-5">
                      <CourierBadge courier={item.courier} />
                    </TableCell>
                    <TableCell className="px-4 py-5 max-w-xs">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {item.reason || <span className="italic opacity-40">Tidak ada alasan</span>}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                        {formatDate(item.cancelled_at)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-8 py-5">
                      <button
                        onClick={(e) => openDelete(e, item.item_code)}
                        className="opacity-0 group-hover:opacity-100 transition-all h-8 w-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 flex items-center justify-center ml-auto"
                        title="Hapus catatan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-8 py-4 border-t border-primary/5 flex items-center justify-between bg-primary/[0.01]">
                <span className="text-xs text-muted-foreground font-medium">
                  Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} pembatalan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 px-3 text-xs font-bold rounded-xl border border-primary/10 text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    // Smart page range
                    let p: number;
                    if (totalPages <= 7) p = i + 1;
                    else if (page <= 4) p = i + 1;
                    else if (page >= totalPages - 3) p = totalPages - 6 + i;
                    else p = page - 3 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-8 w-8 text-xs font-bold rounded-xl transition-all ${
                          p === page
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "border border-primary/10 text-primary hover:bg-primary/5"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-8 px-3 text-xs font-bold rounded-xl border border-primary/10 text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* ── Add Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="rounded-3xl border-none shadow-2xl max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center">
                <Ban className="h-4 w-4 text-rose-500" />
              </div>
              Catat Pembatalan Paket
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Kode Barang <span className="text-rose-500">*</span>
              </Label>
              <Input
                required
                autoFocus
                placeholder="Contoh: QL-JKT-001"
                className="rounded-xl border-primary/10"
                value={form.item_code}
                onChange={(e) => setForm({ ...form, item_code: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Nomor Resi
                </Label>
                <Input
                  placeholder="Contoh: JNE123456"
                  className="rounded-xl border-primary/10"
                  value={form.resi_number}
                  onChange={(e) => setForm({ ...form, resi_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Kurir
                </Label>
                <Select
                  value={form.courier}
                  onValueChange={(val) => setForm({ ...form, courier: val })}
                >
                  <SelectTrigger className="w-full rounded-xl border-primary/10">
                    <SelectValue placeholder="Pilih kurir" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/5 shadow-xl">
                    {COURIERS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Alasan Pembatalan
              </Label>
              <Select
                value={useCustomReason ? "__custom__" : form.reason}
                onValueChange={(val) => {
                  if (val === "__custom__") {
                    setUseCustomReason(true);
                    setForm({ ...form, reason: "" });
                  } else {
                    setUseCustomReason(false);
                    setForm({ ...form, reason: val, reason_custom: "" });
                  }
                }}
              >
                <SelectTrigger className="w-full rounded-xl border-primary/10">
                  <SelectValue placeholder="Pilih alasan pembatalan..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-primary/5 shadow-xl">
                  {REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                  <SelectItem value="__custom__">✏️ Tulis sendiri...</SelectItem>
                </SelectContent>
              </Select>
              {useCustomReason && (
                <Input
                  autoFocus
                  placeholder="Tulis alasan pembatalan..."
                  className="rounded-xl border-primary/10 mt-2"
                  value={form.reason_custom}
                  onChange={(e) => setForm({ ...form, reason_custom: e.target.value })}
                />
              )}
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={addMutation.isPending}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-11 px-8 shadow-lg shadow-rose-500/20 transition-all"
              >
                {addMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Konfirmasi Pembatalan"
                )}
              </Button>
            </DialogFooter>
            {addMutation.isError && (
              <p className="text-xs text-rose-500 text-center font-medium">
                {(addMutation.error as Error).message}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────────── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-3xl border-none shadow-2xl max-w-sm w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Hapus Catatan?</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <Trash2 className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-rose-700">
                  {itemToDelete}
                </p>
                <p className="text-xs text-rose-500 mt-0.5">
                  Catatan pembatalan ini akan dihapus permanen.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => { setIsDeleteOpen(false); setItemToDelete(null); }}
              className="rounded-xl font-bold"
            >
              Batal
            </Button>
            <Button
              onClick={() => itemToDelete && deleteMutation.mutate(itemToDelete)}
              disabled={deleteMutation.isPending}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
