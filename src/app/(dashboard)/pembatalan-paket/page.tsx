"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { 
  AlertCircle, 
  Loader2, 
  Ban, 
  PackageX, 
  Search, 
  Eye, 
  Trash2, 
  AlertTriangle,
  History,
  Truck
} from "lucide-react";
import { apiService } from "@/services/api";
import { TrackingTimeline } from "../../../components/TrackingTimeline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CancelledItem {
  id?: number;
  item_code: string;
  resi_number?: string;
  courier?: string;
  reason?: string;
  cancelled_at?: string;
}

const COURIER_LABEL: Record<string, string> = {
  jne: "JNE Express",
  jnt: "J&T Express",
  sicepat: "SiCepat",
  tiki: "TIKI",
  pos: "POS Indonesia",
  ninja: "Ninja Xpress",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PembatalanPaketPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  
  // States for Detail Modal
  const [selectedItem, setSelectedItem] = useState<CancelledItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // States for Delete Confirm
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: cancellations = [],
    isLoading,
    error,
    refetch,
  } = useQuery<CancelledItem[]>({
    queryKey: ["cancellations"],
    queryFn: () => apiService.getCancellations(),
    refetchInterval: 1000 * 60 * 5,
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (code: string) => apiService.deleteCancellation(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancellations"] });
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  });

  const handleDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
  };

  const filtered = cancellations.filter(
    (c) =>
      (c.item_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.resi_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.reason || "").toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Pembatalan Paket</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Daftar paket yang terdeteksi <span className="text-rose-500 font-bold">Dibatalkan</span> oleh sistem.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-white p-4 rounded-[2rem] border border-primary/5 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Total Batal</p>
            <p className="text-2xl font-black text-rose-500">{cancellations.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">

        {/* Toolbar */}
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
            Daftar Pembatalan
          </h3>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <input
              className="pl-11 pr-4 py-2.5 bg-white border-none shadow-sm rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/20 w-full text-slate-600 placeholder:text-slate-300"
              placeholder="Cari kode, resi, atau alasan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary/20" />
              <Ban className="h-5 w-5 text-rose-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">Memuat Data...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-destructive text-center px-8">
            <AlertCircle className="h-10 w-10 opacity-40 mb-4" />
            <p className="font-bold">Gagal memuat data pembatalan</p>
            <p className="text-xs opacity-60 mt-1">{(error as Error).message}</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-6 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold h-12 px-8">
              Coba Lagi
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-50">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-8 py-6">Kode Barang</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-6">Nomor Resi</TableHead>
                      <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-6">Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-6">Alasan</TableHead>
                      <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 px-8 py-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-24 text-center border-none">
                          <div className="flex flex-col items-center opacity-20">
                            <PackageX className="h-16 w-16 mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest">Tidak Ada Data</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginated.map((item, i) => (
                        <TableRow key={item.id || i} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                          <TableCell className="py-6 px-8">
                             <div className="flex flex-col">
                              <span className="font-black text-sm text-slate-900 group-hover:text-rose-500 transition-colors">
                                {item.item_code || "—"}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {item.cancelled_at ? new Date(item.cancelled_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="px-4 py-6">
                             <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase">
                                  {item.courier || "N/A"}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-600">
                                {item.resi_number || "—"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-center px-4 py-6">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border shadow-sm bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50">
                              <Ban className="w-3 h-3" />
                              BATAL
                            </span>
                          </TableCell>

                          <TableCell className="px-4 py-6 max-w-xs">
                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 italic">
                              "{item.reason || "—"}"
                            </p>
                          </TableCell>

                          <TableCell className="text-right px-8 py-6">
                            <div className="flex items-center justify-end gap-2">
                               <Button 
                                 size="icon"
                                 variant="ghost"
                                 className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5"
                                 onClick={() => {
                                   setSelectedItem(item);
                                   setIsDetailOpen(true);
                                 }}
                               >
                                 <Eye className="h-4 w-4" />
                               </Button>
                               <Button 
                                 size="icon"
                                 variant="ghost"
                                 className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                 onClick={() => {
                                   setItemToDelete(item.item_code || null);
                                   setIsDeleteOpen(true);
                                 }}
                               >
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <div className="py-24 text-center opacity-20">
                  <PackageX className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest">Tidak Ada Data</p>
                </div>
              ) : (
                paginated.map((item, i) => (
                  <div key={item.id || i} className="p-6 space-y-4 bg-white hover:bg-slate-50/50 active:bg-slate-100/50 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 leading-none">{item.item_code}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {item.cancelled_at ? new Date(item.cancelled_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[8px] font-black tracking-widest uppercase px-2 py-1 rounded-full border bg-rose-50 text-rose-600 border-rose-100">
                        BATAL
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                      <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Ban className="h-4 w-4 text-rose-400/60" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{item.courier || "Kurir N/A"}</p>
                        <p className="font-mono text-[11px] font-bold text-slate-600 truncate">{item.resi_number || "—"}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic font-medium leading-relaxed px-1">
                      "{item.reason || "—"}"
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 rounded-2xl h-11 font-bold text-xs bg-slate-900 text-white hover:bg-slate-800"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        Detail Lacak
                      </Button>
                      <Button 
                        variant="ghost"
                        className="rounded-2xl h-11 w-11 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                        onClick={() => {
                          setItemToDelete(item.item_code || null);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                <span>Tampilkan</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                  <SelectTrigger className="h-10 w-20 rounded-2xl border-none bg-white shadow-sm font-black text-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    {[5, 10, 20, 50].map((s) => (
                      <SelectItem key={s} value={String(s)} className="text-xs font-bold rounded-xl">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>Total <strong className="text-slate-900">{filtered.length}</strong> Item</span>
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent className="flex items-center gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        className={`rounded-2xl h-10 w-10 p-0 flex items-center justify-center bg-white shadow-sm transition-all border-none hover:bg-primary hover:text-white ${page === 1 ? "pointer-events-none opacity-20" : "cursor-pointer"}`} 
                      />
                    </PaginationItem>
                    
                    <div className="flex items-center gap-1.5 px-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        if (totalPages > 5 && p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                          if (p === 2 || p === totalPages - 1) return <PaginationItem key={p}><PaginationEllipsis className="text-slate-300" /></PaginationItem>;
                          return null;
                        }
                        return (
                          <PaginationItem key={p}>
                            <PaginationLink 
                              onClick={() => setPage(p)} 
                              isActive={p === page} 
                              className={`rounded-xl h-10 w-10 text-xs font-black border-none transition-all cursor-pointer ${p === page ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110" : "bg-white text-slate-400 hover:text-primary hover:bg-primary/5"}`}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    </div>

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                        className={`rounded-2xl h-10 w-10 p-0 flex items-center justify-center bg-white shadow-sm transition-all border-none hover:bg-primary hover:text-white ${page === totalPages ? "pointer-events-none opacity-20" : "cursor-pointer"}`} 
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
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-8 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <History className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-slate-900">Detail Lacak Pembatalan</DialogTitle>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    {selectedItem?.courier} • {selectedItem?.resi_number}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {selectedItem?.resi_number ? (
               <TrackingTimeline 
                 resi={selectedItem.resi_number} 
                 courier={selectedItem.courier}
               />
            ) : (
               <div className="py-12 text-center bg-white rounded-3xl border border-slate-100">
                  <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400 tracking-tight">Nomor Resi Tidak Tersedia</p>
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[400px]">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Hapus Data Batal?
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Catatan pembatalan untuk item <span className="font-bold text-slate-900">{itemToDelete}</span> akan dihapus permanen.
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
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Ya, Hapus"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
