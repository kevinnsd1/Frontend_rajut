"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Loader2, CheckCircle2, PackageX } from "lucide-react";
import { apiService } from "@/services/api";

interface ReturnItem {
  id?: number;
  sku_code?: string;
  product_name?: string;
  reason?: string;
  status?: string;
  created_at?: string;
}

const PAGE_SIZE = 10;

export default function ReturBarangPage() {
  const [page, setPage] = useState(1);

  const { data: returns = [], isLoading, error, refetch } = useQuery<ReturnItem[]>({
    queryKey: ["returns"],
    queryFn: () => apiService.getReturns(),
    refetchInterval: 1000 * 60 * 10,
    refetchIntervalInBackground: false,
  });

  const pendingCount  = returns.filter(r => r.status?.toUpperCase() === "PENDING").length;
  const resolvedCount = returns.filter(r => r.status?.toUpperCase() === "RESOLVED").length;
  const totalPages    = Math.max(1, Math.ceil(returns.length / PAGE_SIZE));
  const paginated     = returns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Retur Barang</h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar otomatis paket yang terdeteksi retur dari sistem pelacakan.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-primary/40 uppercase">Inspeksi Tertunda</p>
            <p className="text-2xl font-black text-rose-500">{pendingCount}</p>
          </div>
          <div className="w-px h-8 bg-primary/10" />
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-primary/40 uppercase">Selesai</p>
            <p className="text-2xl font-black text-slate-900">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Memuat Data...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-destructive text-center px-8">
            <AlertCircle className="h-10 w-10 opacity-40 mb-4" />
            <p className="font-bold">Gagal memuat data retur</p>
            <p className="text-xs opacity-60 mt-1">{(error as Error).message}</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-6 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5">
              Coba Lagi
            </Button>
          </div>
        ) : returns.length === 0 ? (
          <div className="py-24 text-center">
            <PackageX className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="font-bold text-slate-400">Belum ada retur terdeteksi</p>
            <p className="text-xs text-slate-400 mt-1">
              Sistem akan otomatis mencatat retur saat paket terdeteksi dikembalikan.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-primary/5">
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-8 py-5">Kode Barang</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">Nama Produk</TableHead>
                  <TableHead className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-4 py-5">Alasan / Catatan</TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-8 py-5">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item, i) => (
                  <TableRow key={item.id || i} className="border-primary/5 hover:bg-primary/[0.02] transition-all">
                    <TableCell className="py-5 px-8">
                      <span className="font-mono text-sm font-bold text-primary">{item.sku_code || "—"}</span>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <span className="text-sm font-semibold text-foreground">{item.product_name || item.sku_code || "—"}</span>
                    </TableCell>
                    <TableCell className="text-center px-4 py-5">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border shadow-sm ${
                        item.status?.toUpperCase() === "PENDING"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : item.status?.toUpperCase() === "RESOLVED"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-primary/5 text-primary/60 border-primary/10"
                      }`}>
                        {item.status?.toUpperCase() === "PENDING"  && <AlertCircle className="w-3 h-3" />}
                        {item.status?.toUpperCase() === "RESOLVED" && <CheckCircle2 className="w-3 h-3" />}
                        {item.status || "PENDING"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-5 max-w-xs">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.reason || "—"}</p>
                    </TableCell>
                    <TableCell className="text-right px-8 py-5">
                      <span className="text-xs text-muted-foreground font-medium">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-8 py-4 border-t border-primary/5 flex items-center justify-between bg-primary/[0.01]">
                <span className="text-xs text-muted-foreground font-medium">
                  Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, returns.length)} dari {returns.length} retur
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 px-3 text-xs font-bold rounded-xl border border-primary/10 text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
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
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
    </div>
  );
}
