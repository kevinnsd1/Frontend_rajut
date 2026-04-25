import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MoreVertical, AlertCircle, Info } from "lucide-react";

export default function ReturBarangPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Retur Barang</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage product returns, inspections, and resolutions.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Pending Inspection</p>
            <p className="text-xl font-bold text-red-500">12</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Resolved This Week</p>
            <p className="text-xl font-bold text-slate-900">48</p>
          </div>
          <Button className="bg-black text-white hover:bg-black/80 ml-4">
            <Plus className="mr-2 h-4 w-4" /> Log New Return
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-bold tracking-widest uppercase text-slate-400">
          <div className="col-span-3">Item Details</div>
          <div className="col-span-2">Kode Barang</div>
          <div className="col-span-2">Status Retur</div>
          <div className="col-span-4">Alasan Retur / Notes</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Rows */}
        <Card className="border-slate-100 shadow-sm rounded-xl bg-white p-6 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3 flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center">
              <span className="text-[10px] text-white/50">Image</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Silk Blouse</h3>
              <p className="text-xs text-slate-500">Size: M</p>
            </div>
          </div>
          <div className="col-span-2 font-mono text-xs text-slate-600">
            SKU-BL-092-IV
          </div>
          <div className="col-span-2">
            <span className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-red-100 text-red-600">
              <AlertCircle className="w-3 h-3 mr-1" /> Pending
            </span>
          </div>
          <div className="col-span-4 text-xs text-red-600 flex gap-2 items-start">
             <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
             <p className="leading-relaxed">Damaged fabric upon arrival. Major tear on the left sleeve seam. Customer requested immediate replacement.</p>
          </div>
          <div className="col-span-1 flex justify-end">
             <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
               <MoreVertical className="h-4 w-4" />
             </Button>
          </div>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-xl bg-white p-6 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center">
               <span className="text-[10px] text-white/50">Image</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Tailored Trousers</h3>
              <p className="text-xs text-slate-500">Size: 32</p>
            </div>
          </div>
          <div className="col-span-2 font-mono text-xs text-slate-600">
            SKU-TR-443-BK
          </div>
          <div className="col-span-2">
            <span className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              <Info className="w-3 h-3 mr-1" /> In Progress
            </span>
          </div>
          <div className="col-span-4 text-xs text-slate-500 flex gap-2 items-start">
             <Info className="w-4 h-4 shrink-0 mt-0.5" />
             <p className="leading-relaxed">Size too small. Does not match sizing chart specifications. Exchange for Size 34 initiated.</p>
          </div>
          <div className="col-span-1 flex justify-end">
             <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
               <MoreVertical className="h-4 w-4" />
             </Button>
          </div>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-xl bg-white p-6 grid grid-cols-12 gap-4 items-center opacity-60">
          <div className="col-span-3 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
               <span className="text-[10px] text-slate-400">Image</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Classic Leather Tote</h3>
              <p className="text-xs text-slate-500">Size: OS</p>
            </div>
          </div>
          <div className="col-span-2 font-mono text-xs text-slate-600">
            SKU-GH-110-WH
          </div>
          <div className="col-span-2">
            <span className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-green-100 text-green-600">
              Resolved
            </span>
          </div>
          <div className="col-span-4 text-xs text-slate-400 flex gap-2 items-start">
             <p className="italic">Resolution completed. Refund processed.</p>
          </div>
          <div className="col-span-1 flex justify-end">
             <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
               <MoreVertical className="h-4 w-4" />
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
