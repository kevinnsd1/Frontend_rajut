"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function ReturBarangPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: returns = [], isLoading, error, refetch } = useQuery<ReturnItem[]>({
    queryKey: ["returns"],
    queryFn: () => apiService.getReturns(),
    refetchInterval: 1000 * 60 * 10,
    refetchIntervalInBackground: false,
  });

  const pendingCount  = returns.filter(r => r.status?.toUpperCase() === "PENDING").length;
  const resolvedCount = returns.filter(r => r.status?.toUpperCase() === "RESOLVED").length;
  const totalPages    = Math.max(1, Math.ceil(returns.length / pageSize));
  const paginated     = returns.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
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
            {/* Scrollable Table */}
            <div className="overflow-x-auto">
              <div className="max-h-[420px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
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
              </div>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/[0.01]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Tampilkan</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                  <SelectTrigger className="h-8 w-20 rounded-xl border-primary/10 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {[5, 10, 20].map((s) => (
                      <SelectItem key={s} value={String(s)} className="text-xs font-bold">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="font-medium">item — Total <strong>{returns.length}</strong></span>
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent className="flex items-center gap-1">
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} className={`rounded-xl cursor-pointer font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all ${page === 1 ? "pointer-events-none opacity-40" : ""}`} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      if (totalPages > 5 && p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                        if (p === 2 || p === totalPages - 1) return <PaginationItem key={p}><PaginationEllipsis className="text-primary/40" /></PaginationItem>;
                        return null;
                      }
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink onClick={() => setPage(p)} isActive={p === page} className={`rounded-xl cursor-pointer text-xs font-bold transition-all ${p === page ? "bg-primary text-white hover:bg-primary/90 hover:text-white shadow-md shadow-primary/20" : "hover:bg-primary/5 hover:text-primary text-muted-foreground"}`}>{p}</PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} className={`rounded-xl cursor-pointer font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all ${page === totalPages ? "pointer-events-none opacity-40" : ""}`} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
