"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Search, SlidersHorizontal, MoreHorizontal, Loader2, AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { apiService } from "@/services/api";

export default function DataBarangPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "LOW_STOCK":
        return "text-orange-600 bg-orange-50 border-orange-100";
      case "OUT_OF_STOCK":
        return "text-rose-600 bg-rose-50 border-rose-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Barang</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola dan pantau katalog inventaris pakaian Anda.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-primary bg-white border-primary/20 rounded-xl hover:bg-primary/5">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-lg shadow-primary/20 font-bold transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Item Baru
          </Button>
        </div>
      </div>

      <Card className="border-primary/5 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
        <div className="p-6 border-b border-primary/5 flex justify-between items-center bg-white gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary/40">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau kode..." 
              className="w-full pl-11 pr-4 py-2.5 bg-primary/5 border border-primary/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <Button variant="outline" className="text-primary border-primary/10 rounded-xl hover:bg-primary/5 h-10 px-5">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <p className="font-bold text-sm tracking-widest uppercase">Memuat Data...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-destructive gap-4 text-center px-8">
            <AlertCircle className="h-12 w-12 opacity-50" />
            <div>
               <p className="font-bold text-lg">Gagal Memuat Data</p>
               <p className="text-sm opacity-80 max-w-xs">{error}</p>
            </div>
            <Button onClick={fetchProducts} variant="outline" className="mt-4 border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl">
               Coba Lagi
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-primary/5">
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">SKU Code</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Product Name</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Stok</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Status</TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                    Belum ada data barang tersedia.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((item) => (
                  <TableRow key={item.sku_code} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group">
                    <TableCell className="font-mono text-xs text-muted-foreground font-bold">{item.sku_code}</TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground font-medium">{item.stock}</TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border shadow-sm ${getStatusStyle(item.status || (item.stock > 10 ? 'AVAILABLE' : item.stock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK'))}`}>
                        {item.status || (item.stock > 10 ? 'Available' : item.stock > 0 ? 'Low Stock' : 'Out of Stock')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-xl">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        <div className="p-6 border-t border-primary/5 flex items-center justify-between text-sm text-muted-foreground bg-primary/[0.02]">
          <div className="font-medium">Menampilkan {products.length} entitas</div>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious href="#" className="hover:bg-primary/10 rounded-xl transition-colors h-10 px-4" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl h-10 w-10 border-none shadow-lg shadow-primary/20">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="hover:bg-primary/10 rounded-xl transition-colors h-10 px-4 text-primary font-bold" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
