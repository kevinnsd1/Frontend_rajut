import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon } from "lucide-react";

export default function InputBarangPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Input Barang</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tambahkan produk baru ke dalam sistem inventaris VogueManage.
        </p>
      </div>

      <Card className="border-slate-100 shadow-sm rounded-xl bg-white p-8">
        <form className="space-y-12">
          {/* Foto Produk */}
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Foto Produk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unggah foto produk beresolusi tinggi. Format: JPG, PNG.
              </p>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors h-64 relative overflow-hidden group">
               {/* Figma Decorative Mockup */}
               <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-[80%] h-[80%] bg-gradient-to-t from-slate-200 to-slate-100 rounded-lg shadow-inner relative flex items-end justify-center pb-4">
                     {/* Pedestal */}
                     <div className="w-32 h-12 bg-[#dcd0c0] rounded-full shadow-lg relative z-10"></div>
                     {/* Left Pillar */}
                     <div className="absolute left-8 bottom-16 w-8 h-32 bg-slate-400 rounded-t-md -rotate-6 transform origin-bottom"></div>
                     {/* Right Pillar */}
                     <div className="absolute right-8 bottom-12 w-6 h-40 bg-slate-500 rounded-t-md rotate-12 transform origin-bottom"></div>
                  </div>
               </div>
               <div className="relative z-20 flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl border shadow-sm mt-8">
                 <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                 <span className="text-sm font-medium text-slate-600">Klik untuk mengunggah</span>
                 <span className="text-xs text-slate-400 mt-1">atau tarik dan lepas di sini</span>
               </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

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
                <Label htmlFor="kode" className="text-xs font-bold tracking-widest text-slate-500 uppercase">Kode Barang</Label>
                <Input id="kode" placeholder="Contoh: VG-JKT-001" className="bg-white border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-xs font-bold tracking-widest text-slate-500 uppercase">Nama Barang</Label>
                <Input id="nama" placeholder="Contoh: Classic Leather Jacket" className="bg-white border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kategori" className="text-xs font-bold tracking-widest text-slate-500 uppercase">Kategori</Label>
                  <Select>
                    <SelectTrigger id="kategori" className="bg-white border-slate-200">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outerwear">Outerwear</SelectItem>
                      <SelectItem value="tops">Tops</SelectItem>
                      <SelectItem value="bottoms">Bottoms</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stok" className="text-xs font-bold tracking-widest text-slate-500 uppercase">Jumlah Stok</Label>
                  <Input id="stok" type="number" placeholder="0" className="bg-white border-slate-200" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Deskripsi Produk */}
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Deskripsi Produk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Berikan penjelasan detail mengenai bahan, ukuran, dan fitur produk.
              </p>
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Tulis deskripsi produk di sini..." 
                className="min-h-[150px] bg-white border-slate-200 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="ghost" type="button" className="text-slate-600 hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="button" className="bg-black text-white hover:bg-black/80 px-8">
              Save Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
