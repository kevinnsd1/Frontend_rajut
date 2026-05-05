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
import { Search, ClipboardCheck, AlertTriangle, Loader2, CheckCircle2, Play } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { apiService } from "@/services/api";

export default function StockOpnamePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [opnameId, setOpnameId] = useState<number | null>(null);
  const [opnameLoading, setOpnameLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState<string | null>(null);
  const [recordedItems, setRecordedItems] = useState<Record<string, number>>({});

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

  const handleStartOpname = async () => {
    setOpnameLoading(true);
    try {
      const data = await apiService.startStockOpname();
      setOpnameId(data.opname_id || data.id);
      alert(`Sesi Stock Opname #${data.opname_id || data.id} dimulai!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setOpnameLoading(false);
    }
  };

  const handleRecordItem = async (product: any, physicalStock: number) => {
    if (!opnameId) {
      alert("Mulai sesi Stock Opname terlebih dahulu!");
      return;
    }

    setRecordingLoading(product.sku_code);
    try {
      await apiService.recordOpnameItem({
        opname_id: opnameId,
        sku_code: product.sku_code,
        product_name: product.name,
        system_stock: product.stock,
        physical_stock: physicalStock
      });
      setRecordedItems(prev => ({ ...prev, [product.sku_code]: physicalStock }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRecordingLoading(null);
    }
  };

  const handleCompleteOpname = async () => {
    if (!opnameId) return;
    setOpnameLoading(true);
    try {
      await apiService.completeStockOpname(opnameId);
      alert("Stock Opname selesai! Selisih stok telah dihitung.");
      setOpnameId(null);
      setRecordedItems({});
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setOpnameLoading(false);
    }
  };

  const discrepancies = Object.keys(recordedItems).filter(sku => {
    const p = products.find(prod => prod.sku_code === sku);
    return p && p.stock !== recordedItems[sku];
  }).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Opname</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekonsiliasi stok sistem dengan inventaris fisik di gudang.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="flex items-center gap-4 px-5 py-3 border-primary/5 shadow-xl shadow-primary/5 bg-white rounded-2xl">
            <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-primary/60" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-primary/40 uppercase">Item Diperiksa</p>
              <p className="font-bold text-foreground">{Object.keys(recordedItems).length} / {products.length}</p>
            </div>
          </Card>
          <Card className={`flex items-center gap-4 px-5 py-3 border-rose-100 shadow-xl shadow-rose-500/5 bg-rose-50/50 rounded-2xl transition-opacity ${discrepancies > 0 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="h-10 w-10 rounded-2xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-rose-400 uppercase">Selisih Stok</p>
              <p className="font-bold text-rose-600">{discrepancies}</p>
            </div>
          </Card>
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
              placeholder="Cari Kode Barang..." 
              className="w-full pl-11 pr-4 py-2.5 bg-primary/5 border border-primary/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-3">
             {!opnameId ? (
               <Button onClick={handleStartOpname} disabled={opnameLoading} className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold px-6 shadow-lg shadow-primary/20">
                 {opnameLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
                 Mulai Opname
               </Button>
             ) : (
               <Button onClick={handleCompleteOpname} disabled={opnameLoading} className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold px-6 shadow-lg shadow-emerald-500/20">
                 {opnameLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                 Selesaikan Opname
               </Button>
             )}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">Memuat Produk...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-primary/5">
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Kode Barang & Detail</TableHead>
                <TableHead className="w-[150px] text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Stok Sistem</TableHead>
                <TableHead className="w-[200px] text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Stok Fisik</TableHead>
                <TableHead className="w-[100px] text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium italic">Tidak ada produk untuk diperiksa.</TableCell>
                </TableRow>
              ) : (
                products.map((item) => {
                  const isRecorded = item.sku_code in recordedItems;
                  const isMismatch = isRecorded && recordedItems[item.sku_code] !== item.stock;
                  
                  return (
                    <TableRow key={item.sku_code} className="border-primary/5 hover:bg-primary/[0.02] transition-colors group">
                      <TableCell className="py-5">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner`}>
                            <div className="w-6 h-8 bg-primary/20 rounded-md"></div>
                          </div>
                          <div>
                            <div className="font-mono text-[10px] font-bold text-primary/50">{item.sku_code}</div>
                            <div className="font-bold text-sm text-foreground">{item.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-muted-foreground py-5">
                        {item.stock}
                      </TableCell>
                      <TableCell className="text-center py-5">
                        <input
                          type="number"
                          disabled={!opnameId}
                          defaultValue={recordedItems[item.sku_code]}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) handleRecordItem(item, val);
                          }}
                          placeholder={!opnameId ? "Klik Mulai" : "Jumlah fisik"}
                          className={`w-28 text-center px-4 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                            !opnameId ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" :
                            isMismatch ? "bg-rose-50 border-rose-200 text-rose-600" :
                            isRecorded ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                            "bg-white border-primary/10 text-foreground"
                          }`}
                        />
                      </TableCell>
                      <TableCell className="text-center py-5">
                         {recordingLoading === item.sku_code ? (
                           <Loader2 className="h-5 w-5 animate-spin text-primary/40 mx-auto" />
                         ) : isRecorded ? (
                           <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                         ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
        
        <div className="p-6 border-t border-primary/5 flex items-center justify-between text-sm text-muted-foreground bg-primary/[0.02]">
          <div className="font-medium">Total {products.length} produk di katalog</div>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious href="#" className="hover:bg-primary/10 rounded-xl transition-colors h-10 px-4" />
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
