"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function InputBarangPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    sku_code: "",
    name: "",
    category: "",
    stock: 0,
    status: "AVAILABLE"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiService.saveProduct(formData);
      setSuccess(true);
      setFormData({
        sku_code: "",
        name: "",
        category: "",
        stock: 0,
        status: "AVAILABLE"
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Input Barang</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tambahkan produk baru ke dalam sistem inventaris QueenyLook.
        </p>
      </div>

      <Card className="border-primary/5 shadow-xl shadow-primary/5 rounded-2xl bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-12">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-bold">Produk berhasil disimpan!</p>
            </div>
          )}

          {/* Informasi Dasar */}
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Informasi Dasar</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Detail utama mengenai produk.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="kode" className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Kode Barang (SKU)</Label>
                <Input 
                  id="kode" 
                  required
                  value={formData.sku_code}
                  onChange={(e) => setFormData({ ...formData, sku_code: e.target.value })}
                  placeholder="Contoh: QL-JKT-001" 
                  className="bg-white border-primary/10 rounded-xl focus:border-primary" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Nama Barang</Label>
                <Input 
                  id="nama" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Queeny Rose Jacket" 
                  className="bg-white border-primary/10 rounded-xl focus:border-primary" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kategori" className="text-xs font-bold tracking-widest text-slate-500 uppercase">Kategori</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger id="kategori" className="bg-white border-slate-200 rounded-xl">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Outerwear">Outerwear</SelectItem>
                      <SelectItem value="Tops">Tops</SelectItem>
                      <SelectItem value="Bottoms">Bottoms</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stok" className="text-xs font-bold tracking-widest text-slate-500 uppercase">Jumlah Stok</Label>
                  <Input 
                    id="stok" 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0" 
                    className="bg-white border-slate-200 rounded-xl" 
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="ghost" 
              type="button" 
              onClick={() => setFormData({ sku_code: "", name: "", category: "", stock: 0, status: "AVAILABLE" })}
              className="text-muted-foreground hover:bg-primary/5 rounded-xl"
            >
              Reset
            </Button>
            <Button 
              disabled={loading}
              type="submit" 
              className="bg-primary text-primary-foreground hover:opacity-90 px-8 rounded-xl shadow-lg shadow-primary/20 font-bold min-w-[140px]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Simpan Produk"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
